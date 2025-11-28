let tableFunctionalityDiv = document.getElementById("table-div");

const trackButton = document.getElementById("track-button");

let tableEntries = [];

trackButton.addEventListener("click", () => {
    document.getElementById("table-buttons-div").style.display = "inline";
    addButtonFunction();
    
});

function addButtonFunction() {

    const addButton = document.getElementById("add-button");
    addButton.addEventListener("click", () => {
        let parentDiv = document.getElementById("table-div");
        let childDiv = document.createElement("div");
        childDiv.id = "table-layout-div";

        const tableHeaders = ["Description", "Cost", "Category", "Total"];
        
        /* The following creates a table with the header rows if it doesn't exist */
        if (!document.querySelector(".expense-table")) {
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
        let tableElement = document.getElementById("expense-table");
        inputRow(tableElement, tableHeaders);
        let jsonData = getJson(getRowEntry(), tableHeaders);
        constructRow(jsonData, tableElement);
        
    });
}

function inputRow(parentDiv, fieldArray) {
    /* constructs the static input html row */
    let inputRow = document.createElement("tr");
    inputRow.id = "input-row";

    const inputFields = [];
    for (let i = 0; i < 4; i++){
        let dataEntry = document.createElement("td");
        let dataInput = document.createElement("input");
        dataInput.className = "table-input";
        dataInput.placeholder = fieldArray[i];
   
        dataEntry.appendChild(dataInput);
        inputRow.appendChild(dataEntry);
        inputFields.push(dataInput);
    }

    if (inputFields.length !== 4) {
        console.log("input fields couldn't be created");
        return;
    }

    for (let i = 0; i < 3; i++) {
        const element = document.getElementsByClassName("record-added")[i];
        if (element && element.style.display === "none") {
            element.style.display = "inline";
            console.log(element);
        }
}
    if (document.getElementsByClassName("record-added")[0].style.display !== "inline") {
        console.log("Additional buttons couldn't be shown");
        return;
    }
    parentDiv.appendChild(inputRow);
}


function getRowEntry() {
    /* returns an array of a singular record after it's added by the user in the
    static input elements*/
    const dataArray = [];
    let inputFields = document.getElementsByClassName("table-input");
    for (let i = 0; i < 4; i++) {
        if (inputFields[i]) {
            let data = inputFields[i].value;
            dataArray.push(data);
        } else {
            console.log(`Input field ${i} not found`);
            dataArray.push(""); // Push empty string as fallback
        }
    }
    if (dataArray.length === 0) {
        console.log("record couldn't be retrieved from user");
        return;
    }
    return dataArray;
}

function getJson(recordArray, headersArray) {
    /* returns the parsed record array into a json with the table headers as the keys 
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
    /* Constructs a singular record to add to the current html table
    this procedure is typically to be used when calling the add button */
    let record = document.createElement("tr");
    record.className = "table-record";
    let values = Object.values(dataJson);
    for (let i = 0; i < values.length; i++) {
        let field = document.createElement("td");
        field.textContent = values[i];
        record.appendChild(field);
    }
    if (record.querySelectorAll('td').length === 0  || record.querySelectorAll('td').length !== 4) {
        console.log("All 4 fields for the record couldn't be constructed");
        return;
    }
    parentTable.appendChild(record);
}

function constructTable(parentTable) {
    /* Constructs the whole table from the global array by iterating and extrapolating
    the values from each key in each JSON 
    this procedure is typically to be used when constructing a whole table from memory*/
    for (let i = 0; i < tableEntries.length; i++) {
        let entryRecord = document.createElement("tr");
        entryRecord.className = "table-record";
        entryRecord.id = `entry-${i+1}`;
        let values = Object.values(tableEntries[i])
        for (let j = 0; j < 4; j++) {
            let field = document.createElement("td");
            field.textContent = values[j];
            entryRecord.appendChild(field);
        }
        parentTable.appendChild(entryRecord);
    }
    

}