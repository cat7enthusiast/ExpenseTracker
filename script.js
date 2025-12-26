let tableFunctionalityDiv = document.getElementById("table-div");

const trackButton = document.getElementById("track-button");

let tableEntries = [];
let inputRowExists = false;
const tableHeaders = ["ID", "Description", "Cost", "Category"];

trackButton.addEventListener("click", () => {
    document.getElementById("table-buttons-div").style.display = "inline";
    document.getElementById("no-table-div").remove();
    initialiseTable();
    let expenseTable = document.getElementById("expense-table");

    setupAddButton(expenseTable);
    setupDeleteButton(expenseTable);
    setupFilterButton(expenseTable);
    setupSummaryButton(expenseTable);
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

function setupAddButton(tableElement) {
    const addButton = document.getElementById("add-button");
    
    createInputRow(tableElement);
    inputRowExists = true;
    
    addButton.addEventListener("click", () => {
        saveCurrentEntry();
    });
}

function createInputRow(parentTable) {
    let inputRow = document.createElement("tr");
    inputRow.id = "input-row";

    let idField = document.createElement("td");
    idField.textContent = "";
    idField.className = "id-placeholder record-entry"; 
    inputRow.appendChild(idField);

    const inputHeaders = ["Description", "Cost", "Category"];
    for (let i = 0; i < inputHeaders.length; i++){
        let dataEntry = document.createElement("td");
        let dataInput = document.createElement("input");
        dataInput.className = "table-input";
        dataInput.placeholder = inputHeaders[i];
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

async function saveCurrentEntry() {
    /* Saves the current input row data and creates a new record */
    
    const dataArray = getRowEntry();
    
    if (dataArray.some(val => val.trim() === "")) {
        alert("Please fill in all fields before adding a record.");
        return;
    }
    
    const apiHeaders = ["Description", "Cost", "Category"];
    let jsonData = await getJson(dataArray, apiHeaders);
    if(!jsonData) return;
    
    let tableElement = document.getElementById("expense-table");
    constructRow(jsonData, tableElement);
    
    clearInputFields();
}

function getRowEntry() {
    /* Returns an array of values from the input fields */
    const dataArray = [];
    let inputFields = document.getElementsByClassName("table-input");
    
    for (let i = 0; i < 3; i++) {
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

async function getJson(recordArray, headersArray) {
    /* Returns the parsed record array into a json with the table headers as the keys 
    also adds it to global array 'tableEntries' */

    let entryData = {};
    for (let i = 0; i < headersArray.length; i++) {
        entryData[headersArray[i]] = recordArray[i];
    }
    entryData["Timestamp"] = new Date().toUTCString();
    
    if (Object.values(entryData).length !== 4) {
        console.log("JSON wasn't constructed properly for data record");
        return;
    }
    
    try {
        const apiResponse = await fetch("http://localhost:5171/api/Expense/entry",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(entryData)
            }
        );

        if (!apiResponse.ok) {
            throw new Error(`HTTP error: ${apiResponse.status}`);
        }

        const createdExpense = await apiResponse.json();
        console.log("Created Expense:,", createdExpense);
        return createdExpense;

    } catch (e) {
        console.error(`ERROR: ${e}`);
        alert("Expense creation FAILED");
        return;
    }

}

function constructRow(dataJson, parentTable) {
    /* Constructs a singular record to add to the current html table */
    let record = document.createElement("tr");
    record.className = "table-record";
    
    const orderedFields = ["id", "description", "cost", "category"];

    orderedFields.forEach(field => {
        let newField = document.createElement("td");
        newField.textContent = dataJson[field] || "";
        newField.className = "record-entry";
        record.appendChild(newField);
    })
    
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
        
        for (let j = 0; j < 3; j++) {
            let field = document.createElement("td");
            field.className = "record-entry";
            field.textContent = values[j];
            entryRecord.appendChild(field);
        }
        
        parentTable.appendChild(entryRecord);
    }
}

function setupDeleteButton(tableElement) {
    /* Creates a checkbox for each record that then creates a clear button and deletes
    the selected records from the table */
    document.getElementById("delete-button").addEventListener("click", () => {
        if (recordsAreEmpty("delete")) {
            return;
        }

        const tableHeaders = tableElement.querySelector("tr");
        if (!tableHeaders.querySelector(".delete-header")) {
            const deleteHeader = document.createElement("th");
            deleteHeader.className = "delete-header";
            tableHeaders.insertBefore(deleteHeader, tableHeaders.firstChild);
        }

        const inputRow = document.getElementById("input-row");
        if (inputRow && !inputRow.querySelector(".delete-input-cell")) {
            const td = document.createElement("td");
            td.className = "delete-input-cell";
            inputRow.insertBefore(td, inputRow.firstChild);
        }

        tableElement.querySelectorAll(".table-record").forEach(record => {
            if (record.querySelector(".delete-checkbox")) return;
            const td = document.createElement("td");
            const checkBox = document.createElement("input");
            checkBox.type = "checkbox";
            checkBox.className = "delete-checkbox";
            td.appendChild(checkBox);
            record.insertBefore(td, record.firstChild);

            checkBox.addEventListener("change", function() {
                record.classList.toggle("unwanted-record", this.checked);

                if (this.checked && !document.querySelector("#clear-button"))  {
                    
                    console.log(`${this} checked`);
                    record.classList.add("unwanted-record");

                    if (document.querySelector("#clear-button")) {
                        console.log("clear button found, exiting function");
                        return;
                    }
                    let button = makeClearButton(document.getElementById("table-buttons-div"))
                    button.addEventListener("click", () => {
                        document.querySelectorAll(".unwanted-record").forEach(e => e.remove());
                        if (!document.querySelectorAll("unwanted-record").length) {
                            checkBox.remove();
                            document.querySelectorAll(".delete-checkbox").forEach(checkbox => checkbox.remove());
                        }
                    });

                }
            })
        });
    

    });

}

function makeClearButton(parentDiv) {
    /* creates the clear button when a user wants to delete a record */
    const clearButton = document.createElement("button");
    clearButton.type = "button";
    clearButton.textContent = "Clear selected";
    clearButton.className = "table-button";
    clearButton.id = "clear-button";
    parentDiv.appendChild(clearButton);
    return clearButton;
}

function setupFilterButton(tableElement) {
    document.getElementById("filter-button").addEventListener("click", () => {
        if (recordsAreEmpty("filter")) return;

        const dateLabel = document.createElement("label");
        dateLabel.textContent = "Load records from date:";
        dateLabel.setAttribute("for", "date-filter");

        const dateInput = document.createElement("input");
        dateInput.type = "date";
        dateInput.id = "date-filter";


    });
}

function setupSummaryButton(tableElement) {
    document.getElementById("summary-button").addEventListener("click", () => {
        if (recordsAreEmpty("summarise")) return;
    });
}

function recordsAreEmpty(action) {
    if (!document.getElementById("expense-table").querySelectorAll(".table-record").length) {
        alert (`Nothing to ${action}`);
        return true;
    }
    return false;
}