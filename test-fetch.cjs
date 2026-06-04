fetch('https://ais-dev-3bnsn3h3bcrvvg5n3vii3y-730607672030.asia-southeast1.run.app/api/health')
  .then(res => res.text())
  .then(console.log)
  .catch(console.error);
