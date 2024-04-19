const colors = ['Black', 'Red', 'Blue', 'Green', 'Yellow', 'Orange', 'Purple', 'Pink', 'Brown', 'Gray'];
const rows = 10; 
let usedColors = [];
let lastSelectedColorIndex = 0;
let activeColor = '';


/// THIS IS FOR TABLE ONE

/**
 * Updates the color table based on the specified row count.
 */
function updateColorTable() {
    // Retrieves the row count input element
    const rowCountInput = document.getElementById('rowCount');
    // Parses the value of the row count input
    const rowCount = parseInt(rowCountInput.value);
    // Validates the row count
    if (rowCount < 1 || rowCount > 10 || isNaN(rowCount)) {
        alert('Enter a number between 1 and 10.');
        return;
    }
    // Retrieves the selected colors and updates the color table
    const selectedColors = getSelectedColorsFromTable();
    console.log("intial list: " + selectedColors);
    clearColorTable();
    populateColorTable(rowCount);
}

/**
 * Clears the color table by removing all rows and resetting the used colors array.
 */
function clearColorTable() {
    const colorTableBody = document.getElementById('colorTableBody');
    // Clears the color table body
    colorTableBody.innerHTML = '';
    // Resets the used colors array
    usedColors = []; 
}

/**
 * Populates the color table with the specified number of rows.
 * @param {number} rowCount - The number of rows to populate.
 */
function populateColorTable(rowCount) {
    const colorTableBody = document.getElementById('colorTableBody');

    for (let i = 0; i < rowCount; i++) {
        const row = document.createElement('tr');
        const colorCell = document.createElement('td');
        const dropdown = document.createElement('select');
        dropdown.classList.add('color-selector');
        dropdown.addEventListener('change', handleColorChange);
        populateDropdown(dropdown);
        colorCell.appendChild(dropdown);

        // Create radio button
        const radioButton = document.createElement('input');
        radioButton.type = 'radio';
        radioButton.name = 'colorRadio'; 
        radioButton.value = 'radio_' + i;
        radioButton.addEventListener('change', handleRadioChange);
        colorCell.appendChild(radioButton);

        row.appendChild(colorCell);
        row.appendChild(document.createElement('td'));
        colorTableBody.appendChild(row);
    }

    initializeRadioButtons();

    const allDropdowns = document.querySelectorAll('.color-selector');
    allDropdowns.forEach(dropdown => {
        const defaultColor = dropdown.querySelector('option').value;
        usedColors.push(defaultColor);
    });

    allDropdowns.forEach(dropdown => {
        const options = dropdown.querySelectorAll('option');
        options.forEach(option => {
            if (usedColors.includes(option.value)) {
                option.disabled = true;
            }
        });
    });
}

function handleRadioChange(event) {
    activeColor = event.target.closest('tr').querySelector('.color-selector').value;
}

function initializeRadioButtons() {
    console.log("Initializing radio buttons...");
    const allRadioButtons = document.querySelectorAll('input[type="radio"]');
    console.log("Found radio buttons:", allRadioButtons);
    allRadioButtons.forEach((radioButton, index) => {
        console.log("Processing radio button", index);
        radioButton.checked = (index === 0); // Simulate checking the first radio button on page load
        if (index === 0) {
            console.log("Simulating trigger for first radio button...");
            radioButton.dispatchEvent(new Event('change')); // Simulate trigger to make first buttons color the active color on page load
        }
        radioButton.addEventListener('click', () => {
            console.log("Radio button clicked:", radioButton.value);
            const selectedColor = radioButton.value;
            console.log("Selected color:", selectedColor);
            activeColor = selectedColor;
            console.log("Active color:", activeColor);
            allRadioButtons.forEach(radio => {
                if (radio.value !== selectedColor) {
                    radio.checked = false;
                }
            });
        });
    });
    console.log("Radio buttons initialized successfully.");
}

/**
 * Populates the dropdown with color options.
 * @param {HTMLSelectElement} dropdown - The dropdown element to populate.
 */
function populateDropdown(dropdown) {
    const startIndex = lastSelectedColorIndex % colors.length;
    const defaultColorIndex = startIndex % colors.length;
    const defaultColor = colors[defaultColorIndex];

    for (let i = 0; i < colors.length; i++) {
        const colorIndex = (startIndex + i) % colors.length;
        const color = colors[colorIndex];
        const option = document.createElement('option');
        option.value = color;
        option.text = color;

        if (usedColors.includes(color) && color !== defaultColor) {
            option.disabled = true;
        }

        dropdown.appendChild(option);
    }
    lastSelectedColorIndex++;

    dropdown.dataset.previousColor = defaultColor; // Initializes the default color for the dropdown
}

/**
 * Handles the color change event when a color is selected from the dropdown.
 * @param {Event} event - The change event object.
 */
function handleColorChange(event) {
    const selectedColor = event.target.value;
    const previousColor = event.target.dataset.previousColor;

    if (previousColor !== undefined && previousColor !== selectedColor) {
        const index = usedColors.indexOf(previousColor);
        if (index !== -1) {
            usedColors.splice(index, 1);
        }
    }

    if (!usedColors.includes(selectedColor)) {
        usedColors.push(selectedColor);
    }

    event.target.dataset.previousColor = selectedColor;

    const allDropdowns = document.querySelectorAll('.color-selector');
    allDropdowns.forEach(dropdown => {
        const options = dropdown.querySelectorAll('option');
        options.forEach(option => {
            if (option.value === selectedColor) {
                option.disabled = true;
            } else {
                option.disabled = usedColors.includes(option.value);
            }
        });
    });

    const selectedColors = getSelectedColorsFromTable();
    console.log("list update: " + selectedColors);
}

// Initial population of color table
populateColorTable(rows);

/// ^^^^^^ THIS IS FOR TABLE ONE




/// THIS IS FOR TABLE TWO


/**
 * Updates the alphabet table based on the specified row count.
 * @returns {number} The row count for the alphabet table.
 */
function updateAlphabetTable() {
    const rowCountInput = document.getElementById('tableTwoRowCount');
    const rowCount = parseInt(rowCountInput.value);
    if( rowCount < 1 || rowCount > 26 || isNaN(rowCount)) {
        alert('Enter a number between 1 and 26');
        return;
    }

    clearAlphabetTable();
    populateAlphabetTable(rowCount);

    console.log("Row Count in updateAlphabetTable():", rowCount);
    return rowCount;
}

/**
 * Clears the alphabet table by removing all rows.
 */
function clearAlphabetTable() {
    const alphabetTable = document.getElementById('alphabetTable');
    alphabetTable.innerHTML = '';
}

/**
 * Populates the alphabet table with rows and columns based on the specified row count.
 * @param {number} rowCount - The number of rows and columns to populate.
 */
function populateAlphabetTable(rowCount) {
    const alphabetTable = document.getElementById('alphabetTable');

    const headerRow = document.createElement('tr');
    for (let i = 0; i <= rowCount; i++) {
        const cell = document.createElement('td');
        if (i > 0) {
            cell.textContent = String.fromCharCode(64 + i);
        }
        headerRow.appendChild(cell);
    }
    alphabetTable.appendChild(headerRow);

    for (let i = 1; i <= rowCount; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j <= rowCount; j++) {
            const cell = document.createElement('td');
            if (j === 0) {
                cell.textContent = i;
            }
            row.appendChild(cell);
        }
        row.addEventListener('click', function(event) {
            if (event.target.cellIndex !== 0 && activeColor !== '') {
                event.target.style.backgroundColor = activeColor;
            }
        });
        alphabetTable.appendChild(row);
    }
}


/// ^^^^^ THIS IS TABLE TWO


/// THIS IS FOR PRINT BUTTON

/**
 * Generates a printable view with the selected colors and alphabet table.
 */
function generatePrintableView() {
    const rowCountForPrint = updateAlphabetTable();
    console.log("Row Count in generatePrintableView():", rowCountForPrint); 
    const selectedColors = getSelectedColorsFromTable();

    const newWindow = window.open('printableView.html', '_blank');

    newWindow.onload = function() {
        const colorTable = newWindow.document.getElementById('colorTable-printout');
        populateColorTableFromList(selectedColors, colorTable);
        
        const alphabetTable = newWindow.document.getElementById('alphabetTable-printout');
        populateAlphabetTablePrint(rowCountForPrint, alphabetTable);
    };
}



/// ^^^^ THIS IS FOR PRINT BUTTON


/// THIS IS FOR PRINT TABLE ONE

/**
 * Retrieves the selected colors from the color table.
 * @returns {string[]} An array of selected colors.
 */
function getSelectedColorsFromTable() {
    const selectedColors = [];
    const allDropdowns = document.querySelectorAll('.color-selector');
    
    allDropdowns.forEach(dropdown => {
        const selectedColor = dropdown.value;
        selectedColors.push(selectedColor);
    });
    
    return selectedColors;
}

/**
 * Populates the color table in the printable view with the selected colors.
 * @param {string[]} selectedColors - An array of selected colors.
 * @param {HTMLTableElement} colorTable - The color table element in the printable view.
 */
function populateColorTableFromList(selectedColors, colorTable) {
    colorTable.innerHTML = '';

    selectedColors.forEach(color => {
        const row = document.createElement('tr');
        const colorCell = document.createElement('td');
        colorCell.textContent = color;
        row.appendChild(colorCell);
        row.appendChild(document.createElement('td'));
        colorTable.appendChild(row);
    });
}

/**
 * Populates the alphabet table in the printable view with rows and columns.
 * @param {number} rowCount - The number of rows and columns to populate.
 * @param {HTMLTableElement} alphabetTable - The alphabet table element in the printable view.
 */
function populateAlphabetTablePrint(rowCount, alphabetTable) {
    console.log("Populating Alphabet Table with row count:", rowCount);

    const headerRow = document.createElement('tr');
    for(let i = 0; i <= rowCount; i++) {
        const cell = document.createElement('td');
        if (i > 0) {
            cell.textContent = String.fromCharCode(64 + i);
        }
        headerRow.appendChild(cell);
    }
    alphabetTable.appendChild(headerRow);

    for (let i = 1; i <= rowCount; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j <= rowCount; j++) {
            const cell = document.createElement('td');
            if (j === 0) {
                cell.textContent = i;
            }
            row.appendChild(cell);
        }
        alphabetTable.appendChild(row);
    }
}


/// ^^^^^^ THIS IS FOR PRINT TABLE TWO