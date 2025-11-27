let tableFunctionalityDiv = document.getElementById("table-div");

const trackButton = document.getElementById("track-button");

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
        if (!document.querySelector(".expense-table")) {
            let expenseTable = document.createElement("table");
            expenseTable.className = "expense-table";
            let headerRow = document.createElement("tr");
            const tableHeaders = ["Description", "$$", "Category", "Total"];
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


    });
}

function addRow(parentDiv) {
    let tableRow = document.createElement("tr");
    for (let i = 0; i < 4; i++){
        let dataEntry = document.createElement("td");
        let dataInput = document.createElement("input");
        dataEntry.appendChild(dataInput);
    }
}