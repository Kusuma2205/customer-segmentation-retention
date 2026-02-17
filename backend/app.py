from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import os

print("🚀 Starting Flask Backend...")

# ===============================
# CREATE FLASK APP
# ===============================
app = Flask(__name__)

# ENABLE CORS (for Netlify Frontend)
CORS(app)

# ===============================
# LOAD MODEL + ENCODER
# ===============================
try:
    model = joblib.load("churn_model.pkl")
    encoder = joblib.load("contract_encoder.pkl")
    print("✅ Model & Encoder Loaded Successfully!")
except Exception as e:
    print("❌ Error Loading Model:", e)


# ===============================
# HEALTH CHECK ROUTE
# ===============================
@app.route("/")
def home():
    return jsonify({
        "status": "Backend Running Successfully 🚀"
    })


# ===============================
# PREDICTION ROUTE
# ===============================
@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()

        if not data:
            return jsonify({"error": "No input data received"}), 400

        # INPUT FROM FRONTEND
        tenure = float(data.get("tenure", 0))
        monthly = float(data.get("monthlyCharges", 0))
        contract = data.get("contract", "Month-to-Month")

        # ENCODE CONTRACT TYPE
        contract_encoded = encoder.transform([contract])[0]

        # MODEL INPUT
        input_data = np.array([[tenure, monthly, contract_encoded]])

        # PREDICT
        prediction = model.predict(input_data)[0]
        probability = model.predict_proba(input_data)[0][1]

        return jsonify({
            "prediction": "Yes" if prediction == 1 else "No",
            "churn_probability": round(float(probability), 4)
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ===============================
# RENDER DEPLOYMENT RUN
# ===============================
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
