let grid = document.getElementById('grid');
let riktigord = "";
let antallforsok = 0;
const maxforsok = 6;

// Generer rutenett
for (let i = 0; i < 30; i++) {
    let item = document.createElement('input');
    item.className = 'grid-item';
    item.setAttribute('maxlength', '1');
    item.setAttribute('data-index', i);
    item.addEventListener('input', (e) => flyttTilNeste(e, i));
    item.addEventListener('keydown', (e) => slettTilForrige(e, i));
    grid.appendChild(item);
}

// Hent ord fra API
const genererord = async () => {
    let data = await fetch('https://random-word-api.herokuapp.com/word?length=5');
    let json = await data.json();
    riktigord = json[0].toUpperCase();
    console.log("Ordet å gjette er:", riktigord); // Debugging
};

// Start nytt spill
const startSpill = async () => {
    await genererord();
    antallforsok = 0;
    document.getElementById('melding').innerText = 'Skriv inn ditt ord';
    
    document.querySelectorAll('.grid-item').forEach(item => {
        item.value = "";
        item.style.backgroundColor = 'white';
    });

    document.querySelector(`[data-index='0']`).focus(); // Sett fokus på første boks
};

// Flytt til neste inputboks automatisk
const flyttTilNeste = (e, index) => {
    let verdi = e.target.value.toUpperCase();
    e.target.value = verdi;

    if (verdi.match(/[A-Z]/) && index % 5 !== 4) {
        let neste = document.querySelector(`[data-index='${index + 1}']`);
        if (neste) neste.focus();
    }

    if (index % 5 === 4) {
        sjekkRad(index);
    }
};

// Slett og flytt tilbake med Backspace
const slettTilForrige = (e, index) => {
    if (e.key === "Backspace" && !e.target.value && index % 5 !== 0) {
        let forrige = document.querySelector(`[data-index='${index - 1}']`);
        if (forrige) forrige.focus();
    }
};

// Sjekk ordet og returner resultat
const sjekkOrd = (gjett) => {
    let resultat = Array(5).fill('feil'); // Standard er grå
    let ordArray = riktigord.split('');

    // Første sjekk: Finn riktige bokstaver
    for (let i = 0; i < 5; i++) {
        if (gjett[i] === riktigord[i]) {
            resultat[i] = 'riktig';
            ordArray[i] = null; // Fjern fra vurdering
        }
    }

    // Andre sjekk: Finn feilplasserte bokstaver
    for (let i = 0; i < 5; i++) {
        if (resultat[i] !== 'riktig' && ordArray.includes(gjett[i])) {
            resultat[i] = 'feilplassert';
            ordArray[ordArray.indexOf(gjett[i])] = null;
        }
    }

    return resultat;
};

// Sjekk raden når et ord er fylt ut
const sjekkRad = (index) => {
    let start = index - 4;
    let gjett = "";

    for (let i = start; i <= index; i++) {
        gjett += document.querySelector(`[data-index='${i}']`).value.toUpperCase();
    }

    if (gjett.length !== 5) return;

    let resultat = sjekkOrd(gjett);

    for (let i = 0; i < 5; i++) {
        let rute = document.querySelector(`[data-index='${start + i}']`);

        if (resultat[i] === 'riktig') {
            rute.style.backgroundColor = 'green';
        } else if (resultat[i] === 'feilplassert') {
            rute.style.backgroundColor = 'yellow';
        } else {
            rute.style.backgroundColor = 'gray';
        }
    }

    antallforsok++;

    if (gjett === riktigord) {
        document.getElementById('melding').innerText = "🎉 Gratulerer! Du vant!";
    } else if (antallforsok >= maxforsok) {
        document.getElementById('melding').innerText = `😢 Du tapte! Ordet var: ${riktigord}`;
    } else {
        let nesteStart = (antallforsok * 5);
        let nesteFokus = document.querySelector(`[data-index='${nesteStart}']`);
        if (nesteFokus) nesteFokus.focus();
    }
};

startSpill();