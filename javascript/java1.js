const dictionary = async () => {
    let data = await fetch ('https://random-word-api.herokuapp.com/word?number=9000&length=5')
    let json = await data.json();
    console.log(json.length)
}

dictionary()

const getWord = async ()=> {
    let data = await fetch ('https://random-word-api.herokuapp.com/word?length=5')
    let json = await data.json()
    console.log(json)
}

getWord()

//under her begynner koden
let grid = document.getElementById('grid')
let riktigord = ''
let antallforsok = 0;
const maxforsok = 6
let aktivrute = 0 //holder styr på hvilken rute som er aktiv


for (let i = 0;i<30; i++){
    let item = document.createElement('input')
    item.className = 'grid-item'
    item.setAttribute('max-length', '1')
    item.setAttribute('data-index', i)
    item.addEventListener('input', (e) => flyttTilNeste (e, index))
    item.addEventListener('keydown', (e) => slettTilForrige (e, i))
    grid.appendChild(item)

}

const flyttTilNeste = (e, index) => {
    let verdi = e.target.value.toUpperCase();
    e.target.value = verdi;

    if (verdi.match(/[A-Z]/) && index % 5 !== 4) {
        document.querySelector(`[data-index'${index + 1}']`).focus()
    }

    if (index % 5 === 4){
        sjekkRad(index)
    }
}

const slettTilForrige = (e, index) => {
    if (e.key === "Backspace" && !e.target.value && index % 5 !== 0) {
        document.querySelector(`[data-index='${index - 1}']`).focus();
    }
};


const genererord = async () => {
    let data = await fetch ('https://random-word-api.herokuapp.com/word?length=5')
    let json = await data.json()
    riktigord = json[0].toUpperCase();
    console.log("Ordet å gjette er", riktigord) //bare for test, skal fjernes når spillet er ferdig
}

const startSpill = async () => {
    await genererord()
    antallforsok = 0;
    document.getElementById('melding').innerText = 'Skriv inn ditt ord'
    document.getElementById('brukerInnput').value
    document.querySelectorAll('.grid-item').forEach(item => {
        item.innerText=''
        item.className='grid-item'
    })
}

const skjekkOrd = (gjett) =>{
    let resultat = []
    let ordArray = riktigord.split('')

    for (let i = 0; i < 5; i++){
        if (gjett[i] === riktigord[i]){
            resultat.push('riktig')
            ordArray[i]=null
        } else if (ordArray.includes(gjett[i])) {
            resultat.push('feilplassert')
            ordArray[ordArray.indexOf(gjett[i])] = null
        } else {
            resultat.push('feil')
        }

    }


    const sjekkRad = (index) => {
        let start = index - 4;
        let gjett = "";
    
        for (let i = start; i <= index; i++) {
            gjett += document.querySelector(`[data-index='${i}']`).value.toUpperCase();
        }
    
        if (gjett.length !== 5) return;
    
        let resultat = skjekkOrd(gjett);
    
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
            document.getElementById('melding').innerText = "Gratulerer! Du vant!";
        } else if (antallforsok >= maxforsok) {
            document.getElementById('melding').innerText = `Du tapte! Ordet var ${riktigord}`;
        }
    };
    
}
const gjettOrd = () => {
    const gjett = document.getElementById('brukerInnput').value.toUpperCase()
    
    
}