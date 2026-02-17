import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder

print("🚀 Training Started...")

# LOAD DATASET FROM DATA FOLDER
df = pd.read_csv("../data/customer_churn.csv")

print("Columns Found:", df.columns)

# SELECT CORRECT COLUMNS FROM YOUR DATASET
df = df[["tenure", "monthly_charges", "contract", "churn"]]

# RENAME COLUMNS FOR MODEL
df.rename(columns={
    "monthly_charges": "MonthlyCharges",
    "contract": "Contract",
    "churn": "Churn"
}, inplace=True)

# ENCODE CONTRACT
contract_encoder = LabelEncoder()
df["Contract"] = contract_encoder.fit_transform(df["Contract"])

# ENCODE CHURN
churn_encoder = LabelEncoder()
df["Churn"] = churn_encoder.fit_transform(df["Churn"])

# FEATURES & TARGET
X = df[["tenure", "MonthlyCharges", "Contract"]]
y = df["Churn"]

# SPLIT DATA
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# TRAIN MODEL
model = RandomForestClassifier()
model.fit(X_train, y_train)

# SAVE MODEL
joblib.dump(model, "churn_model.pkl")
joblib.dump(contract_encoder, "contract_encoder.pkl")

print("✅ Model trained & saved successfully!")
