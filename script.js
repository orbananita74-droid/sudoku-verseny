const container = document.getElementById("puzzles");

function createPuzzle(index) {
    let table = document.createElement("table");
    table.dataset.index = index;

    for (let r = 0; r < 9; r++) {
        let row = document.createElement("tr");

        for (let c = 0; c < 9; c++) {
            let cell = document.createElement("td");
            let input = document.createElement("input");
            input.maxLength = 1;
            input.dataset.row = r;
            input.dataset.col = c;
            row.appendChild(cell);
            cell.appendChild(input);
        }

        table.appendChild(row);
    }

    container.appendChild(document.createElement("h3")).innerText = "Sudoku " + (index + 1);
    container.appendChild(table);
}

puzzles.forEach((p, i) => createPuzzle(i));

function checkAll() {
    let name = document.getElementById("name").value;
    let klass = document.getElementById("class").value;

    let total = 0;
    let correct = 0;

    puzzles.forEach((puzzle, index) => {
        let table = container.querySelectorAll("table")[index];
        let inputs = table.querySelectorAll("input");

        inputs.forEach(inp => {
            let r = inp.dataset.row;
            let c = inp.dataset.col;

            let val = parseInt(inp.value);
            total++;

            if (val === puzzle.solution[r][c]) {
                correct++;
                inp.classList.add("correct");
                inp.classList.remove("wrong");
            } else {
                inp.classList.add("wrong");
                inp.classList.remove("correct");
            }
        });
    });

    let score = correct;

    document.getElementById("result").innerText =
        `Eredmény: ${correct}/${total}`;

    // FIREBASE MENTÉS
    db.collection("results").add({
        name: name,
        class: klass,
        score: score,
        time: new Date().toLocaleString()
    });
}
