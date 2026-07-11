"""
CreditSense AI - Machine Learning Training Pipeline
====================================================

This module handles:
  1. Data loading and cleaning (missing values, duplicates)
  2. Feature engineering from financial history
  3. Encoding (label + one-hot) and standard scaling
  4. Feature selection and outlier detection
  5. Train/test split (80/20)
  6. Training three models: Logistic Regression, Decision Tree, Random Forest
  7. Evaluation (Accuracy, Precision, Recall, F1, ROC-AUC, Confusion Matrix)
  8. Automatic best-model selection by ROC-AUC
  9. Saving the best model to models/credit_model.pkl
 10. Generating evaluation charts saved to assets/

Usage:
    python train.py
"""

import os
import json
import warnings
from pathlib import Path

import numpy as np
import pandas as pd
import joblib

from sklearn.model_selection import train_test_split, learning_curve
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
    confusion_matrix,
    classification_report,
    roc_curve,
)

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import seaborn as sns

warnings.filterwarnings("ignore")

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------
BASE_DIR = Path(__file__).resolve().parent.parent
DATASET_PATH = BASE_DIR / "dataset" / "credit_data.csv"
MODELS_DIR = BASE_DIR / "models"
ASSETS_DIR = BASE_DIR / "assets"
METRICS_PATH = MODELS_DIR / "metrics.json"

RANDOM_STATE = 42
TEST_SIZE = 0.2

# Ensure directories exist
MODELS_DIR.mkdir(parents=True, exist_ok=True)
ASSETS_DIR.mkdir(parents=True, exist_ok=True)


# ---------------------------------------------------------------------------
# 1. Synthetic Data Generation (fallback when no dataset file exists)
# ---------------------------------------------------------------------------
def generate_synthetic_data(n_samples: int = 1000) -> pd.DataFrame:
    """Generate a realistic credit scoring dataset."""
    np.random.seed(RANDOM_STATE)

    data = pd.DataFrame({
        "age": np.random.randint(18, 70, n_samples),
        "gender": np.random.choice(["male", "female"], n_samples),
        "annual_income": np.random.lognormal(mean=11, sigma=0.5, size=n_samples).round(2),
        "employment_status": np.random.choice(
            ["Employed", "Self-Employed", "Unemployed", "Retired", "Student"],
            n_samples, p=[0.55, 0.15, 0.1, 0.12, 0.08],
        ),
        "occupation": np.random.choice([
            "Software Engineer", "Data Scientist", "Doctor", "Teacher",
            "Accountant", "Sales Representative", "Manager", "Technician",
            "Nurse", "Business Owner", "Government Employee", "Other",
        ], n_samples),
        "years_employed": np.random.randint(0, 35, n_samples),
        "credit_history_length": np.random.randint(0, 30, n_samples),
        "monthly_debt": np.random.randint(0, 5000, n_samples).astype(float),
        "existing_loans": np.random.randint(0, 8, n_samples),
        "loan_amount": np.random.randint(1000, 200000, n_samples).astype(float),
        "loan_duration": np.random.randint(6, 72, n_samples),
        "loan_purpose": np.random.choice([
            "Home", "Car", "Education", "Business",
            "Debt Consolidation", "Personal", "Medical", "Other",
        ], n_samples),
        "savings": np.random.randint(0, 100000, n_samples).astype(float),
        "checking_balance": np.random.randint(0, 50000, n_samples).astype(float),
        "payment_history": np.random.choice(
            ["Excellent", "Good", "Fair", "Poor"],
            n_samples, p=[0.3, 0.4, 0.2, 0.1],
        ),
        "num_credit_cards": np.random.randint(0, 12, n_samples),
        "dependents": np.random.randint(0, 6, n_samples),
        "marital_status": np.random.choice(
            ["Single", "Married", "Divorced", "Widowed"], n_samples
        ),
        "housing_type": np.random.choice(
            ["Own", "Rent", "Mortgage", "Other"], n_samples, p=[0.3, 0.35, 0.3, 0.05]
        ),
    })

    # Engineered features
    data["debt_to_income"] = (
        (data["monthly_debt"] * 12) / data["annual_income"] * 100
    ).round(2)
    data["credit_utilization"] = np.random.randint(0, 100, n_samples).astype(float)
    data["savings_to_income"] = (
        data["savings"] / data["annual_income"]
    ).round(4)
    data["loan_to_income"] = (
        data["loan_amount"] / data["annual_income"]
    ).round(4)

    # Generate target based on a weighted logistic function
    payment_map = {"Excellent": 1.0, "Good": 0.75, "Fair": 0.45, "Poor": 0.15}
    emp_map = {"Employed": 1.0, "Self-Employed": 0.85, "Retired": 0.7,
               "Student": 0.3, "Unemployed": 0.1}
    house_map = {"Own": 1.0, "Mortgage": 0.85, "Rent": 0.55, "Other": 0.4}

    logit = (
        -1.2
        + ((data["age"] - 18) / 50).clip(0, 1) * 0.6
        + (data["annual_income"] / 200000).clip(0, 1) * 1.5
        + (data["credit_history_length"] / 25).clip(0, 1) * 1.2
        + (data["years_employed"] / 20).clip(0, 1) * 0.8
        + (data["savings_to_income"]).clip(0, 1) * 1.0
        + (data["checking_balance"] / 20000).clip(0, 1) * 0.7
        + (1 - data["credit_utilization"] / 100).clip(0, 1) * 1.3
        + (1 - data["debt_to_income"] / 100).clip(0, 1) * 1.6
        + (1 - data["loan_to_income"]).clip(0, 1) * 0.9
        + data["employment_status"].map(emp_map) * 1.1
        + data["payment_history"].map(payment_map) * 1.8
        + data["housing_type"].map(house_map) * 0.5
        - (data["dependents"] / 6).clip(0, 1) * 0.5
        + np.random.normal(0, 0.3, n_samples)
    )

    prob = 1 / (1 + np.exp(-logit))
    data["creditworthy"] = (prob >= 0.5).astype(int)

    return data


# ---------------------------------------------------------------------------
# 2. Data Preprocessing
# ---------------------------------------------------------------------------
def load_data() -> pd.DataFrame:
    """Load dataset from file or generate synthetic data."""
    if DATASET_PATH.exists():
        df = pd.read_csv(DATASET_PATH)
        print(f"Loaded dataset from {DATASET_PATH} ({len(df)} rows)")
    else:
        print("Dataset file not found. Generating synthetic data...")
        df = generate_synthetic_data(1000)
        df.to_csv(DATASET_PATH, index=False)
        print(f"Saved synthetic dataset to {DATASET_PATH}")
    return df


def clean_data(df: pd.DataFrame) -> pd.DataFrame:
    """Handle missing values and remove duplicates."""
    # Missing values
    for col in df.select_dtypes(include=[np.number]).columns:
        df[col] = df[col].fillna(df[col].median())
    for col in df.select_dtypes(include=["object"]).columns:
        df[col] = df[col].fillna(df[col].mode()[0])

    # Remove duplicates
    before = len(df)
    df = df.drop_duplicates().reset_index(drop=True)
    after = len(df)
    if before != after:
        print(f"Removed {before - after} duplicate rows")
    return df


def detect_outliers(df: pd.DataFrame, columns: list) -> pd.DataFrame:
    """Cap outliers using IQR method."""
    for col in columns:
        if col not in df.columns:
            continue
        Q1 = df[col].quantile(0.25)
        Q3 = df[col].quantile(0.75)
        IQR = Q3 - Q1
        lower = Q1 - 1.5 * IQR
        upper = Q3 + 1.5 * IQR
        df[col] = df[col].clip(lower, upper)
    return df


def engineer_features(df: pd.DataFrame) -> pd.DataFrame:
    """Create new features from financial history."""
    # Debt-to-income ratio
    if "debt_to_income" not in df.columns:
        df["debt_to_income"] = (
            (df["monthly_debt"] * 12) / df["annual_income"].clip(lower=1) * 100
        ).round(2)

    # Savings-to-income ratio
    if "savings_to_income" not in df.columns:
        df["savings_to_income"] = (
            df["savings"] / df["annual_income"].clip(lower=1)
        ).round(4)

    # Loan-to-income ratio
    if "loan_to_income" not in df.columns:
        df["loan_to_income"] = (
            df["loan_amount"] / df["annual_income"].clip(lower=1)
        ).round(4)

    # Credit utilization (if not present, estimate)
    if "credit_utilization" not in df.columns:
        df["credit_utilization"] = (
            df["monthly_debt"] / (df["annual_income"] / 12).clip(lower=1) * 100
        ).clip(0, 100).round(2)

    return df


def encode_features(df: pd.DataFrame):
    """Label encode binary/categorical, one-hot encode nominal features."""
    label_encoders = {}

    # Label encoding for ordinal/binary columns
    label_cols = ["gender", "payment_history", "employment_status", "housing_type"]
    for col in label_cols:
        if col in df.columns:
            le = LabelEncoder()
            df[col] = le.fit_transform(df[col].astype(str))
            label_encoders[col] = le

    # One-hot encoding for nominal columns
    onehot_cols = ["occupation", "loan_purpose", "marital_status"]
    existing_onehot = [c for c in onehot_cols if c in df.columns]
    if existing_onehot:
        df = pd.get_dummies(df, columns=existing_onehot, drop_first=True)

    return df, label_encoders


def preprocess(df: pd.DataFrame):
    """Full preprocessing pipeline."""
    df = clean_data(df)
    df = engineer_features(df)

    numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
    if "creditworthy" in numeric_cols:
        numeric_cols.remove("creditworthy")
    df = detect_outliers(df, numeric_cols)

    df, label_encoders = encode_features(df)

    # Separate target
    y = df["creditworthy"]
    X = df.drop(columns=["creditworthy"])

    # Convert all to numeric
    X = X.apply(pd.to_numeric, errors="coerce").fillna(0)

    # Feature selection: drop low-variance columns
    from sklearn.feature_selection import VarianceThreshold
    selector = VarianceThreshold(threshold=0.01)
    X_selected = selector.fit_transform(X)
    selected_features = X.columns[selector.get_support()].tolist()
    X = pd.DataFrame(X_selected, columns=selected_features, index=X.index)

    # Standard scaling
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    X = pd.DataFrame(X_scaled, columns=selected_features, index=X.index)

    return X, y, scaler, label_encoders, selected_features


# ---------------------------------------------------------------------------
# 3. Model Training & Evaluation
# ---------------------------------------------------------------------------
def get_models():
    return {
        "Logistic Regression": LogisticRegression(
            max_iter=1000, random_state=RANDOM_STATE
        ),
        "Decision Tree": DecisionTreeClassifier(
            max_depth=10, random_state=RANDOM_STATE
        ),
        "Random Forest": RandomForestClassifier(
            n_estimators=200, max_depth=15, random_state=RANDOM_STATE, n_jobs=-1
        ),
    }


def evaluate_model(model, X_test, y_test):
    y_pred = model.predict(X_test)
    y_proba = model.predict_proba(X_test)[:, 1] if hasattr(model, "predict_proba") else y_pred

    metrics = {
        "accuracy": float(accuracy_score(y_test, y_pred)),
        "precision": float(precision_score(y_test, y_pred, average="weighted", zero_division=0)),
        "recall": float(recall_score(y_test, y_pred, average="weighted", zero_division=0)),
        "f1": float(f1_score(y_test, y_pred, average="weighted", zero_division=0)),
        "roc_auc": float(roc_auc_score(y_test, y_proba) if len(np.unique(y_test)) > 1 else 0.5),
    }
    return metrics, y_pred, y_proba


def plot_confusion_matrix(y_test, y_pred, model_name):
    cm = confusion_matrix(y_test, y_pred)
    plt.figure(figsize=(6, 5))
    sns.heatmap(cm, annot=True, fmt="d", cmap="Blues",
                xticklabels=["High Risk", "Creditworthy"],
                yticklabels=["High Risk", "Creditworthy"])
    plt.title(f"Confusion Matrix - {model_name}")
    plt.xlabel("Predicted")
    plt.ylabel("Actual")
    plt.tight_layout()
    plt.savefig(ASSETS_DIR / f"confusion_matrix_{model_name.lower().replace(' ', '_')}.png", dpi=150)
    plt.close()


def plot_roc_curves(models_data, y_test):
    plt.figure(figsize=(8, 6))
    for name, (_, y_proba) in models_data.items():
        fpr, tpr, _ = roc_curve(y_test, y_proba)
        auc = roc_auc_score(y_test, y_proba)
        plt.plot(fpr, tpr, label=f"{name} (AUC = {auc:.3f})")
    plt.plot([0, 1], [0, 1], "k--", label="Random")
    plt.xlabel("False Positive Rate")
    plt.ylabel("True Positive Rate")
    plt.title("ROC Curve Comparison")
    plt.legend()
    plt.tight_layout()
    plt.savefig(ASSETS_DIR / "roc_curve.png", dpi=150)
    plt.close()


def plot_feature_importance(model, feature_names, model_name):
    if not hasattr(model, "feature_importances_"):
        return
    importances = model.feature_importances_
    indices = np.argsort(importances)[::-1][:15]
    plt.figure(figsize=(10, 6))
    plt.barh(range(len(indices)), importances[indices][::-1])
    plt.yticks(range(len(indices)), [feature_names[i] for i in indices][::-1])
    plt.title(f"Feature Importance - {model_name}")
    plt.xlabel("Importance")
    plt.tight_layout()
    plt.savefig(ASSETS_DIR / "feature_importance.png", dpi=150)
    plt.close()


def plot_accuracy_comparison(results):
    names = list(results.keys())
    metrics_list = ["accuracy", "precision", "recall", "f1", "roc_auc"]
    x = np.arange(len(names))
    width = 0.15

    fig, ax = plt.subplots(figsize=(10, 6))
    for i, m in enumerate(metrics_list):
        values = [results[n]["metrics"][m] for n in names]
        ax.bar(x + i * width, values, width, label=m.capitalize())

    ax.set_ylabel("Score")
    ax.set_title("Model Performance Comparison")
    ax.set_xticks(x + width * 2)
    ax.set_xticklabels(names)
    ax.legend()
    plt.tight_layout()
    plt.savefig(ASSETS_DIR / "accuracy_comparison.png", dpi=150)
    plt.close()


def plot_class_distribution(df):
    plt.figure(figsize=(6, 5))
    sns.countplot(data=df, x="creditworthy", palette="Set2")
    plt.title("Class Distribution")
    plt.xticks([0, 1], ["High Risk", "Creditworthy"])
    plt.xlabel("Creditworthiness")
    plt.ylabel("Count")
    plt.tight_layout()
    plt.savefig(ASSETS_DIR / "class_distribution.png", dpi=150)
    plt.close()


def plot_correlation_heatmap(df):
    numeric_df = df.select_dtypes(include=[np.number])
    corr = numeric_df.corr()
    plt.figure(figsize=(12, 10))
    sns.heatmap(corr, annot=True, fmt=".2f", cmap="coolwarm", center=0, square=True)
    plt.title("Correlation Heatmap")
    plt.tight_layout()
    plt.savefig(ASSETS_DIR / "correlation_heatmap.png", dpi=150)
    plt.close()


def plot_learning_curve(model, X, y, model_name):
    train_sizes, train_scores, test_scores = learning_curve(
        model, X, y, cv=5, scoring="accuracy",
        train_sizes=np.linspace(0.1, 1.0, 8), random_state=RANDOM_STATE, n_jobs=-1,
    )
    train_mean = train_scores.mean(axis=1)
    test_mean = test_scores.mean(axis=1)

    plt.figure(figsize=(8, 6))
    plt.plot(train_sizes, train_mean, "o-", label="Training Score")
    plt.plot(train_sizes, test_mean, "o-", label="Validation Score")
    plt.xlabel("Training Samples")
    plt.ylabel("Accuracy")
    plt.title(f"Learning Curve - {model_name}")
    plt.legend()
    plt.tight_layout()
    plt.savefig(ASSETS_DIR / "learning_curve.png", dpi=150)
    plt.close()


def plot_prediction_probability(y_proba, y_test):
    plt.figure(figsize=(8, 5))
    plt.hist(y_proba[y_test == 1], bins=30, alpha=0.6, label="Creditworthy", color="green")
    plt.hist(y_proba[y_test == 0], bins=30, alpha=0.6, label="High Risk", color="red")
    plt.xlabel("Predicted Probability")
    plt.ylabel("Count")
    plt.title("Prediction Probability Distribution")
    plt.legend()
    plt.tight_layout()
    plt.savefig(ASSETS_DIR / "prediction_probability.png", dpi=150)
    plt.close()


# ---------------------------------------------------------------------------
# 4. Main Training Pipeline
# ---------------------------------------------------------------------------
def train():
    print("=" * 60)
    print("CreditSense AI - Training Pipeline")
    print("=" * 60)

    # Load and preprocess
    df = load_data()
    print(f"Dataset shape: {df.shape}")

    # Generate charts from raw data
    plot_class_distribution(df)
    plot_correlation_heatmap(df)
    print("Generated class distribution and correlation charts")

    X, y, scaler, label_encoders, feature_names = preprocess(df)
    print(f"Features after preprocessing: {len(feature_names)}")
    print(f"Class distribution: {dict(y.value_counts())}")

    # Train/test split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=TEST_SIZE, random_state=RANDOM_STATE, stratify=y
    )
    print(f"Train: {len(X_train)}, Test: {len(X_test)}")

    # Train models
    models = get_models()
    results = {}
    models_data = {}

    for name, model in models.items():
        print(f"\nTraining {name}...")
        model.fit(X_train, y_train)
        metrics, y_pred, y_proba = evaluate_model(model, X_test, y_test)
        results[name] = {"metrics": metrics, "model": model, "y_pred": y_pred, "y_proba": y_proba}
        models_data[name] = (model, y_proba)

        print(f"  Accuracy:  {metrics['accuracy']:.4f}")
        print(f"  Precision: {metrics['precision']:.4f}")
        print(f"  Recall:    {metrics['recall']:.4f}")
        print(f"  F1 Score:  {metrics['f1']:.4f}")
        print(f"  ROC-AUC:   {metrics['roc_auc']:.4f}")
        print(f"  Classification Report:\n{classification_report(y_test, y_pred)}")

        plot_confusion_matrix(y_test, y_pred, name)

    # Select best model by ROC-AUC
    best_name = max(results, key=lambda k: results[k]["metrics"]["roc_auc"])
    best_model = results[best_name]["model"]
    print(f"\nBest model: {best_name} (ROC-AUC: {results[best_name]['metrics']['roc_auc']:.4f})")

    # Generate evaluation charts
    plot_roc_curves(models_data, y_test)
    plot_accuracy_comparison(results)
    plot_prediction_probability(results[best_name]["y_proba"], y_test)
    plot_learning_curve(best_model, X, y, best_name)
    if hasattr(best_model, "feature_importances_"):
        plot_feature_importance(best_model, feature_names, best_name)
    print("Generated evaluation charts in assets/")

    # Save best model
    model_path = MODELS_DIR / "credit_model.pkl"
    joblib.dump({
        "model": best_model,
        "scaler": scaler,
        "label_encoders": label_encoders,
        "feature_names": feature_names,
        "best_model_name": best_name,
    }, model_path)
    print(f"Saved best model to {model_path}")

    # Save metrics
    metrics_output = {
        "best_model": best_name,
        "models": [
            {"name": name, "metrics": results[name]["metrics"]}
            for name in results
        ],
        "feature_names": feature_names,
        "feature_importance": (
            [
                {"feature": feature_names[i], "importance": float(imp)}
                for i, imp in enumerate(best_model.feature_importances_)
            ]
            if hasattr(best_model, "feature_importances_")
            else []
        ),
        "training_date": pd.Timestamp.now().isoformat(),
        "dataset_size": len(df),
    }
    with open(METRICS_PATH, "w") as f:
        json.dump(metrics_output, f, indent=2)
    print(f"Saved metrics to {METRICS_PATH}")

    print("\n" + "=" * 60)
    print("Training complete!")
    print("=" * 60)
    return metrics_output


if __name__ == "__main__":
    train()
