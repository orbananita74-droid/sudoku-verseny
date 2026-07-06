console.log("script loaded");

const container = document.getElementById("puzzles");
const puzzles = window.puzzles || [];

// --- LEADERBOARD (placeholder, hogy ne hibázzon) ---
function loadLeaderboard() {
    console.log("Leaderboard nincs még implementálva");
}

// --- SUDOKU LÉTREHOZÁS ---
function createPuzzle(index) {
    let table = document.createElement("table");
    table.dataset.index = index;

    for (let r = 0; r < 9; r++) {
        let row = document.createElement("tr");

        for (let c = 0; c < 9; c++) {
            let cell = document.createElement("td");

            let value = puzzles[index]?.board?.[r]?.[c] ?? 0;

            let input = document.createElement("input");
            input.maxLength = 1;
            input.dataset.row = r;
            input.dataset.col = c;

            if (value !== 0) {
                input.value = value;
                input.disabled = true;
            }

            cell.appendChild(input);
            row.appendChild(cell);
        }

        table.appendChild(row);
    }

    container.appendChild(document.createElement("h3")).innerText =
        "Sudoku " + (index + 1);

    container.appendChild(table);
}

// --- INIT ---
function init() {
    console.log("init running");

    container.innerHTML = "";

    if (!puzzles.length) {
        container.innerHTML = "<p>Nincs Sudoku betöltve</p>";
        return;
    }

    puzzles.forEach((p, i) => createPuzzle(i));

    loadLeaderboard();
}

// --- ELLENŐRZÉS ---
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

    // Firebase mentés (biztonságosan)
    if (window.db) {
        db.collection("results").add({
            name: name,
            class: klass,
            score: correct,
            time: new Date().toLocaleString()
        });
    }

    loadLeaderboard();
}

// --- INDÍTÁS ---
window.addEventListener("load", init);
