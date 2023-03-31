const express = require('express');
const axios = require('axios');
require('dotenv').config();
const openai = require('openai')
// const { parseString } = require('xml2js');

const app = express();

// const API_KEY = '<YOUR_DAILYMED_API_KEY>'; // Replace with your API key
const SEARCH_URL = process.env.SEARCH_URL;
const LABEL_URL = process.env.LABEL_URL;
const OPEN_AI_KEY = process.env.OPEN_AI_KEY;
const OPEN_FDA_KEY = process.env.OPEN_FDA_KEY;
openai.api_key = OPEN_AI_KEY;


// Search for a medication by name
const searchMedicineLabels = async (query) => {
    try {
        // Replace with your OpenFDA API key
        const url = `https://api.fda.gov/drug/label.json?=${OPEN_FDA_KEY}&search=${query}`;

        const response = await axios.get(url);
        const results = response.data.results;

        console.log(`Found ${results.length} results:`);
        return results;
    } catch (error) {
        console.error('Error fetching data:', error.message);
    }
};

// function for openai api


// Example usage: search for a medication and get its label
app.get('/medications/:name', async (req, res) => {
    // console.log(req);
    const medications = await searchMedicineLabels(req.params.name);
    // console.log(`Medications:`)
    if (medications) {

        if (medications.length > 0) {
            const medication = medications[0];
            // console.log(`Medication: ${medication}`)
            // res.status(200).json({
            //     generic_name: medication.openfda.generic_name,
            //     do_not_use: medication.do_not_use,
            //     stop_use: medication.stop_use,
            //     purpose: medication.purpose
            // });

            // console.log(medication);
            const chatGPT = await getChatGPTResponse(medication.porpuse)
            res.status(200).json({
                message: "ChatGPT respose",
                data: chatGPT
            })
        } else {
            res.status(500).send('Error getting medication label');
        }
    } else {
        res.status(404).send('No medications found');
    }

});

// Your existing route for searching medicine labels
app.get('/search/:name', async (req, res) => {
    // Your existing code for searching medicine labels
});

// Route for consuming OpenAI response
// app.post('/openai-response', async (req, res) => {
//     // Extract the response from the request body
//     const openaiResponse = await getChatGPTResponse(req.body.response);

//     // Process the OpenAI response and return a response
//     // For example, you can return the response as-is or perform additional processing
//     res.status(200).json({
//         message: 'OpenAI response received',
//         data: openaiResponse
//     });
// });

function getChatGPTResponse(prompt) {
    // Example request to the GPT-3 API
    openai.createCompletion({
        model: 'text-davinci-003',
        prompt: `Summarize in simple terms the text in portuguese: ${prompt}`,
        max_tokens: 10
    }).then(response => {
        return response.choices[0].text
    }).catch(error => {
        return error;
    });
}

app.get('/', async (req, res) => res.send({ message: "What's up this is my APP, up and Runnning" }))

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
