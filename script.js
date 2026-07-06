const container = document.getElementById("puzzles");

function createPuzzle(index) {
    let table = document.createElement("table");
    table.dataset.index = index;
    
let solution = puzzles[index].solution;

let board = solution.map(row =>
    row.map(val => (Math.random() < 0.5 ? val : 0))
);
    
    for (let r = 0; r < 9; r++) {
        let row = document.createElement("tr");

        for (let c = 0; c < 9; c++) {
            let cell = document.createElement("td");

let value = puzzles[index].board?.[r]?.[c] ?? "";

let input = document.createElement("input");
input.maxLength = 1;
input.dataset.row = r;
input.dataset.col = c;

if (value !== 0 && value !== undefined) {
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

function init() {
    container.innerHTML = "";

    puzzles.forEach((p, i) => createPuzzle(i));

    loadLeaderboard();
}

function checkAll() {
    let name = document.getElementById("name").value;
    let klass = document.getElementById("class").value;

    let total = 0;
    let correct = 0;

    puzzles.forEach((puzzle, index) => {
        let table = container.querySelectorAll("table")[index];
        let inputs = table.querySelectorAll("input");

        inputs.forEach(inp => {
            let r = parseInt(inp.dataset.row);
            let c = parseInt(inp.dataset.col);

            let val = parseInt(inp.value) || 0;
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

    document.getElementById("result").innerText =
        `Eredmény: ${correct}/${total}`;

    db.collection("results").add({
        name: name,
        class: klass,
        score: correct,
        time: new Date().toLocaleString()
    });

    loadLeaderboard();
}

window.addEventListener("load", init);
