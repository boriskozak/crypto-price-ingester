
var fetch = require('node-fetch');
var metrics = require('datadog-metrics');

var base_url = "https://api.cryptowat.ch"
var currency = "usd"

process.env.DATADOG_API_KEY = "51ac61cd3871b603398b947d2d901e8d"



function getCurrent() {
    metrics.init({ prefix: 'stats:' });


    fetch(base_url + '/markets/summaries')
      .then(function(res) {
        return res.text();
      }).then(function(output) {
        results = JSON.parse(output).result;
        for (var key in results) {
            if (key.includes(currency)) {
            var exchange = key.split(":")[0]
            var coin = key.split(":")[1].split(currency)[0]
            var price = results[key].price.last
            console.log(price);
            metrics.gauge("current_price", price, ["exchange:" + exchange, "coin:" + coin])
            metrics.flush();
            
            }

        }
      }).then(function() {
        metrics.flush();
        callback(null);
      });
  }

  getCurrent();