let customers = [];
let trendsChartInstance = null;
let segmentChartInstance = null;

document.addEventListener("DOMContentLoaded", () => {

fetch("data/customer_churn.csv")
.then(res => res.text())
.then(csv => {

    const rows = csv.trim().split("\n").slice(1);

    rows.forEach(row => {

        if(!row) return;

        const c=row.split(",");

        customers.push({
            id:c[0],
            tenure:Number(c[1]),
            monthlyCharges:Number(c[2]),
            totalCharges:Number(c[3]),
            contract:c[4],
            churn:c[c.length-1]
        });
    });

    console.log("Dataset Loaded:",customers.length);

    updateKPIs(customers);
    renderLineChart(customers);
    renderSegmentChart(customers);
});


document.getElementById("customerId").addEventListener("change",function(){

    const enteredId=this.value;
    const customer=customers.find(c=>c.id==enteredId);

    if(!customer){
        alert("Customer Not Found!");
        return;
    }

    document.getElementById("tenure").value=customer.tenure;
    document.getElementById("monthlyCharges").value=customer.monthlyCharges;
    document.getElementById("contractType").value=customer.contract;
});


function updateKPIs(data){

    const total=data.length;
    const churned=data.filter(c=>c.churn.trim().toLowerCase()==="yes").length;

    const churnRate=((churned/total)*100).toFixed(1);
    const retentionRate=(100-churnRate).toFixed(1);

    document.getElementById("totalCustomers").innerText=total;
    document.getElementById("churnRate").innerText=churnRate+"%";
    document.getElementById("retentionRate").innerText=retentionRate+"%";
}



function renderLineChart(data){

    if(trendsChartInstance) trendsChartInstance.destroy();

    const buckets={
        "0-6":[],
        "7-12":[],
        "13-24":[],
        "25-36":[],
        "37-48":[],
        "49-60":[],
        "60+":[]
    };

    data.forEach(c=>{

        if(c.tenure<=6)
            buckets["0-6"].push(c);
        else if(c.tenure<=12)
            buckets["7-12"].push(c);
        else if(c.tenure<=24)
            buckets["13-24"].push(c);
        else if(c.tenure<=36)
            buckets["25-36"].push(c);
        else if(c.tenure<=48)
            buckets["37-48"].push(c);
        else if(c.tenure<=60)
            buckets["49-60"].push(c);
        else
            buckets["60+"].push(c);
    });

    let churnData=[];
    let retentionData=[];

    Object.values(buckets).forEach(group=>{

        if(group.length===0){
            churnData.push(0);
            retentionData.push(0);
            return;
        }

        let churned=group.filter(
            c=>c.churn.trim().toLowerCase()==="yes"
        ).length;

        let rate=(churned/group.length)*100;

        churnData.push(Number(rate.toFixed(1)));
        retentionData.push(Number((100-rate).toFixed(1)));
    });

    trendsChartInstance=new Chart(document.getElementById("trendsChart"),{
        type:"line",
        data:{
            labels:Object.keys(buckets),
            datasets:[
                {
                    label:"Churn %",
                    data:churnData,
                    borderColor:"#ef4444",
                    tension:0.4
                },
                {
                    label:"Retention %",
                    data:retentionData,
                    borderColor:"#8b5cf6",
                    tension:0.4
                }
            ]
        },
        options:{
            responsive:true,
            maintainAspectRatio:false
        }
    });
}



function renderSegmentChart(data){

    if(segmentChartInstance) segmentChartInstance.destroy();

    let loyal=0,atRisk=0,newly=0,highValue=0;

    data.forEach(c=>{

        if(c.churn.trim().toLowerCase()==="yes")
            atRisk++;
        else if(c.tenure<=6)
            newly++;
        else if(c.monthlyCharges>=70)
            highValue++;
        else if(c.tenure>=24)
            loyal++;
    });

    segmentChartInstance=new Chart(document.getElementById("segmentChart"),{
        type:"doughnut",
        data:{
            labels:["Loyal","At Risk","New","High Value"],
            datasets:[{
                data:[loyal,atRisk,newly,highValue],
                backgroundColor:[
                    "#ef4444",
                    "#10b981",
                    "#a855f7",
                    "#6366f1"
                ]
            }]
        }
    });
}



document.querySelector(".predict-button").addEventListener("click",async function(){

    const tenure=document.getElementById("tenure").value;
    const monthlyCharges=document.getElementById("monthlyCharges").value;
    const contract=document.getElementById("contractType").value;

    if(!tenure||!monthlyCharges){
        alert("Enter Customer ID First!");
        return;
    }

    const response=await fetch("http://127.0.0.1:5000/predict",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
            tenure:tenure,
            monthlyCharges:monthlyCharges,
            contract:contract
        })
    });

    const data=await response.json();

    let riskMsg="";
    let offer="";

    if(data.churn_probability>=0.7){
        riskMsg="🔴 High Risk Customer";
        offer="Provide 20% Discount Immediately";
    }
    else if(data.churn_probability>=0.5){
        riskMsg="🟠 Medium Risk Customer";
        offer="Provide 10% Retention Offer";
    }
    else if(data.churn_probability>=0.3){
        riskMsg="🟡 Low Risk Customer";
        offer="Provide Loyalty Points";
    }
    else{
        riskMsg="🟢 Safe Customer";
        offer="No Action Required";
    }

    document.getElementById("predictionResult").style.display="block";

    document.getElementById("resultContent").innerHTML=`
    <b>Prediction:</b> ${data.prediction}<br>
    <b>Churn Probability:</b> ${data.churn_probability}<br><br>
    <b>Risk Level:</b> ${riskMsg}<br>
    <b>Recommended Action:</b> ${offer}
    `;
});

});
