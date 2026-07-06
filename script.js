const container = document.getElementById("puzzles");

let startTime = null;

// =====================
// TIMER INDULÁS
// =====================
function startGame() {
    startTime = Date.now();
}

// automatikus indulás
window.addEventListener("load", startGame);

// =====================
// PUZZLE LÉTREHOZÁS
// =====================
function createPuzzle(index) {
    const wrap = document.createElement("div");
    wrap.className = "puzzle-wrapper";

    const title = document.createElement("div");
    title.className = "puzzle-title";
    title.innerText = `Feladat ${index + 1}`;

    const table = document.createElement("table");

    for (let r = 0; r < 9; r++) {
        let row = document.createElement("tr");

        for (let c = 0; c < 9; c++) {
            let cell = document.createElement("td");

            let val = puzzles[index].board[r][c];

            let input = document.createElement("input");
            input.dataset.r = r;
            input.dataset.c = c;

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
}

// =====================
// INIT
// =====================
window.addEventListener("load", () => {
    container.innerHTML = "";
    puzzles.forEach((p, i) => createPuzzle(i));
});

// =====================
// BEKÜLDÉS
// =====================
function checkAll() {
    const endTime = Date.now();
    const gameTime = Math.floor((endTime - startTime) / 1000);

    let name = document.getElementById("name").value;
    let klass = document.getElementById("className").value;

    let total = 0;
    let correct = 0;

    puzzles.forEach((p, i) => {
        const inputs = container.querySelectorAll("input");

        inputs.forEach(inp => {
            let r = inp.dataset.r;
            let c = inp.dataset.c;

            let val = +inp.value || 0;

            total++;
            if (val === p.solution[r][c]) correct++;
        });
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
        time: new Date().toLocaleString(),
        gameTime: gameTime
    });
}

