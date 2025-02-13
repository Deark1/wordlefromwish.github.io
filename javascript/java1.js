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
    let item = document.createElement('div')
    item.className = 'grid-item'
    item.setAttribute('data-index', i)
    item.addEventListener('click', () => lagAktivRute(i)) //tryk på rute for å gjøre den aktiv
    grid.appendChild(item)

}

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
}
const gjettOrd = () => {
    const gjett = document.getElementById('brukerInnput').value.toUpperCase()
    
    
}