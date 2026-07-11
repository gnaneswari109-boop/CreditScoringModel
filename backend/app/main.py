"""
CreditSense AI - FastAPI Backend Application
=============================================

Endpoints:
  GET  /health        - Health check
  POST /train         - Retrain all models
  POST /predict       - Single prediction
  POST /batch-predict  - Batch predictions from CSV rows
  GET  /model-info    - Best model info and metrics
  GET  /models         - List all models with metrics

Run:
    uvicorn app.main:app --reload --port 8000
"""

import os
import json
import subprocess
import sys
from pathlib import Path
from typing import List, Optional

import joblib
import numpy as np
import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------
BASE_DIR = Path(__file__).resolve().parent.parent.parent
MODELS_DIR = BASE_DIR / "models"
MODEL_PATH = MODELS_DIR / "credit_model.pkl"
METRICS_PATH = MODELS_DIR / "metrics.json"
TRAIN_SCRIPT = BASE_DIR / "backend" / "train.py"

app = FastAPI(
    title="CreditSense AI API",
    description="Intelligent Credit Scoring & Creditworthiness Prediction System",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization", "X-Client-Info", "Apikey"],
)


# ---------------------------------------------------------------------------
# Pydantic Models
# ---------------------------------------------------------------------------
class PredictionInput(BaseModel):
    age: int = Field(..., ge=18, le=100)
    annual_income: float = Field(..., ge=0)
    employment_status: str = "Employed"
    occupation: str = "Other"
    years_employed: int = Field(0, ge=0, le=50)
    credit_history_length: int = Field(0, ge=0, le=50)
    monthly_debt: float = Field(0, ge=0)
    existing_loans: int = Field(0, ge=0, le=20)
    loan_amount: float = Field(..., ge=0)
    loan_purpose: str = "Personal"
    savings: float = Field(0, ge=0)
    checking_balance: float = Field(0, ge=0)
    payment_history: str = "Good"
    credit_utilization: float = Field(0, ge=0, le=100)
    debt_to_income: float = Field(0, ge=0, le=100)
    num_credit_cards: int = Field(0, ge=0, le=20)
    dependents: int = Field(0, ge=0, le=10)
    housing_type: str = "Rent"
    marital_status: str = "Single"


class PredictionResult(BaseModel):
    approved: bool
    confidence: float
    credit_score: int
    risk_level: str
    probability: float
    recommendation: str
    suggestions: List[str]
    feature_contributions: List[dict]


# ---------------------------------------------------------------------------
# Helper Functions
# ---------------------------------------------------------------------------
def load_model():
    if not MODEL_PATH.exists():
        return None
    try:
        return joblib.load(MODEL_PATH)
    except Exception:
        return None


def load_metrics():
    if not METRICS_PATH.exists():
        return None
    try:
        with open(METRICS_PATH) as f:
            return json.load(f)
    except Exception:
        return None


def compute_risk_level(probability: float) -> str:
    if probability >= 0.75:
        return "low"
    elif probability >= 0.45:
        return "medium"
    return "high"


def compute_credit_score(probability: float) -> int:
    return int(300 + probability * 550)


def generate_suggestions(input_data: PredictionInput) -> List[str]:
    suggestions = []
    dti = (input_data.monthly_debt * 12) / max(input_data.annual_income, 1) * 100

    if dti > 36:
        suggestions.append(
            "Reduce your monthly debt obligations to improve your debt-to-income ratio. Target below 36%."
        )
    if input_data.credit_utilization > 30:
        suggestions.append(
            "Lower your credit card utilization below 30% to significantly boost your credit score."
        )
    if input_data.payment_history in ("Fair", "Poor"):
        suggestions.append(
            "Set up automatic payments to ensure all bills are paid on time. Payment history is the biggest factor."
        )
    if input_data.savings / max(input_data.annual_income, 1) < 0.3:
        suggestions.append(
            "Build an emergency fund covering 3-6 months of expenses to strengthen your financial profile."
        )
    if input_data.credit_history_length < 5:
        suggestions.append(
            "Keep older credit accounts open to lengthen your credit history average."
        )
    if input_data.employment_status in ("Unemployed", "Student"):
        suggestions.append(
            "Stable employment history improves creditworthiness. Maintain consistent income sources."
        )
    if not suggestions:
        suggestions.append(
            "Your financial profile is strong. Continue maintaining good credit habits and regular savings."
        )
    return suggestions


def generate_recommendation(approved: bool, confidence: float, risk_level: str) -> str:
    if approved:
        return (
            f"Based on the analysis, this applicant has a {confidence}% likelihood of being "
            f"creditworthy. The financial profile indicates {risk_level} risk. "
            f"Loan approval is recommended with standard terms."
        )
    return (
        f"This applicant shows a {confidence}% probability of default risk. "
        f"The financial profile indicates {risk_level} risk. "
        f"Consider requesting additional collateral, a co-signer, or declining the application."
    )


def input_to_dataframe(input_data: PredictionInput) -> pd.DataFrame:
    """Convert input to a DataFrame matching training features."""
    data = {
        "age": input_data.age,
        "annual_income": input_data.annual_income,
        "employment_status": input_data.employment_status,
        "occupation": input_data.occupation,
        "years_employed": input_data.years_employed,
        "credit_history_length": input_data.credit_history_length,
        "monthly_debt": input_data.monthly_debt,
        "existing_loans": input_data.existing_loans,
        "loan_amount": input_data.loan_amount,
        "loan_purpose": input_data.loan_purpose,
        "savings": input_data.savings,
        "checking_balance": input_data.checking_balance,
        "payment_history": input_data.payment_history,
        "num_credit_cards": input_data.num_credit_cards,
        "dependents": input_data.dependents,
        "marital_status": input_data.marital_status,
        "housing_type": input_data.housing_type,
        "debt_to_income": input_data.debt_to_income,
        "credit_utilization": input_data.credit_utilization,
    }
    return pd.DataFrame([data])


def preprocess_input(input_data: PredictionInput, model_data: dict) -> np.ndarray:
    """Preprocess input using the saved scaler and encoders."""
    df = input_to_dataframe(input_data)
    scaler = model_data["scaler"]
    label_encoders = model_data["label_encoders"]
    feature_names = model_data["feature_names"]

    # Label encode categorical columns
    for col, le in label_encoders.items():
        if col in df.columns:
            try:
                df[col] = le.transform(df[col].astype(str))
            except ValueError:
                df[col] = 0

    # One-hot encode nominal columns
    onehot_cols = ["occupation", "loan_purpose", "marital_status"]
    existing = [c for c in onehot_cols if c in df.columns]
    if existing:
        df = pd.get_dummies(df, columns=existing, drop_first=True)

    # Ensure all training features exist
    for feat in feature_names:
        if feat not in df.columns:
            df[feat] = 0

    # Select and order features
    df = df[feature_names]
    df = df.apply(pd.to_numeric, errors="coerce").fillna(0)

    # Scale
    scaled = scaler.transform(df)
    return scaled


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------
@app.get("/health")
def health():
    model_loaded = load_model() is not None
    metrics = load_metrics()
    return {
        "status": "healthy",
        "model_loaded": model_loaded,
        "metrics_available": metrics is not None,
        "version": "1.0.0",
    }


@app.post("/train")
def train_models():
    """Trigger model retraining."""
    try:
        result = subprocess.run(
            [sys.executable, str(TRAIN_SCRIPT)],
            capture_output=True,
            text=True,
            timeout=300,
        )
        if result.returncode != 0:
            raise HTTPException(
                status_code=500,
                detail=f"Training failed: {result.stderr[:500]}",
            )
        metrics = load_metrics()
        return {
            "success": True,
            "message": "Models trained successfully",
            "best_model": metrics.get("best_model") if metrics else None,
            "output": result.stdout[-500:],
        }
    except subprocess.TimeoutExpired:
        raise HTTPException(status_code=504, detail="Training timed out")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/predict", response_model=PredictionResult)
def predict(input_data: PredictionInput):
    """Make a single creditworthiness prediction."""
    model_data = load_model()
    if model_data is None:
        raise HTTPException(
            status_code=503,
            detail="Model not trained. Call /train first or run train.py.",
        )

    try:
        processed = preprocess_input(input_data, model_data)
        model = model_data["model"]
        probability = float(model.predict_proba(processed)[0, 1])
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

    approved = probability >= 0.5
    confidence = round((probability if approved else 1 - probability) * 100, 1)
    credit_score = compute_credit_score(probability)
    risk_level = compute_risk_level(probability)

    # Feature contributions
    feature_contributions = []
    if hasattr(model, "feature_importances_"):
        feature_names = model_data["feature_names"]
        importances = model.feature_importances_
        feature_contributions = [
            {"feature": feature_names[i], "contribution": float(importances[i])}
            for i in np.argsort(importances)[::-1][:15]
        ]

    return PredictionResult(
        approved=approved,
        confidence=confidence,
        credit_score=credit_score,
        risk_level=risk_level,
        probability=round(probability * 100, 1),
        recommendation=generate_recommendation(approved, confidence, risk_level),
        suggestions=generate_suggestions(input_data),
        feature_contributions=feature_contributions,
    )


@app.post("/batch-predict", response_model=List[PredictionResult])
def batch_predict(inputs: List[PredictionInput]):
    """Make batch predictions."""
    results = []
    for inp in inputs:
        try:
            model_data = load_model()
            if model_data is None:
                raise HTTPException(status_code=503, detail="Model not trained")
            processed = preprocess_input(inp, model_data)
            model = model_data["model"]
            probability = float(model.predict_proba(processed)[0, 1])
            approved = probability >= 0.5
            confidence = round((probability if approved else 1 - probability) * 100, 1)
            credit_score = compute_credit_score(probability)
            risk_level = compute_risk_level(probability)
            results.append(PredictionResult(
                approved=approved,
                confidence=confidence,
                credit_score=credit_score,
                risk_level=risk_level,
                probability=round(probability * 100, 1),
                recommendation=generate_recommendation(approved, confidence, risk_level),
                suggestions=generate_suggestions(inp),
                feature_contributions=[],
            ))
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
    return results


@app.get("/model-info")
def model_info():
    """Return model metadata and metrics."""
    metrics = load_metrics()
    if metrics is None:
        raise HTTPException(status_code=404, detail="No trained model found")
    return metrics


@app.get("/models")
def list_models():
    """List all models with their metrics."""
    metrics = load_metrics()
    if metrics is None:
        raise HTTPException(status_code=404, detail="No trained model found")
    return metrics.get("models", [])


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
