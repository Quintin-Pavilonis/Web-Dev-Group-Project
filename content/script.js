const colors = ['Black', 'Red', 'Blue', 'Green', 'Yellow', 'Orange', 'Purple', 'Pink', 'Brown', 'Gray'];
const rows = 10; 
let usedColors = [];
let lastSelectedColorIndex = 0;
let activeColor = '';
let coords = [];
let cellColorMap = {}; 


/// TABLE ONE

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
    // Retrieves the selected colors and updates the color table, needs to be re worked maybe?
    const selectedColors = getSelectedColorsFromTable();

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

        //allocate coords array
        coords[i] = [];

        // Create radio button
        const radioButton = document.createElement('input');
        radioButton.type = 'radio';
        radioButton.name = 'colorRadio'; 
        radioButton.value = 'radio_' + i;
        radioButton.addEventListener('change', handleRadioChange);
        colorCell.appendChild(radioButton);

        row.appendChild(colorCell);
        const coordsCell = document.createElement('td');
        let coordsCellId = "coordsCell_" + i;
        coordsCell.setAttribute('id', coordsCellId);
        row.appendChild(coordsCell);
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

    const allRadioButtons = document.querySelectorAll('input[type="radio"]');

    allRadioButtons.forEach((radioButton, index) => {

        radioButton.checked = (index === 0); // Simulate checking the first radio button on page load
        if (index === 0) {

            radioButton.dispatchEvent(new Event('change')); // Simulate trigger to make first buttons color the active color on page load
        }
        radioButton.addEventListener('click', () => {

            const selectedColor = radioButton.value;

            activeColor = selectedColor;

            allRadioButtons.forEach(radio => {
                if (radio.value !== selectedColor) {
                    radio.checked = false;
                }
            });
        });
    });

}

/**
 * Populates the dropdown with color options.
 * @param {HTMLSelectElement} dropdown - The dropdown element to populate.
 */
function populateDropdown(dropdown) {
    const startIndex = lastSelectedColorIndex % colors.length;
    const defaultColorIndex = startIndex % colors.length;
    const defaultColor = colors[defaultColorIndex];

    console.log("Starting populateDropdown with default color:", defaultColor); // Log initial default color

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

    console.log("Dropdown initialized with colors, usedColors after initialization:", usedColors);
}

/**
 * Handles the color change event when a color is selected from the dropdown.
 * @param {Event} event - The change event object.
 */
function handleColorChange(event) {
    const dropdown = event.target;
    const newColor = dropdown.value;
    const previousColor = dropdown.dataset.previousColor;
    const rowIndex = dropdown.closest('tr').rowIndex - 1;  // Skips header row

    if (previousColor && previousColor !== newColor) {
        // Update usedColors management
        const index = usedColors.indexOf(previousColor);
        if (index !== -1) {
            usedColors.splice(index, 1);
        }
        if (!usedColors.includes(newColor)) {
            usedColors.push(newColor);
        }

        // Transfer cell IDs to the new color key in cellColorMap
        if (cellColorMap[previousColor]) {
            cellColorMap[newColor] = cellColorMap[newColor] || [];
            cellColorMap[previousColor].forEach(cellId => {
                const cell = document.getElementById(cellId);
                if (cell) {
                    cell.style.backgroundColor = newColor;
                    cell.setAttribute('data-color', newColor);
                }
            });
            cellColorMap[newColor].push(...cellColorMap[previousColor]);
            delete cellColorMap[previousColor];

            // Update coordinate display for colors
            updateCoordsDisplay(newColor, previousColor, rowIndex);
        }

        // Update dropdowns to reflect changes
        updateDropdowns();

        dropdown.dataset.previousColor = newColor;
    }
}

function updateCoordsDisplay(color) {
    const allDropdowns = document.querySelectorAll('.color-selector');
    allDropdowns.forEach((dropdown, index) => {
        if (dropdown.value === color) {
            // Retrieve the array of coords and sort in color table
            let coordsArray = cellColorMap[color] || [];
            coordsArray.sort((a, b) => {
                // Extract letters and numbers
                let matchA = a.match(/([A-Z]+)(\d+)/);
                let matchB = b.match(/([A-Z]+)(\d+)/);
                let letterA = matchA[1], numberA = parseInt(matchA[2], 10);
                let letterB = matchB[1], numberB = parseInt(matchB[2], 10);

                // First compare letters then numbers
                if (letterA === letterB) {
                    return numberA - numberB;
                }
                return letterA.localeCompare(letterB);
            });

            let coordsText = coordsArray.join(" ");
            let coordsCellId = "coordsCell_" + index;
            let coordsCell = document.getElementById(coordsCellId);
            coordsCell.textContent = coordsText;
        }
    });
}

function updateDropdowns() {
    document.querySelectorAll('.color-selector').forEach(dropdown => {
        const currentColor = dropdown.value;
        dropdown.querySelectorAll('option').forEach(option => {
            if (usedColors.includes(option.value) && option.value !== currentColor) {
                option.disabled = true;
            } else {
                option.disabled = false;
            }
        });
    });
}

// Initial population of color table
populateColorTable(rows);

/// END TABLE ONE




///  TABLE TWO


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

    // Clear the table first
    alphabetTable.innerHTML = '';

    // Create and append the header row
    const headerRow = document.createElement('tr');
    for (let i = 0; i <= rowCount; i++) {
        const headerCell = document.createElement('td');
        if (i > 0) {
            headerCell.textContent = String.fromCharCode(64 + i); // Assigns A, B, C, etc., to headers
        }
        headerRow.appendChild(headerCell);
    }
    alphabetTable.appendChild(headerRow);

    // Create and append the rest of the rows and cells
    for (let i = 1; i <= rowCount; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j <= rowCount; j++) {
            const cell = document.createElement('td');
            if (j === 0) {
                cell.textContent = i; // Row label 1, 2, 3, etc.
            } else {
                let index = String.fromCharCode(64 + j) + i; // Create IDs like A1, B1, etc.
                cell.setAttribute('id', index);
            }
            row.appendChild(cell);
        }
        alphabetTable.appendChild(row);
    }

    // Attach a single click event listener to the table for handling cell color changes
    alphabetTable.addEventListener('click', function(event) {
        let target = event.target;
        if (target.tagName === 'TD' && target.cellIndex !== 0 && target.parentNode.rowIndex !== 0 && activeColor) {
            target.style.backgroundColor = activeColor;
            target.setAttribute('data-color', activeColor);
    
            let indexToAdd = target.getAttribute('id');
    
            // Manage cellColorMap: remove from old color, add to new
            Object.keys(cellColorMap).forEach(color => {
                if (cellColorMap[color].includes(indexToAdd) && color !== activeColor) {
                    let index = cellColorMap[color].indexOf(indexToAdd);
                    if (index > -1) {
                        cellColorMap[color].splice(index, 1); // Remove from old color array
                        updateCoordsDisplay(color); // Update HTML display for old color
                    }
                }
            });
    
            // Add to new color if not already present
            if (!cellColorMap[activeColor]) {
                cellColorMap[activeColor] = [];
            }
            if (!cellColorMap[activeColor].includes(indexToAdd)) {
                cellColorMap[activeColor].push(indexToAdd);
            }
            updateCoordsDisplay(activeColor); // Update HTML display for new color
    
            console.log("Colored cell at:", indexToAdd, "with color:", activeColor);
            console.log("Updated cellColorMap:", cellColorMap);
        }
    });
}

function updateCellColorsOnDropdownChange(dropdown) {
    const newColor = dropdown.value;
    const previousColor = dropdown.dataset.previousColor;

    if (previousColor && cellColorMap[previousColor]) {
        cellColorMap[previousColor].forEach(cellId => {
            let cell = document.getElementById(cellId);
            if (cell) {
                cell.style.backgroundColor = newColor;
                cell.setAttribute('data-color', newColor);
            }
        });

        // Move the array of cell IDs from the old color to the new color in cellColorMap
        cellColorMap[newColor] = (cellColorMap[newColor] || []).concat(cellColorMap[previousColor]);
        delete cellColorMap[previousColor];
    }

    dropdown.dataset.previousColor = newColor;
    console.log(`Color changed from ${previousColor} to ${newColor}. Updated cells and cellColorMap.`);
}


/// END TABLE TWO



///  PRINT BUTTON

/**
 * Generates a printable view with the selected colors and alphabet table.
 */
function generatePrintableView() {
    const rowCountForPrint = updateAlphabetTable();

    const selectedColors = getSelectedColorsFromTable();

    const newWindow = window.open('printableView.html', '_blank');

    newWindow.onload = function() {
        const colorTable = newWindow.document.getElementById('colorTable-printout');
        populateColorTableFromList(selectedColors, colorTable);
        
        const alphabetTable = newWindow.document.getElementById('alphabetTable-printout');
        populateAlphabetTablePrint(rowCountForPrint, alphabetTable);
    };
}



/// END PRINT BUTTON


/// PRINT TABLE ONE

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

    // Loop over each selected color
    for (let i = 0; i < selectedColors.length; i++) {
        const color = selectedColors[i];
        const row = document.createElement('tr');
        const colorCell = document.createElement('td');
        colorCell.textContent = color;
        row.appendChild(colorCell);
        
        const coordsCell = document.createElement('td');
        let coordsList = cellColorMap[color] || [];
        
        // Sort the coordinates on color table print out
        coordsList.sort((a, b) => {
            let matchA = a.match(/([A-Z]+)(\d+)/);
            let matchB = b.match(/([A-Z]+)(\d+)/);
            let letterA = matchA[1], numberA = parseInt(matchA[2], 10);
            let letterB = matchB[1], numberB = parseInt(matchB[2], 10);
            return letterA.localeCompare(letterB) || numberA - numberB;
        });

        // Create a space-separated string of coordinates and update the cell text
        let coordString = coordsList.join(" ");
        coordsCell.textContent = coordString;
        row.appendChild(coordsCell);

        colorTable.appendChild(row);
    }
}



/// END PRINT TABLE ONE


///  PRINT TABLE TWO

/**
 * Populates the alphabet table in the printable view with rows and columns.
 * @param {number} rowCount - The number of rows and columns to populate.
 * @param {HTMLTableElement} alphabetTable - The alphabet table element in the printable view.
 */
function populateAlphabetTablePrint(rowCount, alphabetTable) {


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


/// END PRINT TABLE TWO

//color selection
function addColor() {
    // retrieve inputs for adding a color
    const colorNameInput = document.getElementById('color_name');
    const hexValueInput = document.getElementById('hex_value');
    // Parses the value of the row count input
    const colorName = colorNameInput.value;
    const hexValue = hexValueInput.value;
    //check for validity
    let pound = hexValue.substring(0, 1);
    if (colorName == '' || hexValue == '' || (!(pound == '#')) || hexValue.length != 7) {
        document.getElementById('add_response').innerHTML = "Incorrect value/s entered.";
    }
    else {
    //send to database
    //MAKE SURE TO PUT CORRECT EID IN URL !!
    const addColorUrl = "https://cs.colostate.edu:4444/~cwagner4/TeamOne/content/database_connection.php?add_color_name=" + colorName + "&add_hex_value=%23" + hexValue.substring(1,7);
    fetch(addColorUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error("Connection failed");
            }
            return response.text();
        }) .then(data => {
            document.getElementById('add_response').innerHTML = data;
        });
        //clear fields
        colorNameInput.value = '';
        hexValueInput.value = '';
    }
}

function deleteColor() {
    // retrieve inputs for deleting color
    const deletedColorNameInput = document.getElementById("delete_color");
    const deletedColorHexInput = document.getElementById("deleted_color_hex");
    // Parse the value of row count input 
    const deletedColorName = deletedColorNameInput.value;
    const deletedColorHex = deletedColorHexInput.value;

    let pound = deletedColorHex.substring(0, 1);
    if (deletedColorName == '' || deletedColorHex == '' || (!(pound == '#')) || hexValue.length != 7) {
        document.getElementById('delete_response').innerHTML = "Incorrect value/s entered.";
    }
    else {

    }
}

