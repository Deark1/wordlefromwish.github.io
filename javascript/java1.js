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

let riktigord = ''
let antallforsok = 0;
const maxforsok = 6


const genererord = async () => {
    let data = await fetch ('https://random-word-api.herokuapp.com/word?length=5')
    let json = await data.json()
    riktigord = json[0].toUpperCase();
    console.log("Ordet å gjette er", riktigord)
}

const startSpill = async () => {
    genererord()
    antallforsok++
    document.getElementById('melding').innerText
    document.getElementById('brukerInnput').value
    document.getElementById('spillbrett').innerHTML =''
}

const gjettOrd = () => {
    const gjett = document.getElementById('brukerInnput').value.toUpperCase()
    
}