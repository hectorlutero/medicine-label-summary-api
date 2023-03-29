const express = require('express');
const axios = require('axios');
require('dotenv').config();
// const { parseString } = require('xml2js');

const app = express();

// const API_KEY = '<YOUR_DAILYMED_API_KEY>'; // Replace with your API key
const SEARCH_URL = process.env.SEARCH_URL;
const LABEL_URL = process.env.LABEL_URL;

// Search for a medication by name
const searchMedicineLabels = async (query) => {
    try {
        const apiKey = 'l7grerdcEfcLHChcT3k8ZiocaTnALS4NGXp3Zpiz'; // Replace with your OpenFDA API key
        const url = `https://api.fda.gov/drug/label.json?=${apiKey}&search=${query}`;

        const response = await axios.get(url);
        const results = response.data.results;

        console.log(`Found ${results.length} results:`);
        return results;
    } catch (error) {
        console.error('Error fetching data:', error.message);
    }
};


// Example usage: search for a medication and get its label
app.get('/medications/:name', async (req, res) => {
    // console.log(req);
    const medications = await searchMedicineLabels(req.params.name);
    console.log(`Medications:`)
    if (medications) {

        if (medications.length > 0) {
            const medication = medications[0];
            console.log(`Medication: ${medication}`)
            res.status(200).json({
                generic_name: medication.openfda.generic_name,
                do_not_use: medication.do_not_use,
                stop_use: medication.stop_use,
                purpose: medication.purpose
            });
        } else {
            res.status(500).send('Error getting medication label');
        }
    } else {
        res.status(404).send('No medications found');
    }

});

app.get('/', async (req, res) => res.send({ message: "What's up this is my APP, up and Runnning" }))

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
