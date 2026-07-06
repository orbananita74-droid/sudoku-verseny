const container = document.getElementById("puzzles");

let startTime = null;
let timerInterval = null;
let running = false;

// =====================
// VERSENY INDÍTÁS
// =====================
function startGame() {

    if (running) return;
    running = true;

    renderPuzzles();
    startTimer();

    // gomb elrejtése indulás után (ne lehessen újraindítani)
    document.querySelector(".top-buttons").style.display = "none";
}

// =====================
// IDŐMÉRŐ
// =====================
function startTimer() {

    startTime = Date.now();

    timerInterval = setInterval(() => {

        let diff = Date.now() - startTime;

        let sec = Math.floor(diff / 1000);
        let min = Math.floor(sec / 60);
        sec = sec % 60;

        document.getElementById("timer").innerText =
            `⏱ ${String(min).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;

    }, 1000);
}

// =====================
// PUZZLE KIRAJZOLÁS
// =====================
function renderPuzzles() {

    container.innerHTML = "";

    puzzles.forEach((p, i) => {

        const wrap = document.createElement("div");
        wrap.className = "puzzle-wrapper";

        const title = document.createElement("h3");
        title.innerText = "Feladat " + (i + 1);

        const table = document.createElement("table");

        for (let r = 0; r < 9; r++) {
            const row = document.createElement("tr");

            for (let c = 0; c < 9; c++) {

                const cell = document.createElement("td");
                const input = document.createElement("input");

                const val = puzzles[i].board[r][c];

                input.dataset.r = r;
                input.dataset.c = c;
                input.dataset.puzzle = i;

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

    if (!running) return;

    running = false;
    clearInterval(timerInterval);

    let endTime = Date.now();
    let gameTime = Math.floor((endTime - startTime) / 1000);

    let name = document.getElementById("name").value;
    let klass = document.getElementById("className").value;

    let inputs = container.querySelectorAll("input");

    let correct = 0;
    let total = 0;

    inputs.forEach(inp => {

        let r = inp.dataset.r;
        let c = inp.dataset.c;
        let p = inp.dataset.puzzle;

        let val = +inp.value || 0;

        total++;

        if (val === puzzles[p].solution[r][c]) {
            correct++;
        }
    });

    // minden eltüntetése
    container.innerHTML = "";
    document.querySelector(".section").style.display = "none";
    document.querySelector(".bottom-buttons").style.display = "none";

    document.getElementById("result").innerText =
        "Köszönjük a beküldést!";

    // mentés Firebase-be
    db.collection("results").add({
        name,
        class: klass,
        score: correct,
        total,
        gameTime,
        time: new Date().toLocaleString()
    });
}
