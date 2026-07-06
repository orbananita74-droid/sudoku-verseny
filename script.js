console.log("Sudoku verseny script loaded");

const puzzles = window.puzzles || [];
const container = document.getElementById("puzzles");

// --------------------
// PUZZLE KIRAJZOLÁS
// --------------------
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

    container.appendChild(document.createElement("h3")).innerText =
        "Sudoku " + (index + 1);

    container.appendChild(table);
}

// --------------------
// INDÍTÁS
// --------------------
function init() {
    container.innerHTML = "";
    puzzles.forEach((p, i) => createPuzzle(i));
}

init();

// --------------------
// BEKÜLDÉS (VERSENY MÓD - NINCS VISSZAJELZÉS)
// --------------------
function checkAll() {
    let name = document.getElementById("name")?.value || "";
    let klass = document.getElementById("className")?.value || "";

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
            }
        });
    });

    // --------------------
    // ELREJTJÜK A TELJES JÁTÉKOT
    // --------------------
    container.innerHTML = "";

    document.getElementById("result").innerText =
        "Köszönjük, hogy beküldted!";

    // ranglista elrejtése (ha van HTML-ben)
    let lb = document.getElementById("leaderboard");
    if (lb) lb.style.display = "none";

    // --------------------
    // MENTÉS FIREBASE-BE
    // --------------------
    try {
        if (window.db) {
            db.collection("results").add({
                name: name,
                class: klass,
                score: correct,
                total: total,
                time: new Date().toLocaleString()
            });
        }
    } catch (e) {
        console.log("Firebase hiba:", e);
    }
}
