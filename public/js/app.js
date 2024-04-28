import { renderPrefilledWordList } from './renderExamples.js';

document.addEventListener('DOMContentLoaded', () => {
    const addWordBtn = document.getElementById('addWordBtn');
    const practiceWordBtn = document.getElementById('practiceWordBtn');
    const addWordModal = document.getElementById('addWordModal');
    const closeModalBtn = document.getElementsByClassName('close')[0];
    const vocabContainer = document.getElementById('vocab-container');
    let deleteIcon;
    let editIcon;


    fetch('/api/words-with-counts')
        .then(response => {
            if (response.ok) {
                return response.json(); // Parse the JSON response
            } else {
                throw new Error('Error fetching words: ' + response.statusText);
            }
        })
        .then(data => {
            // Render the list of words on the page
            renderPrefilledWordList(vocabContainer, data);
        })
        .catch(error => {
            console.error(error);
            // Handle errors, such as displaying an error message to the user
        });

    addWordBtn.addEventListener('click', () => {
    console.log('Add + button clicked');
        addWordModal.style.display = 'block';
    });

    closeModalBtn.addEventListener('click', () => {
        addWordModal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === addWordModal) {
            addWordModal.style.display = 'none';
        }
    });

    // Function to increment the count for a word
    const incrementCount = (word) => {
        fetch('/api/increment-count', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ word: word })
        })
        .then(response => {
            if (!response.ok) {
                console.error('Error incrementing count:', response.statusText);
            }
        })
        .catch(error => {
            console.error('Error incrementing count:', error);
        });
    };

    // Event listener for the Speak button in the practiceWordModal
    document.getElementById('practiceWordModal').addEventListener('click', (event) => {
        if (event.target.classList.contains('speak-button')) {
            const word = document.getElementById('practiceWordModalContent').textContent;
            speakWord(word);
        }
    });

    // Function to speak a word using the browser's speech synthesis
    function speakWord(word) {
        const utterance = new SpeechSynthesisUtterance(word);
        speechSynthesis.speak(utterance);
    }

    practiceWordBtn.addEventListener('click', () => {
        // Make a request to the server to get a random word
        fetch('/api/random-word')
            .then(response => response.json())
            .then(data => {
                // Display the random word in the practiceWordModal
                const practiceWordModalContent = document.getElementById('practiceWordModalContent');
                practiceWordModalContent.textContent = data.word;
                practiceWordModal.style.display = 'block';
                incrementCount(data.word);
            })
            .catch(error => {
                console.error('Error fetching random word:', error);
            });
    });

        window.addEventListener('click', (event) => {
            if (event.target === practiceWordModal) {
                practiceWordModal.style.display = 'none';
            }
        });

        window.addEventListener('click', (event) => {
                    if (event.target === practiceWordModal) {
                        practiceWordModal.style.display = 'none';
                    }
                });



    nextWordBtn.addEventListener('click', () => {
            // Make a request to the server to get a random word
            fetch('/api/random-word')
                .then(response => response.json())
                .then(data => {
                    // Display the random word in the practiceWordModal
                    const practiceWordModalContent = document.getElementById('practiceWordModalContent');
                    practiceWordModalContent.textContent = data.word;
                    practiceWordModal.style.display = 'block';
                    incrementCount(data.word);
                })
                .catch(error => {
                    console.error('Error fetching random word:', error);
                });
        });


    closeModalBtn.addEventListener('click', () => {
        practiceWordModal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === editModal) {
            editModal.style.display = 'none';
        }
    });

    // Event listener for delete icon
    document.addEventListener('click', (event) => {
        if (event.target.classList.contains('delete-icon')) {
            // Display the delete confirmation modal
            const deleteModal = document.getElementById('deleteModal');
            deleteModal.style.display = 'block';

            // Store a reference to the card to be deleted
            const cardToDelete = event.target.closest('.card');

            // Event listener for the confirm delete button
            document.getElementById('confirmDeleteBtn').addEventListener('click', () => {
                if (event.target.classList.contains('delete-icon')) {
                        const cardToDelete = event.target.closest('.card');
                        const word = cardToDelete.querySelector('.word').textContent;

                        fetch(`/api/delete-word/${word}`, {
                            method: 'DELETE',
                        })
                        .then(response => {
                            if (response.ok) {
                                // Remove the card from the DOM
                                cardToDelete.remove();
                                location.reload();
                            } else {
                                console.error('Error deleting word:', response.statusText);
                            }
                        })
                        .catch(error => {
                            console.error('Error deleting word:', error);
                        });
                    }
            });

            // Event listener for the cancel delete button
            closeModalBtn.addEventListener('click', () => {
                deleteModal.style.display = 'none';
            });

            window.addEventListener('click', (event) => {
                if (event.target === deleteModal) {
                    deleteModal.style.display = 'none';
                }
            });
        }
    });

    // Event listener for edit icon
    document.addEventListener('click', (event) => {
        if (event.target.classList.contains('edit-icon')) {
            // Display the edit modal
            const editModal = document.getElementById('editModal');
            editModal.style.display = 'block';

            // Store a reference to the card to be edited
            const cardToEdit = event.target.closest('.card');

            // Get the current word and definition from the card
            const oldWord = cardToEdit.querySelector('.word').textContent;
            const oldDefinition = cardToEdit.querySelector('.definition').textContent;

            // Update modal fields with current values
            document.getElementById('editWordInput').value = oldWord;
            document.getElementById('editDefinitionInput').value = oldDefinition;

            // Event listener for the confirm edit button
            document.getElementById('confirmEditBtn').addEventListener('click', () => {
                // Get the new word and definition from the modal
                const newWord = document.getElementById('editWordInput').value;
                const newDefinition = document.getElementById('editDefinitionInput').value;

                // Send a POST request to update the word and definition
                fetch('/api/update-word', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ oldWord, newWord, defintion: newDefinition })
                })
                .then(response => {
                    if (response.ok) {
                        // Update the word and definition on the card
                        cardToEdit.querySelector('.word').textContent = newWord;
                        cardToEdit.querySelector('.definition').textContent = newDefinition;
                        // Close the edit modal
                        editModal.style.display = 'none';
                    } else {
                        console.error('Error updating word:', response.statusText);
                    }
                })
                .catch(error => {
                    console.error('Error updating word:', error);
                });
            });
        }
    });



    const submitWordForm = document.getElementById('submitWordForm');

    submitWordForm.addEventListener('submit', (event) => {
    console.log('Add button clicked');
        event.preventDefault(); // Prevent default form submission

        const formData = new FormData(submitWordForm);
        const newWord = formData.get('newWord');
        const definition = formData.get('definition');

        // Determine whether to reload the page after adding the word
            const reloadPage = event.submitter.id === 'doneSubmitWrdBtn';

        // Send a POST request to the server to add the new word
        fetch('/api/add-word', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ word: newWord, definition: definition })
        })
        .then(response => {
            if (response.ok) {
                // If successful, reload the page to see the updated word list
                location.reload();
            } else {
                // If there was an error, parse the response JSON
                return response.json();
            }
        })
        .then(data => {
            // Display the error message to the user
            const errorMessage = data.error;
            if (errorMessage) {
                // Update the UI to display the error message
                const errorContainer = document.getElementById('error-container');
                errorContainer.textContent = errorMessage;
                errorContainer.style.display = 'block';
                setTimeout(() => {
                        errorContainer.style.display = 'none';
                    }, 3000);
            }
        })
        .catch(error => {
            console.error('Error adding word:', error);
            // Optionally, handle network errors
        });


        function renderNewWord(container, word) {
            // Create a new card element
            const card = document.createElement('div');
            card.classList.add('card');

            // Create card content
            const cardContent = document.createElement('div');
            cardContent.classList.add('card-content');

            // Word element
            const wordElement = document.createElement('h3');
            wordElement.textContent = word.word;
            wordElement.classList.add('word');
            cardContent.appendChild(wordElement);

            // Definition element
            const definitionElement = document.createElement('p');
            definitionElement.textContent = word.definition;
            definitionElement.classList.add('definition');
            cardContent.appendChild(definitionElement);

            // Delete icon
            const deleteIcon = document.createElement('i');
            deleteIcon.classList.add('fas', 'fa-trash-alt', 'delete-icon');
            card.appendChild(deleteIcon);

            // Edit icon
            const editIcon = document.createElement('i');
            editIcon.classList.add('fas', 'fa-edit', 'edit-icon');
            card.appendChild(editIcon);

            // Append card content to card
            card.appendChild(cardContent);

            // Append the new card to the container
            container.appendChild(card);
        }

    });
    // Function to speak a word using the browser's speech synthesis
    function speakWord(word) {
        const utterance = new SpeechSynthesisUtterance(word);

        // Get a list of available voices
        const voices = window.speechSynthesis.getVoices();

        // Select a voice that supports the desired language and gender (if available)
        const englishVoices = voices.filter(voice => voice.lang === 'en-US');
        const englishFemaleVoices = englishVoices.filter(voice => voice.name.includes('Female'));
        const selectedVoice = englishFemaleVoices.length > 0 ? englishFemaleVoices[0] : englishVoices[0];
        utterance.voice = selectedVoice;

        // Adjust pitch, rate, and volume for natural sound
        utterance.pitch = 1.0; // Pitch range: 0.1 to 2.0
        utterance.rate = 1.0; // Rate range: 0.1 to 10.0
        utterance.volume = 1.0; // Volume range: 0.0 to 1.0

        // Speak the word
        speechSynthesis.speak(utterance);
    }


});
