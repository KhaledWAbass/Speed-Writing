// Array of words for the game
const ArrWords = {
    "Easy": [
        "apple","banana","mango","cherry","date","fig","kiwi","grape","ugli",
        "cat","dog","hat","bat","book","pen","cup","bed","car","tree",
        "ball","door","shoe","glass","plate","leaf","fish","sun","moon","star","rain"
    ],
    "Normal": [
        "lemon","quince","papaya","orange","mulberry","lychee","jackfruit",
        "cantaloupe","apricot","watermelon","avocado","broccoli","carrot",
        "pepper","tomato","spinach","lettuce","onion","garlic","cucumber","zucchini"
    ],
    "Hard": [
        "elderberry","honeydew","raspberry","dragonfruit","strawberry","tangerine",
        "persimmon","pomegranate","starfruit","blackberry","cranberry","nectarine",
        "kumquat","cherimoya","longan","gooseberry","mirabelle","feijoa","grapefruit","plantain"
    ]
}
const discrptionArr = {
    "Easy": "Easy — short, common words (e.g., fruit names) with generous time per word; ideal for beginners to build speed and confidence.",
    "Normal": "Normal — medium-length everyday words with balanced time; a fair challenge for regular players to test accuracy and pace.",
    "Hard": "Hard — longer or less common words with limited time; designed for experienced players who want a real challenge."
};
const levels = {
    "Easy": 5,
    "Normal": 3,
    "Hard": 2
}
// Selectors
let startButton = document.querySelector(".Start");
let lvlNameSpan = document.querySelector(".MSG .lvl option:checked");
let secondsSpan = document.querySelector(".MSG .Seconds");
let theWord = document.querySelector(".the-word");
let upcomingWords = document.querySelector(".upcoming_words");
let input = document.querySelector(".input");
let timeLeftSpan = document.querySelector(".time .timeSpan");
let scoreGot = document.querySelector(".score .Got");
let scoreTotal = document.querySelector(".score .Total");
let finishMessage = document.querySelector(".finish");
let selectLevel = document.querySelector(".lvl");
let discEle = document.querySelector(".discrption")
let audioOne = document.querySelector(".one")
let audioTwo = document.querySelector(".two")
// Default level
let defaultLevelName = lvlNameSpan.innerHTML; // Default level
let defaultLevel = levels[defaultLevelName]; // Default level value
let disc = discrptionArr[defaultLevelName]
discEle.innerHTML = disc
let arr = ArrWords.Easy;
scoreTotal.innerHTML = ArrWords.Easy.length
// Change level
selectLevel.addEventListener("change",   function () { 
    let op = document.querySelector(".MSG .lvl option:checked");
    let selectedLevelName = op ? op.innerHTML : defaultLevelName;
    let selectedLevel = levels[selectedLevelName] || defaultLevel;
    secondsSpan.innerHTML = selectedLevel;
    timeLeftSpan.innerHTML = selectedLevel;
    // Optionally update defaultLevelName and defaultLevel if you want the new level to persist
    defaultLevelName = selectedLevelName;
    defaultLevel = selectedLevel;
    let disc = discrptionArr[defaultLevelName]
    discEle.innerHTML = disc
    scoreTotal.innerHTML = ArrWords[defaultLevelName].length;
    arr = ArrWords[defaultLevelName];
    return arr
})
// Change level name and seconds
secondsSpan.innerHTML = defaultLevel;
timeLeftSpan.innerHTML = defaultLevel ;
// events
// input.onpaste = function () {
//     return false;
// }
function random(arr) {
    let randomWord = arr[Math.floor(Math.random() * arr.length)];
    let index = arr.indexOf(randomWord)
    arr.splice(index, 1)
    theWord.innerHTML = randomWord
}
function genWords() {
    // random words
    random(arr)

    upcomingWords.innerHTML = "";
    // create charge of Array
    createElements(arr);
    // call start play function
    startPlay();
}
function createElements(arr) {
  arr.forEach(e => {
        let div = document.createElement("div")
        div.classList.add("word")
        div.textContent = e
        upcomingWords.appendChild(div)
    })
}

function startPlay() { 
    let start = setInterval(() => {
        timeLeftSpan.innerHTML--
        if (timeLeftSpan.innerHTML == "0") {
            clearInterval(start)
            if (theWord.innerHTML.toLowerCase() === input.value.toLowerCase()) {
                input.value = ""
                scoreGot.innerHTML++
                timeLeftSpan.innerHTML = defaultLevel 
                if (arr.length > 0) {
                genWords()
                } else {
                    let span = document.createElement("span")
                    let button = document.createElement("button")
                    button.classList.add("Start")
                    button.textContent = "Restart"
                    button.onclick = function () {
                        window.location.reload()
                    }
                span.classList.add("good")
                span.textContent = `Congratulations! You've completed the game.`
                    finishMessage.appendChild(span)
                    audioOne.play()
                finishMessage.appendChild(button)
                upcomingWords.innerHTML = ""
                theWord.innerHTML = ""
                    input.disabled = true
                    // save score to local storage
                    SaveToLocal(scoreGot)
                return;
                }
            } else {
            let span = document.createElement("span")
                    let button = document.createElement("button")
                    button.classList.add("Start")
                    button.textContent = "Restart"
                    button.onclick = function () {
                        window.location.reload()
                }
                audioTwo.play()
                span.classList.add("bad")
                span.textContent = "Game Over"
                finishMessage.appendChild(span)
                finishMessage.appendChild(button)
                upcomingWords.innerHTML = ""
                theWord.innerHTML = ""
                input.disabled = true
                return;
            }
        }
    }, 1000);

}
function SaveToLocal(param) { 
    let data = new Date()
    let save = {
        score: `${param.innerHTML}/${scoreTotal.innerHTML}`,
        day : `${data.getDate()}/${data.getMonth() + 1}/${data.getFullYear()}`,
        time : `${data.getHours()}:${data.getMinutes()}:${data.getSeconds()}`
    }
    window.localStorage.setItem("keys", JSON.stringify(save))
}
// start game
startButton.onclick = function () {
    this.remove();
    selectLevel.disabled = true
    input.focus();
    genWords();
}