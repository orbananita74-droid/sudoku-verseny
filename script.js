const container = document.getElementById("puzzles");

let startTime = 0;

// =====================
// INIT
// =====================
window.addEventListener("load", () => {
    renderPuzzles();
    startTime = Date.now();
});

// =====================
// PUZZLE RENDER
// =====================
function renderPuzzles() {
    container.innerHTML = "";

    puzzles.forEach((p, index) => {
        const wrap = document.createElement("div");
        wrap.className = "puzzle-wrapper";

        const title = document.createElement("div");
        title.innerText = "Feladat " + (index + 1);

        const table = document.createElement("table");

        for (let r = 0; r < 9; r++) {
            const row = document.createElement("tr");

            for (let c = 0; c < 9; c++) {
                const cell = document.createElement("td");
                const input = document.createElement("input");

                const val = puzzles[index].board[r][c];

                input.dataset.r = r;
                input.dataset.c = c;
                input.dataset.puzzle = index;

                if (val !== 0) {
                    input.value = val;
                    input.disabled = true;
                    input.style.background = "#eee";
                }

                cell.appendChild(input);
                row.appendChild(cell);
            }

            table.appendChild(row);
        }

        wrap.appendChild(title);
        wrap.appendChild(table);
        container.appendChild(wrap);
    });
}

// =====================
// BEKÜLDÉS
// =====================
function checkAll() {

    const endTime = Date.now();
    const gameTime = Math.floor((endTime - startTime) / 1000);

    let name = document.getElementById("name").value;
    let klass = document.getElementById("className").value;

    let correct = 0;
    let total = 0;

    const inputs = container.querySelectorAll("input");

    inputs.forEach(inp => {

        const r = inp.dataset.r;
        const c = inp.dataset.c;
        const pIndex = inp.dataset.puzzle;

        const val = Number(inp.value) || 0;

        total++;

        if (val === puzzles[pIndex].solution[r][c]) {
            correct++;
        }
    });

    container.innerHTML = "";
    document.querySelector(".section").style.display = "none";
    document.querySelector("button").style.display = "none";

    document.getElementById("result").innerText =
        "Köszönjük a beküldést!";

    db.collection("results").add({
        name,
        class: klass,
        score: correct,
        total,
        gameTime,
        time: new Date().toLocaleString()
    });
}
