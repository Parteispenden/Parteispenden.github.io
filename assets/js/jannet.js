const ctx = document.getElementById('myChart');

new Chart(ctx, {
  type: 'bar',
  data: {
    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    datasets: [{
      label: '# of Votes',
      data: [12, 19, 3, 5, 2, 3],
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

fetch('data.json') // Path to your JSON file
  .then(response => response.json()) // Convert to JSON
  .then(data => {
    console.log(data); // Use your parsed data
  })
  .catch(error => console.error('Error loading JSON:', error));

const totalMoney = 0;
const totalDonos = document.getElementById("totalDonos");

totalDonos.innerHTML = `Seit 2009 wurden ${totalMoney}€ in Großspenden an Parteien gespendet.`