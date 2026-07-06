console.log("Sudoku verseny ready");

const puzzles = window.puzzles || [];
const container = document.getElementById("puzzles");

let startTime = null;
let timerInterval = null;

// =====================
// TIMER
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
// VERSENY INDÍTÁS
// =====================
function startGame() {
    container.innerHTML = "";
    puzzles.forEach((p, i) => createPuzzle(i));
    startTimer();
}

// =====================
// PUZZLE
// =====================
function createPuzzle(index) {
    let table = document.createElement("table");

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
                input.style.color = "#333";
                input.style.background = "#eee";
            } else {
                input.style.color = "#1e66d0";
            }

            cell.appendChild(input);
            row.appendChild(cell);
        }

        table.appendChild(row);
    }

    container.appendChild(table);
}

// =====================
// BEKÜLDÉS
// =====================
function checkAll() {
    clearInterval(timerInterval);

    let name = document.getElementById("name").value;
    let klass = document.getElementById("className").value;

    let total = 0;
    let correct = 0;

    puzzles.forEach((p, i) => {
        let inputs = container.querySelectorAll("input");

        inputs.forEach(inp => {
            let r = inp.dataset.r;
            let c = inp.dataset.c;

            let val = +inp.value || 0;

            total++;
            if (val === p.solution[r][c]) correct++;
        });
    });

    container.innerHTML = "";
    document.getElementById("name").style.display = "none";
    document.getElementById("className").style.display = "none";

    document.querySelectorAll("button").forEach(b => b.style.display = "none");

    document.getElementById("result").innerText =
        "Köszönjük a beküldést!";

    saveResult(name, klass, correct, total);
    loadLeaderboard();
}

// =====================
// FIREBASE MENTÉS
// =====================
function saveResult(name, klass, score, total) {
    if (!window.db) return;

    db.collection("results").add({
        name,
        class: klass,
        score,
        total,
        time: new Date().toLocaleString()
    });
}

// =====================
// TOP10 RANGLISTA
// =====================
function loadLeaderboard() {
    db.collection("results")
        .orderBy("score", "desc")
        .limit(10)
        .get()
        .then(snapshot => {
            let html = "";

            snapshot.forEach(doc => {
                let d = doc.data();
                html += `<p>${d.name} (${d.class}) - ${d.score}/${d.total}</p>`;
            });

            document.getElementById("leaderboard").innerHTML = html;
        });
}

window.addEventListener("load", () => {
    loadLeaderboard();
});
