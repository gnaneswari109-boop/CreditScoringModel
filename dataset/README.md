# Dataset Directory

This directory should contain the credit scoring dataset CSV file.

## Download Instructions

### Option 1: German Credit Dataset (UCI)

```bash
# Download from UCI ML Repository
wget https://archive.ics.uci.edu/ml/machine-learning-databases/statlog/german/german.data

# Or use the Python sklearn version
python -c "from sklearn.datasets import fetch_openml; data = fetch_openml('credit-g', as_frame=True); data.frame.to_csv('dataset/credit_data.csv', index=False)"
```

### Option 2: Kaggle Credit Score Dataset

1. Visit: https://www.kaggle.com/datasets/parisrohan/credit-score-classification
2. Download the dataset CSV
3. Place it in this folder as `credit_data.csv`

### Option 3: Auto-Generate

If no dataset is found, the training script automatically generates a realistic
synthetic credit scoring dataset (1,000 samples) with the following features:

- Age, Gender, Annual Income
- Employment Status, Occupation, Years Employed
- Credit History Length, Payment History
- Monthly Debt, Existing Loans, Loan Amount, Loan Duration, Loan Purpose
- Savings, Checking Account Balance
- Credit Utilization, Debt-to-Income Ratio
- Number of Credit Cards, Dependents
- Marital Status, Housing Type
- Creditworthy (target: 0 = High Risk, 1 = Creditworthy)

## Expected Format

The CSV file should be named `credit_data.csv` and placed in this directory.
The target column should be named `creditworthy` (1 = approved, 0 = rejected).

**Note:** This directory is excluded from version control via `.gitignore`.
