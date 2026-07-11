const express = require('express');
const fs = require('fs');
const axios = require('axios');

const app = express();
app.use(express.json());

const PORT = 5001;
const DATA_FILE = './data.json';

function readData() {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
}

function writeData(value) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({value}, null, 2));
}

app.post('/write', (req, res) => {
    const { value } = req.body;
    writeData(value);
    res.json({status: 'OK', node: PORT, value});
});

app.get('/read', (req, res) => {
    const data = readData();
    res.json({ node: PORT, value: data.value });
});

app.post('/sync', async (req, res) => {
    const target = req.body.target;
    const data = readData();

    try {
        await axios.post(`${target}/write`, { value: data.value });
        res.json({ status: 'synced', from: PORT, to: target});
    } catch (err) {
        res.json({status: 'failed', error: err.message});
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});