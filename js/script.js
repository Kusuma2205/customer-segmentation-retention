let customers = [];
let trendsChartInstance = null;
let segmentChartInstance = null;

document.addEventListener("DOMContentLoaded", () => {

    /* ===============================
       LOAD CSV DATA
    =============================== */
    fetch("data/customer_churn.csv")
        .then(response => response.text())
        .then(csv => {
            const rows = csv.trim().split("\n").slice(1);

            rows.forEach(row => {
                if (!row) return;

                const c = row.split(",");

                customers.push({
                    id: c[0],
                    tenure: Number(c[1]),
                    monthlyCharges: Number(c[2]),
                    totalCharges: Number(c[3]),
                    contract: c[4],
                    churn: c[c.length - 1]
                });
            });

            console.log("CSV Loaded:", customers.length);

            updateKPIs(customers);
            renderLineChart(customers);
            renderSegmentChart(customers);
        })
        .catch(err => console.error("CSV Load Error:", err));


    /* ===============================
       KPI UPDATE
    =============================== */
    function updateKPIs(data) {
        const total = data.length;

        const churned = data.filter(
            c => c.churn.trim().toLowerCase() === "yes"
        ).length;

        const churnRate = ((churned / total) * 100).toFixed(1);
        const retentionRate = (100 - churnRate).toFixed(1);

        document.getElementById("totalCustomers").innerText = total;
        document.getElementById("churnRate").innerText = churnRate + "%";
        document.getElementById("retentionRate").innerText = retentionRate + "%";
    }


    /* ===============================
       LINE CHART (JAN–DEC)
    =============================== */
    function renderLineChart(data) {

        if (trendsChartInstance) {
            trendsChartInstance.destroy();
        }

        const buckets = {
            Jan: [], Feb: [], Mar: [], Apr: [], May: [], Jun: [],
            Jul: [], Aug: [], Sep: [], Oct: [], Nov: [], Dec: []
        };

        data.forEach(c => {
            if (c.tenure <= 5) buckets.Jan.push(c);
            else if (c.tenure <= 10) buckets.Feb.push(c);
            else if (c.tenure <= 15) buckets.Mar.push(c);
            else if (c.tenure <= 20) buckets.Apr.push(c);
            else if (c.tenure <= 25) buckets.May.push(c);
            else if (c.tenure <= 30) buckets.Jun.push(c);
            else if (c.tenure <= 35) buckets.Jul.push(c);
            else if (c.tenure <= 40) buckets.Aug.push(c);
            else if (c.tenure <= 45) buckets.Sep.push(c);
            else if (c.tenure <= 50) buckets.Oct.push(c);
            else if (c.tenure <= 55) buckets.Nov.push(c);
            else buckets.Dec.push(c);
        });

        const churnData = [];
        const retentionData = [];

        Object.values(buckets).forEach(group => {

            if (group.length === 0) {
                churnData.push(0);
                retentionData.push(0);
                return;
            }

            const churned = group.filter(
                c => c.churn.trim().toLowerCase() === "yes"
            ).length;

            const churnRate = (churned / group.length) * 100;

            churnData.push(Number(churnRate.toFixed(1)));
            retentionData.push(Number((100 - churnRate).toFixed(1)));
        });

        trendsChartInstance = new Chart(document.getElementById("trendsChart"), {
            type: "line",
            data: {
                labels: Object.keys(buckets),
                datasets: [
                    {
                        label: "Churn %",
                        data: churnData,
                        borderColor: "#ef4444",
                        backgroundColor: "transparent",
                        tension: 0.4
                    },
                    {
                        label: "Retention %",
                        data: retentionData,
                        borderColor: "#8b5cf6",
                        backgroundColor: "transparent",
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }


    /* ===============================
       CUSTOMER SEGMENT CHART
    =============================== */
    function renderSegmentChart(data) {

        if (segmentChartInstance) {
            segmentChartInstance.destroy();
        }

        let loyal = 0, atRisk = 0, newly = 0, highValue = 0;

        data.forEach(c => {
            if (c.churn.trim().toLowerCase() === "yes") atRisk++;
            else if (c.tenure <= 6) newly++;
            else if (c.monthlyCharges >= 70) highValue++;
            else if (c.tenure >= 24) loyal++;
        });

        segmentChartInstance = new Chart(document.getElementById("segmentChart"), {
            type: "doughnut",
            data: {
                labels: ["Loyal", "At Risk", "New", "High Value"],
                datasets: [{
                    data: [loyal, atRisk, newly, highValue],
                    backgroundColor: [
                        "#ef4444",
                        "#10b981",
                        "#a855f7",
                        "#6366f1"
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: "bottom" }
                }
            }
        });
    }


    /* ===============================
       CONNECT TO FLASK BACKEND
    =============================== */
    document.querySelector(".predict-button").addEventListener("click", function (e) {

        e.preventDefault();

        const tenure = document.querySelector("#tenure").value;
        const monthlyCharges = document.querySelector("#monthlyCharges").value;
        const contract = document.querySelector("#contractType").value;

        if (!tenure || !monthlyCharges) {
            alert("Please fill all required fields");
            return;
        }

        fetch("http://127.0.0.1:5000/predict", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                tenure: tenure,
                monthlyCharges: monthlyCharges,
                contract: contract
            })
        })
        .then(res => res.json())
        .then(data => {

            if (data.error) {
                alert("Backend Error: " + data.error);
                return;
            }

            const resultBox = document.getElementById("predictionResult");
            const resultContent = document.getElementById("resultContent");

            resultContent.innerHTML = `
                <strong>Prediction:</strong> ${data.prediction} <br>
                <strong>Churn Probability:</strong> ${data.churn_probability}
            `;

            resultBox.classList.remove("hidden");
        })
        .catch(error => {
            console.error("Connection Error:", error);
            alert("Cannot connect to backend. Make sure Flask is running.");
        });

    });

});
