let tableFunctionalityDiv = document.getElementById("table-div");

const trackButton = document.getElementById("track-button");

let tableEntries = {};

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
        addRow(document.getElementById("expense-table"), tableHeaders);
    });
}

function addRow(parentDiv, fieldArray) {

    let tableRow = document.createElement("tr");
    for (let i = 0; i < 4; i++){
        let dataEntry = document.createElement("td");
        dataEntry.id = `${fieldArray[i]}Id`
        let dataInput = document.createElement("input");
        dataInput.className = "table-input";
        dataInput.textContent = fieldArray[i];
        dataInput.id = `${fieldArray[i]}Input`;
        dataEntry.appendChild(dataInput);
        parentDiv.appendChild(dataEntry);
    }

    const inputFields = [
        document.getElementById("DescriptionInput"),
        document.getElementById("CostInput"),
        document.getElementById("CategoryInput"),
        document.getElementById("TotalInput")
    ]
    let entryObject = {};

    for (let i = 0; i < 4; i++) {
        inputFields[i].addEventListener("keypress", (key) => {
            if (key.key == "Enter") {
                entryObject[fieldArray[i]] = inputFields[i].value;
            }
        });
    }
    console.log(entryObject)
}