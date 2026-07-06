console.log("script loaded");

// --- DOM ---
const container = document.getElementById("puzzles");

// --- SAFETY Puzzles ---
const puzzles = window.puzzles || [];

console.log("puzzles:", puzzles);

// --- LEADERBOARD (nem tör semmit) ---
function loadLeaderboard() {
    console.log("Leaderboard placeholder");
}

// --- PUZZLE KIRAJZOLÁS ---
function createPuzzle(index) {
    let table = document.createElement("table");

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

    let title = document.createElement("h3");
    title.innerText = "Sudoku " + (index + 1);

    container.appendChild(title);
    container.appendChild(table);
}

// --- INDÍTÁS (NINCS LOAD EVENT!) ---
function start() {
    console.log("init running");

    if (!container) {
        console.error("Nincs #puzzles div!");
        return;
    }

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
    let klass = document.getElementById("className").value;

    let total = 0;
    let correct = 0;

    puzzles.forEach((puzzle, index) => {
        let table = container.querySelectorAll("table")[index];
        let inputs = table.querySelectorAll("input");

        inputs.forEach(inp => {
            let r = +inp.dataset.row;
            let c = +inp.dataset.col;
            let val = +inp.value || 0;

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

    // Firebase mentés (biztonságos)
    try {
        if (window.db) {
            db.collection("results").add({
                name: name,
                class: klass,
                score: correct,
                time: new Date().toLocaleString()
            });
        }
    } catch (e) {
        console.log("Firebase hiba:", e);
    }

    loadLeaderboard();
}

// --- AZONNALI INDÍTÁS (EZ A LÉNYEG) ---
start();
