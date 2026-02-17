from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np

print("🚀 Starting Flask Backend...")

# CREATE FLASK APP
app = Flask(__name__)

# ENABLE CORS (for Live Server frontend)
CORS(app)

# LOAD TRAINED MODEL + ENCODER
try:
    model = joblib.load("churn_model.pkl")
    encoder = joblib.load("contract_encoder.pkl")
    print("✅ Model & Encoder Loaded Successfully!")
except Exception as e:
    print("❌ Error Loading Model:", e)


# ===============================
# HEALTH CHECK
# ===============================
@app.route("/")
def home():
    return jsonify({
        "message": "Churn Prediction API Running!"
    })


# ===============================
# PREDICT CHURN
# ===============================
@app.route("/predict", methods=["POST"])
def predict():

    try:
        data = request.get_json()

        # GET INPUT FROM FRONTEND
        tenure = float(data.get("tenure", 0))
        monthly = float(data.get("monthlyCharges", 0))
        contract = data.get("contract", "Month-to-Month")

        # ENCODE CONTRACT TYPE
        contract_encoded = encoder.transform([contract])[0]

        # PREPARE MODEL INPUT
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
# RUN SERVER
# ===============================
if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)
