# Models Directory

This directory stores the trained machine learning models.

After running `python backend/train.py`, the following files are generated:

- `credit_model.pkl` - The best-performing model (serialized with joblib)
- `metrics.json` - Model evaluation metrics and metadata

The model package contains:
- The trained classifier (Logistic Regression, Decision Tree, or Random Forest)
- The StandardScaler used for feature normalization
- LabelEncoders for categorical features
- Feature names used during training
- The best model name

**Note:** This directory is excluded from version control via `.gitignore`.
