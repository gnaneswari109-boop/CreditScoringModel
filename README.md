# CreditSense AI – Intelligent Credit Scoring & Creditworthiness Prediction System

![Python](https://img.shields.io/badge/Python-3.10+-blue?logo=python&logoColor=white)
![React](https://img.shields.io/badge/React-18.3-61dafb?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178c6?logo=typescript&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?logo=fastapi&logoColor=white)
![Scikit-learn](https://img.shields.io/badge/Scikit--learn-1.5-F7931E?logo=scikit-learn&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.4-646cff?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?logo=tailwindcss&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)
![CodeAlpha](https://img.shields.io/badge/CodeAlpha-ML%20Internship-orange)

> An AI-powered credit scoring system that predicts whether a loan applicant is **creditworthy** (approved) or **high credit risk** (rejected) using supervised machine learning classification algorithms. Built for the **CodeAlpha Machine Learning Internship**.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Dataset Information](#dataset-information)
- [Folder Structure](#folder-structure)
- [Installation](#installation)
- [Running the Backend](#running-the-backend)
- [Running the Frontend](#running-the-frontend)
- [Training the Model](#training-the-model)
- [API Endpoints](#api-endpoints)
- [Screenshots](#screenshots)
- [Future Improvements](#future-improvements)
- [License](#license)

---

## Project Overview

CreditSense AI is an end-to-end machine learning web application that predicts loan applicant creditworthiness. The system trains three classification algorithms — **Logistic Regression**, **Decision Tree**, and **Random Forest** — compares their performance, and automatically selects the best model based on **ROC-AUC score**. The trained model is served via a FastAPI backend and consumed by a modern React frontend with a dark glassmorphism design.

### Problem Statement

Predict whether a loan applicant is:
- ✅ **Creditworthy** (Approved)
- ❌ **High Credit Risk** (Rejected)

Display prediction confidence percentage, credit score, risk level, and personalized recommendations.

---

## Features

### Machine Learning
- **Three ML algorithms** trained and compared automatically
- **Best model auto-selection** based on ROC-AUC score
- **Feature engineering** from financial history (DTI ratio, savings-to-income, loan-to-income)
- **Data preprocessing**: missing value handling, duplicate removal, label encoding, one-hot encoding, standard scaling, outlier detection, feature selection
- **80/20 train/test split** with stratification

### Evaluation & Visualization
- Accuracy, Precision, Recall, F1 Score, ROC-AUC Score
- Confusion Matrix, Classification Report
- ROC Curve comparison across all models
- Feature Importance graph
- Learning Curve
- Class Distribution chart
- Correlation Heatmap
- Accuracy Comparison chart
- Prediction Probability distribution

### Web Application
- **Prediction page** with 19-field professional form
- **Risk Meter gauge** with animated needle
- **Credit score** calculation (300–850 scale)
- **Confidence percentage** display
- **AI Recommendation Panel** with personalized suggestions
- **Financial Improvement Suggestions**
- **Loan Eligibility Tips**
- **Credit Score Explanation** via feature contributions
- **Prediction History** with local storage persistence
- **Download Prediction Report** as text file
- **CSV Upload** for batch prediction
- **Model Performance** dashboard with interactive charts
- **Analytics** page with data insights and visualizations
- Dark theme with **glassmorphism** and **gradient** aesthetics
- Fully **responsive** design (mobile to desktop)

---

## Technology Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 | UI framework |
| TypeScript | Type safety |
| Vite | Build tool & dev server |
| Tailwind CSS | Styling |
| Shadcn UI | Component library |
| Framer Motion | Animations & transitions |
| Recharts | Data visualization |
| Lucide Icons | Icon system |

### Backend
| Technology | Purpose |
|---|---|
| Python 3.10+ | Backend language |
| FastAPI | REST API framework |
| Uvicorn | ASGI server |
| Pydantic | Data validation |

### Machine Learning
| Technology | Purpose |
|---|---|
| Scikit-learn | ML algorithms & evaluation |
| Pandas | Data manipulation |
| NumPy | Numerical computation |
| Joblib | Model serialization |
| Matplotlib | Chart generation |
| Seaborn | Statistical visualization |

### Algorithms
- Logistic Regression
- Decision Tree
- Random Forest (auto-selected as best)

---

## Dataset Information

The system uses a public credit scoring dataset with the following features:

| Feature | Description |
|---|---|
| Age | Applicant's age (18–70) |
| Gender | Male / Female |
| Annual Income | Yearly income in USD |
| Employment Status | Employed, Self-Employed, Unemployed, Retired, Student |
| Occupation | Job category (12 options) |
| Years of Employment | Years at current job |
| Credit History Length | Years of credit history |
| Monthly Debt | Monthly debt payments |
| Existing Loans | Number of active loans |
| Loan Amount | Requested loan amount |
| Loan Duration | Loan term in months |
| Loan Purpose | Home, Car, Education, Business, etc. |
| Savings | Total savings |
| Checking Account Balance | Checking account balance |
| Payment History | Excellent, Good, Fair, Poor |
| Credit Utilization | Credit card utilization percentage |
| Debt-to-Income Ratio | DTI percentage |
| Number of Credit Cards | Active credit cards |
| Number of Dependents | Financial dependents |
| Marital Status | Single, Married, Divorced, Widowed |
| Housing Type | Own, Rent, Mortgage, Other |

**Target**: `creditworthy` (1 = Creditworthy/Approved, 0 = High Risk/Rejected)

### Download Instructions

See [`dataset/README.md`](dataset/README.md) for dataset download options. If no dataset file is present, the training script auto-generates a realistic synthetic dataset.

---

## Folder Structure

```
CreditSense-AI/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   └── main.py          # FastAPI application with all endpoints
│   ├── train.py             # ML training pipeline (preprocessing, training, evaluation)
│   └── requirements.txt     # Python dependencies
├── dataset/
│   ├── README.md            # Dataset download instructions
│   └── credit_data.csv      # Dataset (NOT in git)
├── models/
│   ├── README.md
│   ├── credit_model.pkl     # Trained best model (NOT in git)
│   └── metrics.json         # Model metrics (NOT in git)
├── assets/
│   ├── README.md
│   └── *.png                # Generated evaluation charts (NOT in git)
├── screenshots/
│   └── README.md
├── src/
│   ├── components/
│   │   ├── ui/              # Shadcn UI components
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   └── RiskMeter.tsx
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   ├── PredictionPage.tsx
│   │   ├── PerformancePage.tsx
│   │   ├── AnalyticsPage.tsx
│   │   ├── HistoryPage.tsx
│   │   └── AboutPage.tsx
│   ├── lib/
│   │   ├── api.ts           # FastAPI client
│   │   ├── credit-engine.ts # Client-side prediction engine
│   │   ├── history.ts       # Prediction history management
│   │   └── utils.ts
│   ├── types.ts             # TypeScript types & constants
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── .gitignore
├── README.md
├── requirements.txt
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
└── index.html
```

---

## Installation

### Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.10+
- **pip** (Python package manager)

### Clone the Repository

```bash
git clone https://github.com/yourusername/CreditSense-AI.git
cd CreditSense-AI
```

### Frontend Setup

```bash
# Install Node.js dependencies
npm install
```

### Backend Setup

```bash
# Create a virtual environment
python -m venv venv

# Activate it
# On Linux/macOS:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install Python dependencies
pip install -r requirements.txt
```

---

## Running the Backend

```bash
# Activate virtual environment (if not already)
source venv/bin/activate

# Start the FastAPI server
cd backend
uvicorn app.main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`.

API documentation (auto-generated by FastAPI):
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

---

## Running the Frontend

```bash
# From the project root
npm run dev
```

The frontend will be available at `http://localhost:5173`.

> **Note:** The frontend works in **client mode** even without the backend running. It uses a built-in credit scoring engine that mirrors the ML model's logic. When the backend is available, it automatically uses the API for predictions.

---

## Training the Model

```bash
# Activate virtual environment
source venv/bin/activate

# Run the training pipeline
python backend/train.py
```

This will:
1. Load (or generate) the dataset
2. Clean data and engineer features
3. Encode and scale features
4. Train all three models
5. Evaluate and compare performance
6. Select the best model by ROC-AUC
7. Save the model to `models/credit_model.pkl`
8. Generate evaluation charts in `assets/`
9. Save metrics to `models/metrics.json`

You can also trigger training via the API:

```bash
curl -X POST http://localhost:8000/train
```

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Health check and model status |
| `POST` | `/train` | Retrain all models |
| `POST` | `/predict` | Single creditworthiness prediction |
| `POST` | `/batch-predict` | Batch predictions from array of inputs |
| `GET` | `/model-info` | Best model info, metrics, and feature importance |
| `GET` | `/models` | List all models with evaluation metrics |

### Example: Prediction Request

```bash
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "age": 35,
    "annual_income": 75000,
    "employment_status": "Employed",
    "occupation": "Software Engineer",
    "years_employed": 8,
    "credit_history_length": 12,
    "monthly_debt": 1200,
    "existing_loans": 2,
    "loan_amount": 25000,
    "loan_purpose": "Car",
    "savings": 30000,
    "checking_balance": 8000,
    "payment_history": "Good",
    "credit_utilization": 30,
    "debt_to_income": 20,
    "num_credit_cards": 3,
    "dependents": 1,
    "housing_type": "Mortgage",
    "marital_status": "Married"
  }'
```

### Example: Prediction Response

```json
{
  "approved": true,
  "confidence": 87.5,
  "credit_score": 742,
  "risk_level": "low",
  "probability": 87.5,
  "recommendation": "Based on the analysis, this applicant has a 87.5% likelihood...",
  "suggestions": ["Your financial profile is strong..."],
  "feature_contributions": [...]
}
```

---

## Screenshots

Place screenshots in the `screenshots/` directory:

| Page | Description |
|---|---|
| Dashboard | Home overview with stats and features |
| Prediction | Credit assessment form with risk meter results |
| Model Performance | ML model comparison charts and metrics |
| Analytics | Data distribution and correlation visualizations |
| History | Past prediction records |
| About | Project documentation and tech stack |

---

## Future Improvements

- [ ] Add XGBoost and LightGBM models for comparison
- [ ] Implement SHAP values for model explainability
- [ ] Add user authentication with Supabase
- [ ] Deploy backend to Render/Railway
- [ ] Deploy frontend to Vercel/Netlify
- [ ] Add real-time model drift detection
- [ ] Support more dataset formats (Excel, JSON)
- [ ] Add A/B testing for model versions
- [ ] Implement automated retraining pipeline
- [ ] Add multi-language support
- [ ] Integrate credit bureau API for real data

---

## License

This project is licensed under the MIT License.

---

## Acknowledgments

- **CodeAlpha** – Machine Learning Internship program
- **Scikit-learn** – Open-source ML library
- **FastAPI** – Modern Python web framework
- **React & Vite** – Frontend tooling
- **Shadcn UI** – Component library

---

> Built with care for the CodeAlpha Machine Learning Internship.
