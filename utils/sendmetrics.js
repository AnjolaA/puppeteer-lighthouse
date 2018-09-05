const axios = require('axios');

async function sendMetrics(url, database, data) {
    try {
        await axios.post(`${url}/write?db=${database}`, data, { timeout: 2000 });
    } catch (error) {
        if (error.response === undefined);
        console.log('There was an error sending the sendMetrics.');
    }
}

module.exports = { sendMetrics };
