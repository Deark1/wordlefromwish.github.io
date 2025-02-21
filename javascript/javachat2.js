let riktigOrd = "";
let gjeldendeRad = 0;
let gjeldendeKol = 0;
let grid = document.getElementById("grid");
let gyldigeOrd = new Set();

async function hentOrdListe() {
    let data = await fetch('https://random-word-api.herokuapp.com/word?number=8885&length=5');
    let json = await data.json();
    gyldigeOrd = new Set(json.map(word => word.toUpperCase()));
}

async function hentOrd() {
    let data = await fetch('https://random-word-api.herokuapp.com/word?length=5');
    let json = await data.json();
    riktigOrd = json[0].toUpperCase();
    console.log("Ordet å gjette er:", riktigOrd);
}

for (let i = 0; i < 30; i++) {
    let item = document.createElement("div");
    item.className = "grid-item";
    item.setAttribute("data-index", i);
    grid.appendChild(item);
}

// Add event listener for keyboard clicks
document.querySelectorAll(".key").forEach(key => {
    key.addEventListener("click", () => {
        let keyText = key.innerText;
        handleKeyPress(keyText);
    });
});

document.addEventListener("keydown", (e) => {
    let key = e.key.toUpperCase();
    handleKeyPress(key);
});

function handleKeyPress(key) {
    let ruter = document.querySelectorAll(".grid-item");

    if (/^[A-Z]$/.test(key) && gjeldendeKol < 5) {
        ruter[gjeldendeRad * 5 + gjeldendeKol].innerText = key;
        gjeldendeKol++;
    } else if (key === "BACKSPACE" && gjeldendeKol > 0) {
        gjeldendeKol--;
        ruter[gjeldendeRad * 5 + gjeldendeKol].innerText = "";
    } else if (key === "ENTER" && gjeldendeKol === 5) {
        sjekkOrd();
    }
}

// Check guessed word
function sjekkOrd() {
    let ruter = document.querySelectorAll(".grid-item");
    let gjett = "";
    
    for (let i = 0; i < 5; i++) {
        gjett += ruter[gjeldendeRad * 5 + i].innerText;
    }

    // Reset message before checking
    document.getElementById("melding").innerText = "";

    if (!gyldigeOrd.has(gjett)) {
        document.getElementById("melding").innerText = "Ikke et gyldig ord, prøv igjen!";
        return;
    }

    if (gjett === riktigOrd) {
        document.getElementById("melding").innerText = "Gratulerer! Du vant!";
        for (let i = 0; i < 5; i++) {
            ruter[gjeldendeRad * 5 + i].classList.add("correct");
            updateKeyboard(gjett[i], "correct");
        }
        return;
    }

    for (let i = 0; i < 5; i++) {
        let bokstav = ruter[gjeldendeRad * 5 + i];
        if (gjett[i] === riktigOrd[i]) {
            bokstav.classList.add("correct");
            updateKeyboard(gjett[i], "correct");
        } else if (riktigOrd.includes(gjett[i])) {
            bokstav.classList.add("misplaced");
            updateKeyboard(gjett[i], "misplaced");
        } else {
            bokstav.classList.add("wrong");
            updateKeyboard(gjett[i], "wrong");
        }
    }

    gjeldendeRad++;
    gjeldendeKol = 0;
    if (gjeldendeRad === 6) {
        document.getElementById("melding").innerText = "Du tapte! Ordet var " + riktigOrd;
    }
}

// Update keyboard keys with colors based on the guess result
function updateKeyboard(letter, status) {
    // Loop through all the keys to find the matching one
    let keys = document.querySelectorAll(".key");
    keys.forEach(key => {
        if (key.innerText === letter) {
            if (status === "correct") {
                key.style.backgroundColor = "green";
            } else if (status === "misplaced") {
                key.style.backgroundColor = "yellow";
            } else {
                key.style.backgroundColor = "gray";
            }
        }
    });
}

async function startSpill() {
    document.getElementById("melding").innerText = "";
    document.querySelectorAll(".grid-item").forEach(item => {
        item.innerText = "";
        item.className = "grid-item";
    });
    gjeldendeRad = 0;
    gjeldendeKol = 0;
    await hentOrdListe();
    await hentOrd();
}

startSpill();
