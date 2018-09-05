# Puppeteer-lighthouse

## Setup InfluxDB & Grafana

From root foder run 
```
docker-compose up
```
Create database 'pwmetrics' on induxDB using curl or api based on documentation (https://docs.influxdata.com/influxdb/v1.6/introduction/getting-started/)
 i.e. by POST request or 

 ```curl -X POST \
  http://localhost:8086/query?q=CREATE%20DATABASE%20pwmetrics
  ```

Grafana should be avaialable on localhost:3000
1. Login with admin:admin as username and password
2. Add data source with data as shown below
![Grafana Setup](images/grafana-setup.png)

Import the [Dashboard template](dashboard.json) into Grafana.
On a different terminal when the docker compose file is running

Install modules and run test.

```
npm install
```

Then run
```
npm test
```
