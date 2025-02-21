let riktigOrd = "";
let gjeldendeRad = 0;
let gjeldendeKol = 0;
let grid = document.getElementById("grid");

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

document.addEventListener("keydown", (e) => {
    let key = e.key.toUpperCase();
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
});

function sjekkOrd() {
    let ruter = document.querySelectorAll(".grid-item");
    let gjett = "";
    
    for (let i = 0; i < 5; i++) {
        gjett += ruter[gjeldendeRad * 5 + i].innerText;
    }
    
    if (gjett === riktigOrd) {
        document.getElementById("melding").innerText = "Gratulerer! Du vant!";
        for (let i = 0; i < 5; i++) {
            ruter[gjeldendeRad * 5 + i].classList.add("correct");
        }
        return;
    }
    
    for (let i = 0; i < 5; i++) {
        let bokstav = ruter[gjeldendeRad * 5 + i];
        if (gjett[i] === riktigOrd[i]) {
            bokstav.classList.add("correct");
        } else if (riktigOrd.includes(gjett[i])) {
            bokstav.classList.add("misplaced");
        } else {
            bokstav.classList.add("wrong");
        }
    }
    
    gjeldendeRad++;
    gjeldendeKol = 0;
    if (gjeldendeRad === 6) {
        document.getElementById("melding").innerText = "Du tapte! Ordet var " + riktigOrd;
    }
    
}

async function startSpill() {
    document.getElementById("melding").innerText = "";
    document.querySelectorAll(".grid-item").forEach(item => {
        item.innerText = "";
        item.className = "grid-item";
    });
    gjeldendeRad = 0;
    gjeldendeKol = 0;
    await hentOrd();
}


startSpill();