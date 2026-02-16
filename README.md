# 📊 Customer Segmentation & Retention Analysis Dashboard

---

## 📌 Project Overview
Customer churn is a major challenge for subscription-based and digital businesses.
Retaining existing customers is significantly more cost-effective than acquiring new ones.

This project focuses on analyzing customer behavior, segmenting customers into meaningful
groups, predicting customer churn using machine learning, and recommending retention
actions through an AI-powered dashboard.

The system integrates a trained ML model with an interactive frontend to enable
real-time churn prediction for individual customers.

---

## 🧩 Business Problem
- High customer churn negatively impacts revenue and long-term growth
- Businesses struggle to identify customers at high risk of churn
- Retention strategies are often generic instead of data-driven

### 💡 Proposed Solution:
A data-driven churn analysis and retention system that:
- Identifies customers likely to churn
- Segments customers based on behavior and value
- Predicts churn probability using ML models
- Suggests proactive retention actions

---

## 🎯 Project Objectives
- Analyze customer usage and behavioral patterns
- Segment customers into meaningful business groups
- Predict customer churn using machine learning models
- Provide real-time churn prediction via dashboard
- Enable data-backed retention decision-making

---

## ❓ Key Business Questions
- Which customer segments are most likely to churn?
- What factors contribute most to customer churn?
- Who are the high-value but high-risk customers?
- How should retention efforts be prioritized?

---

## 📊 Key Performance Indicators (KPIs)
- **Churn Rate** – Percentage of customers who discontinue the service
- **Retention Rate** – Percentage of customers who remain active
- **Total Customers** – Size of the active customer base
- **Customer Lifetime Value (CLV)** – Long-term value of a customer

---

## 🛠️ System Architecture

### 🔹 Frontend
- HTML
- CSS
- JavaScript
- Chart.js

### 🔹 Backend
- Flask (REST API)

### 🔹 Machine Learning
- Python
- Pandas
- NumPy
- Scikit-learn
- Random Forest Classifier

---

## ⚙️ Functional Workflow

1. Customer dataset is loaded and visualized using dynamic KPIs and charts
2. User enters Customer ID in dashboard
3. System auto-fills customer details from dataset
4. Input is sent to trained ML model via Flask API
5. Model predicts:
   - Churn (Yes / No)
   - Churn Probability
6. Prediction result is displayed in dashboard

---

## 📈 Dashboard Features
- KPI Cards (Churn Rate, Retention Rate, Total Customers)
- Churn & Retention Trend Line Chart (Jan–Dec)
- Customer Segmentation Doughnut Chart
- Customer Input Panel
- Auto-fill customer details from dataset
- Real-time churn prediction using ML model
- Risk probability visualization

---

## 📁 Project Structure
customer-segmentation-retention/
│
├── backend/
│ ├── app.py
│ ├── train_model.py
│ ├── churn_model.pkl
│ └── contract_encoder.pkl
│
├── css/
│ └── style.css
│
├── js/
│ └── script.js
│
├── data/
│ └── customer_churn.csv
│
├── index.html
└── README.md

---

## 🚀 Expected Business Impact
- Early identification of customers at high churn risk
- Targeted retention strategies
- Reduced customer attrition
- Improved customer lifetime value (CLV)
- Data-driven decision making

---

## 🏗️ Project Status
🚧 **In Progress**

- ✅ Dashboard UI completed
- ✅ Dataset integrated with frontend
- ✅ KPIs dynamically calculated
- ✅ ML Model trained
- ✅ Flask API developed
- ✅ Frontend–Backend integration completed
- ⏳ Retention Recommendation Engine (Next Phase)
- ⏳ Deployment

---

## 🔮 Future Enhancements
- Real-time retention recommendations
- Revenue loss estimation
- Model explainability (Feature Importance)
- Role-based dashboards (Admin / Analyst)
- Cloud deployment

---

## 👤 Author
**Bandarupalli Kusuma**  
B.E. Information Technology  
Aspiring Data Scientist | Full Stack Developer | Cloud & AI Enthusiast
