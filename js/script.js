document.addEventListener('DOMContentLoaded', () => {

    new Chart(document.getElementById('trendsChart'), {
        type: 'line',
        data: {
            labels: ['Jan','Feb','Mar','Apr','May','Jun'],
            datasets: [
                {
                    label: 'Churn %',
                    data: [18,20,17,16,15,14],
                    borderColor: '#ef4444',
                    tension: 0.4
                },
                {
                    label: 'Retention %',
                    data: [82,80,83,84,85,86],
                    borderColor: '#8b5cf6',
                    tension: 0.4
                }
            ]
        }
    });

    new Chart(document.getElementById('segmentChart'), {
        type: 'doughnut',
        data: {
            labels: ['Loyal','At Risk','New','High Value'],
            datasets: [{
                data: [45,20,30,20],
                backgroundColor: ['#ef4444','#10b981','#a855f7','#6366f1']
            }]
        }
    });

});
