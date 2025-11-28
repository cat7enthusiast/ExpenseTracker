let tableFunctionalityDiv = document.getElementById("table-div");

const trackButton = document.getElementById("track-button");

let tableEntries = [];
let inputRowExists = false;
const tableHeaders = ["Description", "Cost", "Category", "Total"];

trackButton.addEventListener("click", () => {
    document.getElementById("table-buttons-div").style.display = "inline";
    document.getElementById("no-table-div").remove();
    initialiseTable();
    setupAddButton();
});

function initialiseTable() {
    /* Creates the table structure with headers if it doesn't exist */
    if (!document.querySelector(".expense-table")) {
        let parentDiv = document.getElementById("table-div");
        let childDiv = document.createElement("div");
        childDiv.id = "table-layout-div";

        let expenseTable = document.createElement("table");
        expenseTable.className = "expense-table";
        expenseTable.id = "expense-table";
        let headerRow = document.createElement("tr");

        for (let i = 0; i < tableHeaders.length; i++) {
            let tableHeader = document.createElement("th");
            tableHeader.textContent = tableHeaders[i];
            tableHeader.className = "table-header";
            tableHeader.id = `${tableHeaders[i]}-header`;
            headerRow.appendChild(tableHeader);
        }
        
        expenseTable.appendChild(headerRow);
        childDiv.appendChild(expenseTable);
        parentDiv.appendChild(childDiv);
    }
}

function setupAddButton() {
    const addButton = document.getElementById("add-button");
    let tableElement = document.getElementById("expense-table");
    
    createInputRow(tableElement);
    inputRowExists = true;
    
    addButton.addEventListener("click", () => {
        saveCurrentEntry();
    });
}

function createInputRow(parentTable) {
    /* Creates the input row for user to enter data */
    
    let inputRow = document.createElement("tr");
    inputRow.id = "input-row";

    for (let i = 0; i < 4; i++){
        let dataEntry = document.createElement("td");
        let dataInput = document.createElement("input");
        dataInput.className = "table-input";
        dataInput.placeholder = tableHeaders[i];
        dataInput.id = `input-${i}`;
        
        dataEntry.appendChild(dataInput);
        inputRow.appendChild(dataEntry);
    }

    const recordAddedButtons = document.getElementsByClassName("record-added");
    for (let i = 0; i < recordAddedButtons.length; i++) {
        recordAddedButtons[i].style.display = "inline";
    }
    
    parentTable.appendChild(inputRow);
    
    document.getElementById("input-0").focus();
}

function saveCurrentEntry() {
    /* Saves the current input row data and creates a new record */
    const dataArray = getRowEntry();
    
    if (dataArray.some(val => val.trim() === "")) {
        alert("Please fill in all fields before adding a record.");
        return;
    }
    
    const tableHeaders = ["Description", "Cost", "Category", "Total"];
    let jsonData = getJson(dataArray, tableHeaders);
    
    let tableElement = document.getElementById("expense-table");
    constructRow(jsonData, tableElement);
    
    clearInputFields();
}

function getRowEntry() {
    /* Returns an array of values from the input fields */
    const dataArray = [];
    let inputFields = document.getElementsByClassName("table-input");
    
    for (let i = 0; i < 4; i++) {
        if (inputFields[i]) {
            let data = inputFields[i].value;
            dataArray.push(data);
        } else {
            console.log(`Input field ${i} not found`);
            dataArray.push("");
        }
    }
    
    return dataArray;
}

function clearInputFields() {
    /* Clears all input fields after data is saved */
    let inputFields = document.getElementsByClassName("table-input");
    for (let i = 0; i < inputFields.length; i++) {
        if (inputFields[i]) {
            inputFields[i].value = "";
        }
    }
    if (inputFields[0]) {
        inputFields[0].focus();
    }
}

function getJson(recordArray, headersArray) {
    /* Returns the parsed record array into a json with the table headers as the keys 
    also adds it to global array 'tableEntries' */
    let recordObject = {};
    for (let i = 0; i < headersArray.length; i++) {
        recordObject[headersArray[i]] = recordArray[i];
    }
    
    if (Object.values(recordObject).length !== 4) {
        console.log("JSON wasn't constructed properly for data record");
        return;
    }
    
    tableEntries.push(recordObject);
    return recordObject;
}

function constructRow(dataJson, parentTable) {
    /* Constructs a singular record to add to the current html table */
    let record = document.createElement("tr");
    record.className = "table-record";
    let values = Object.values(dataJson);
    
    for (let i = 0; i < values.length; i++) {
        let field = document.createElement("td");
        field.textContent = values[i];
        field.className = "record-entry";
        record.appendChild(field);
    }
    
    if (record.querySelectorAll('td').length === 0 || record.querySelectorAll('td').length !== 4) {
        console.log("All 4 fields for the record couldn't be constructed");
        return;
    }
    
    parentTable.appendChild(record);
}

function constructTable(parentTable) {
    /* Constructs the whole table from the global array by iterating and extrapolating
    the values from each key in each JSON */
    for (let i = 0; i < tableEntries.length; i++) {
        let entryRecord = document.createElement("tr");
        entryRecord.className = "table-record";
        entryRecord.id = `entry-${i+1}`;
        let values = Object.values(tableEntries[i]);
        
        for (let j = 0; j < 4; j++) {
            let field = document.createElement("td");
            field.className = "record-entry";
            field.textContent = values[j];
            entryRecord.appendChild(field);
        }
        
        parentTable.appendChild(entryRecord);
    }
}