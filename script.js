function createPuzzle(index) {
    let table = document.createElement("table");
    table.dataset.index = index;

    for (let r = 0; r < 9; r++) {
        let row = document.createElement("tr");

        for (let c = 0; c < 9; c++) {
            let cell = document.createElement("td");

            let value = puzzles[index].board[r][c];

            let input = document.createElement("input");
            input.maxLength = 1;
            input.dataset.row = r;
            input.dataset.col = c;

            if (value !== 0) {
                input.value = value;
                input.disabled = true;
            }

            row.appendChild(cell);
            cell.appendChild(input);
        }

        table.appendChild(row);
    }

    container.appendChild(document.createElement("h3")).innerText =
        "Sudoku " + (index + 1);

    container.appendChild(table);
}
