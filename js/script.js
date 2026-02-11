let customers = [];

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
            churnData.push(churnRate.toFixed(1));
            retentionData.push((100 - churnRate).toFixed(1));
        });

        new Chart(document.getElementById("trendsChart"), {
            type: "line",
            data: {
                labels: Object.keys(buckets),
                datasets: [
                    {
                        label: "Churn %",
                        data: churnData,
                        borderColor: "#ef4444",
                        tension: 0.4
                    },
                    {
                        label: "Retention %",
                        data: retentionData,
                        borderColor: "#8b5cf6",
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
       DYNAMIC CUSTOMER SEGMENTS
    =============================== */
    function renderSegmentChart(data) {

        let loyal = 0, atRisk = 0, newly = 0, highValue = 0;

        data.forEach(c => {
            if (c.churn.toLowerCase() === "yes") atRisk++;
            else if (c.tenure <= 6) newly++;
            else if (c.monthlyCharges >= 70) highValue++;
            else if (c.tenure >= 24) loyal++;
        });

        new Chart(document.getElementById("segmentChart"), {
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

});
