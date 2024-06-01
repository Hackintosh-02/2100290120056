const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(cors());

const WINDOW_SIZE = 10;
const THIRD_PARTY_API_BASE = "http://20.244.56.144/test";

let window = [];

app.get('/numbers/:numberid', async (req, res) => {
    const { numberid } = req.params;

    if (!['p', 'f', 'e', 'r'].includes(numberid)) {
        return res.status(400).json({ error: "Invalid numberid" });
    }

    const numTypeMap = {
        'p': 'primes',
        'f': 'fibo',
        'e': 'even',
        'r': 'rand'
    };
    const apiUrl = `${THIRD_PARTY_API_BASE}/${numTypeMap[numberid]}`;

    let numbers = [];

    try {
        const response = await axios.get(apiUrl, { timeout: 500 });
        numbers = response.data.numbers;
    } catch (error) {
        // Handle error or timeout
    }

    const prevState = [...window];

    for (const num of numbers) {
        if (!window.includes(num)) {
            if (window.length >= WINDOW_SIZE) {
                window.shift();
            }
            window.push(num);
        }
    }

    const currState = [...window];
    const average = window.length ? window.reduce((acc, num) => acc + num, 0) / window.length : 0;

    res.json({
        windowPrevState: prevState,
        windowCurrState: currState,
        numbers: numbers,
        avg: average.toFixed(2)
    });
});

const PORT = 9876;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
