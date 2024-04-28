// render.js

const renderPrefilledWordList = (vocabContainer, vocabularyList) => {
    vocabularyList.forEach((item) => {
        // Create a new card element
        const card = document.createElement('div');
        card.classList.add('card');

        // Create card content
        const cardContent = document.createElement('div');
        cardContent.classList.add('card-content');

        // Word element
        const wordElement = document.createElement('h3');
        wordElement.textContent = item.word;
        wordElement.classList.add('word');
        cardContent.appendChild(wordElement);

        // Definition element
        const definitionElement = document.createElement('p');
        definitionElement.textContent = item.definition;
        definitionElement.classList.add('definition');
        cardContent.appendChild(definitionElement);

        // Definition count
                const countElement = document.createElement('c');
                countElement.textContent = item.count;
                countElement.classList.add('count');
                cardContent.appendChild(countElement);

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
        vocabContainer.appendChild(card);
    });
};

export { renderPrefilledWordList };
