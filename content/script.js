const colors = ['Black', 'Red', 'Blue', 'Green', 'Yellow', 'Orange', 'Purple', 'Pink', 'Brown', 'Gray'];
const rows = 10; 
let usedColors = [];
let lastSelectedColorIndex = 0;

function updateColorTable() {
    const rowCountInput = document.getElementById('rowCount');
    const rowCount = parseInt(rowCountInput.value);
    if ( rowCount < 1 || rowCount > 10 || isNaN(rowCount)) {
        alert('Enter a number between 1 and 10.');
        return;
    }

    clearColorTable();
    populateColorTable(rowCount);
}

function clearColorTable() {
    const colorTableBody = document.getElementById('colorTableBody');
    colorTableBody.innerHTML = '';
    usedColors = []; 
}

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
        row.appendChild(colorCell);
        row.appendChild(document.createElement('td'));
        colorTableBody.appendChild(row);
    }


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

   
    dropdown.dataset.previousColor = defaultColor; /// where default color for dropdron is initialized
}

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
}

populateColorTable(rows);

/// ^^^^^^ THIS IS FOR TABLE ONE




/// THIS IS FOR TABLE TWO



function updateAlphabetTable() {
    const rowCountInput = document.getElementById('tableTwoRowCount');
    const rowCount = parseInt(rowCountInput.value);
    if( rowCount < 1 || rowCount > 26 || isNaN(rowCount)) {
        alert('Enter a number between 1 and 26');
        return;
    }

    clearAlphabetTable();
    populateAlphabetTable(rowCount);
}

function clearAlphabetTable() {
    const alphabetTable = document.getElementById('alphabetTable');
    alphabetTable.innerHTML = '';
}

function populateAlphabetTable(rowCount) {
    const alphabetTable = document.getElementById('alphabetTable');

    
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


/// ^^^^^ THIS IS TABLE TWO