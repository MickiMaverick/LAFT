const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON request body
app.use(express.json());

// Serve static files (if needed)
app.use(express.static(path.join(__dirname, 'public')));

// Store the vocabulary list in memory (you may want to use a database in a real application)
let vocabularyList = [];

// Read vocabulary list from JSON file on server startup
fs.readFile(path.join(__dirname, 'vocabulary.json'), (err, data) => {
    if (err) {
        console.error('Error reading vocabulary list:', err);
    } else {
        vocabularyList = JSON.parse(data); // Parse JSON data
        console.log('Vocabulary list loaded successfully.');
    }
});

// Endpoint to fetch the list of words
app.get('/api/words', (req, res) => {
    res.json(vocabularyList); // Respond with the vocabularyList array as JSON
});

// Endpoint to get all words with counts
app.get('/api/words-with-counts', (req, res) => {
    // Send the vocabulary list with counts
    const wordsWithCounts = vocabularyList.map(word => {
        return {
            word: word.word,
            definition: word.definition,
            count: word.count // Include the count
        };
    });
    res.status(200).send(wordsWithCounts);
});

// Define getRandomWord function
const getRandomWord = () => {
    // Generate a random index within the range of the vocabularyList array length
    const randomIndex = Math.floor(Math.random() * vocabularyList.length);

    // Retrieve the word corresponding to the random index
    const randomWord = vocabularyList[randomIndex];

    return randomWord;
};

// Endpoint to get a random word from the vocabulary list
app.get('/api/random-word', (req, res) => {
    const randomWord = getRandomWord(); // Implement this function to get a random word from vocabularyList
    res.status(200).send(randomWord);
});

// Endpoint to add a new word to the vocabulary list
app.post('/api/add-word', (req, res) => {
    const { word, definition } = req.body;

    // Check if the word already exists in the vocabulary list
    const existingWord = vocabularyList.find(item => item.word === word);
    if (existingWord) {
        return res.status(400).send({ error: 'Word already exists in the vocabulary list.' });
    }

    // Validate that the word contains only a single word (no spaces)
    if (!word.match(/^\w+$/)) {
        return res.status(400).send({ error: 'Word must contain only a single word (no spaces).' });
    }

    // Add the word and definition to the vocabulary list
    vocabularyList.push({ word, definition });
    saveVocabularyList();

    // Send a success response back to the client
    res.status(201).send({ message: 'Word added successfully.' });
});

// server.js

// Endpoint to update a word and description
app.post('/api/update-word', (req, res) => {
    const { oldWord, newWord, definition, newDefinition } = req.body;

    // Find the word in the vocabulary list
    const wordIndex = vocabularyList.findIndex(item => item.word === oldWord);

    // If word is not found, return a 404 error
    if (wordIndex === -1) {
        return res.status(404).send({ error: 'Word not found.' });
    }

    // Update the word and description
    vocabularyList[wordIndex].word = newWord;
    vocabularyList[wordIndex].definition = newDefinition;
    saveVocabularyList();

    // Send a success response back to the client
    res.status(200).send({ message: 'Word updated successfully.' });
});



// Endpoint to delete a word from the vocabulary list
app.delete('/api/delete-word/:word', (req, res) => {
    const { word } = req.params;

    // Find the index of the word in the vocabulary list
    const index = vocabularyList.findIndex(item => item.word === word);

    if (index !== -1) {
        // Remove the word from the vocabulary list
        vocabularyList.splice(index, 1);
        saveVocabularyList();
        res.sendStatus(200);
    } else {
        res.status(404).send({ error: 'Word not found.' });
    }
});

// New endpoint to increment the count when a word is displayed
app.post('/api/increment-count', (req, res) => {
    const { word } = req.body;
    const index = vocabularyList.findIndex(item => item.word === word);
    if (index !== -1) {
        vocabularyList[index].count++; // Increment the count for the word
        saveVocabularyList(); // Save the updated vocabulary list
        res.status(200).send({ message: 'Count incremented successfully.' });
    } else {
        res.status(404).send({ error: 'Word not found.' });
    }
});

// Function to save vocabulary list to JSON file
const saveVocabularyList = () => {
    const jsonData = JSON.stringify(vocabularyList, null, 2);
    fs.writeFile(path.join(__dirname, 'vocabulary.json'), jsonData, (err) => {
        if (err) {
            console.error('Error saving vocabulary list:', err);
        } else {
            console.log('Vocabulary list saved successfully.');
        }
    });
};

// Serve the dashboard HTML file when users visit the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'views', 'dashboard.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
