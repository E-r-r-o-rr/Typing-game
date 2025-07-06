const RANDOME_QUOTE_API_URL = 'http://api.quotable.io/random' // Api link

// Element IDS
const quoteDisplayElement = document.getElementById('quoteDisplay')
const quoteInputElement = document.getElementById('quoteInput')
const timerElement = document.getElementById('timer')
const modalElement = document.getElementById('timesUpModal')

// Global Variables
let timerStarted = false
const selectedTime = sessionStorage.getItem('selectedTime'); 
let quoteLength;  // global scope
let correctWordCount = 0; 
let remaining; 
let inputPaused = false;


// Navigate to games page and save selected option
document.querySelectorAll('.option').forEach(button => {
    button.addEventListener('click', () => {
        const selectedTime = button.dataset.time
        sessionStorage.setItem('selectedTime', selectedTime) // save what option was selected
        window.location.href = "/game.html"; 
    }); 
}); 

// Listen to input, start timer and compare against quote text
quoteInputElement.addEventListener('input', () => {

 if (inputPaused) return;

const arrayQuote = quoteDisplayElement.querySelectorAll ('span') 
const arrayValue = quoteInputElement.value.split('')  
 

if (timerStarted == false) { // If the timer hasn't started yet, start it
    startTimer(parseInt(selectedTime))
    timerStarted = true
} 

let correct = true


arrayQuote.forEach((characterSpan, index) => {
const character = arrayValue[index]
if (character== null) {
     characterSpan.classList.remove('correct')
      characterSpan.classList.remove('incorrect')
      correct = false
}
else if (character == characterSpan.innerText) {
    characterSpan.classList.add('correct')
    characterSpan.classList.remove('incorrect')
} else {
    characterSpan.classList.add('incorrect')
    characterSpan.classList.remove('correct')
    correct = false
}
})


if (correct) {
  
  correctWordCount += quoteLength
  inputPaused = true; 

  setTimeout (()=> {
    renderNewQuote(); 
    inputPaused = false;
  }, 100); 
} 

}) 


//api call to get a quote
function getRandomQuote () { 
    return fetch(RANDOME_QUOTE_API_URL)
     .then(response => response.json())
     .then(data => data.content) 
} 

// render the quote by splitting into characters and putting spans in between
async function renderNewQuote () {
    const quote = await getRandomQuote () 
    console.log(quote)
    quoteDisplayElement.innerHTML = ''
    quote.split('').forEach(character => {
        const characterSpan = document.createElement('span') // characterSpan is the creation of a span element and its inner text contains the relevant character split from the quote
        characterSpan.innerText = character
        quoteDisplayElement.appendChild(characterSpan)
    })

    const wordArray = quote.split(' '); 
    quoteLength = wordArray.length; // update quote word length
    quoteInputElement.value = null
    
}

//start timer 
let startTime
function startTimer(durationInSeconds) {

    timerElement.innerText = durationInSeconds
    startTime = new Date()

    const interval = setInterval(()=> {
        const elapsed = Math.floor((new Date() - startTime) / 1000); 
        remaining = durationInSeconds - elapsed; 
        timerElement.innerText = remaining; 

        if (remaining <= 0) {
            clearInterval(interval); 
            showTimesPopUp(); 
        }
    })

}

// get current timer time
function getTimerTime() {
    return Math.floor((new Date() - startTime) / 1000)
}

document.getElementById('restartBtn').addEventListener('click', () => {
        window.location.reload(); // Reloads current page
    })

document.getElementById('homeBtn').addEventListener('click', () => {
       window.location.href = "/index.html";
    })



//show final pop up screen
function showTimesPopUp () {

   
    const writtenWords =   quoteInputElement.value.split(' ')
    correctWordCount += writtenWords.length
    console.log(correctWordCount)

    calcluateWPM()

    modalElement.classList.remove('hidden'); 

    document.getElementById('retryButton').addEventListener('click', () => {
        window.location.reload(); // Reloads current page
    })

    document.getElementById('returnHome').addEventListener('click', () => {
       window.location.href = "/index.html";
    })

}

// Calcualte the WPM
function calcluateWPM() {
    let calculatedWPM = 0;
    console.log(selectedTime)

    const timeInMins = parseInt(selectedTime)/60; 
    calculatedWPM = correctWordCount / timeInMins;
    

    document.getElementById('wpm-score').textContent = "WPM: " + calculatedWPM.toFixed(2);
}


function sumAsync(x, y) {
    console.log("1. sumAsync is executed");
    const p = new Promise((resolve, reject) => {
        // run this in 500ms from now
        setTimeout(() => {
            console.log("4. Resolving sumAsync's Promise with the result after 500ms");
            resolve(x + y);
        }, 5000);

        // we don't need to return anything
        console.log("2. sumAsync Promise is initialized");            
    });
    console.log("3. sumAsync has returned the Promise");
    return p;
}

// let's use the function now
sumAsync(5, 7).then((result) => {
    console.log("5. The result of the addition is:", result);
});

renderNewQuote()