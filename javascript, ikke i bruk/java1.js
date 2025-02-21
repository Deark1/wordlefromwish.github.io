let grid = document.getElementById('grid');
let riktigord = "";
let antallforsok = 0;
let gyldigeOrd = new Set();
let ordListeLastet = false;
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

// Hent ordliste
const hentOrdListe = async () => {
    try {
        let data = await fetch('https://random-word-api.herokuapp.com/word?number=8885&length=5');
        let json = await data.json();
        gyldigeOrd = new Set(json.map(word => word.toUpperCase()));
        ordListeLastet = true;
        console.log("✅ Ordlisten er lastet inn! Antall ord:", gyldigeOrd.size);
    } catch (error) {
        console.error("❌ Feil ved henting av ordliste:", error);
    }
};

// Start nytt spill
const startSpill = async () => {
    if (!ordListeLastet) {
        // Hvis ordlisten ikke er lastet, vent på at den skal lastes først
        setTimeout(startSpill, 100);
        return;
    }
    
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
    
    // Sjekk om ordet er gyldig
    if (!gyldigeOrd.has(gjett)) {
        document.getElementById('melding').innerText = "⚠️ Ikke et gyldig ord!";
        return; // Stopper videre sjekk
    }

    let resultat = sjekkOrd(gjett); // Fortsetter sjekken hvis ordet er gyldig

    for (let i = 0; i < 5; i++) {
        let rute = document.querySelector(`[data-index='${start + i}']`);

        // Fjerner gamle fargeklasser
        rute.classList.remove("correct", "misplaced", "wrong");

        // Legger til riktig fargeklasse basert på resultatet
        if (resultat[i] === 'riktig') {
            rute.classList.add("correct");  
        } else if (resultat[i] === 'feilplassert') {
            rute.classList.add("misplaced"); 
        } else {
            rute.classList.add("wrong");  
        }
    }

    antallforsok++;

    // Sjekker om brukeren har vunnet eller tapt
    if (gjett === riktigord) {
        document.getElementById('melding').innerText = "🎉 Gratulerer! Du vant!";
    } else if (antallforsok >= maxforsok) {
        document.getElementById('melding').innerText = `😢 Du tapte! Ordet var: ${riktigord}`;
    } else {
        // Setter fokus på første rute i neste rad
        let nesteStart = (antallforsok * 5);
        let nesteFokus = document.querySelector(`[data-index='${nesteStart}']`);
        if (nesteFokus) nesteFokus.focus();
    }
};

window.onload = async () => {
    await hentOrdListe();
    startSpill();  // Start spillet når ordlisten er ferdig lastet
};
