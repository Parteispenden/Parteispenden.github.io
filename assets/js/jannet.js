function formatCurrency(amount) {
    return new Intl.NumberFormat('de-DE', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);
}



let totalMoney = 0;
let totalArr = []
let donoList = {};

async function fetchData() {
    try {
        const response = await fetch('https://raw.githubusercontent.com/Parteispenden/Parteispenden.github.io/refs/heads/main/data.json'); // Replace with your JSON file URL
        const data = await response.json(); // Convert to JSON

        console.log(data);
        data.forEach(item => {
            totalMoney += item.Spende * 100;
            console.log(totalMoney / 100);
        });

        totalMoney = formatCurrency(totalMoney / 100);
        const totalDonosElement = document.getElementById("totalDonos");
        totalDonosElement.innerHTML = `Seit 2009 wurden ${totalMoney} in Großspenden an Parteien gespendet.`;

        data.forEach(item => {
            party = item.Partei
            if(party in donoList){
                donoList[party].total = (donoList[party].total * 100 + item.Spende * 100) / 100;
                if(!donoList[party].donations[item.Spender]){
                    donoList[party].donations[item.Spender] = item.Spende;
                }
                else{
                    donoList[party].donations[item.Spender] = (donoList[party].donations[item.Spender] * 100 + item.Spende * 100) / 100;
                }
            }
            else{
                donoList[party] = {total: item.Spende, donations: {[item.Spender] : item.Spende}};
            }
        });

        Object.keys(donoList).forEach(party => {
            totalArr.push({"party": party, "total": donoList[party].total})
        });

        totalArr = totalArr.sort((a, b) => b.total - a.total);


    } catch (error) {
        console.error('Error loading JSON:', error);
    }
}

function doStuff(){
    console.log(totalMoney, donoList, totalArr);

    let names = totalArr.map(tot => tot.party);
    let values = totalArr.map(tot => tot.total);

    console.log(names, values);

    const ctx = document.getElementById('myChart');

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: names,
            datasets: [{
                label: 'Gesamtgroßspenden in Euro seit 2009',
                data: values,
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

fetchData().then(doStuff);
