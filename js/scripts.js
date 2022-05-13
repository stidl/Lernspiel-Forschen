const question = document.getElementById("question");
const answers = Array.from(document.getElementsByClassName("answer-text"));
const questionCounterText = document.getElementById("counter");
const scoreText = document.getElementById("score");
const restart = document.getElementById("restart");

//disable score
//scoreText.style.visibility = "hidden";
scoreText.style.display = "none";

const wrongOverlay = document.getElementById("wrongAnswer")
wrongOverlay.style.visibility = "hidden";

const wrongOverlay2 = document.getElementById("wrongAnswer2")
wrongOverlay2.style.visibility = "hidden";

let questionCounter;
let score;
const MAX_QUESTIONS = 10;

//Timer
const startingMinutes = 1;
let time = startingMinutes * 60;
const countDownEl = document.getElementById("countdown");

//shotglasses
var shotglass1 = document.getElementById("shotglass1");
var shotglass2 = document.getElementById("shotglass2");
var shotglass3 = document.getElementById("shotglass3");
var s1full = true;
var s2full = true;
var s3full = true;
 
setInterval(updateContdown, 1000);

function updateContdown(){
  const minutes = Math.floor(time/60);
  let seconds = time % 60;
  seconds = seconds < 10 ? '0' + seconds : seconds;

  countDownEl.innerHTML = `${minutes}:${seconds}`;
  
  //timer function
  if (time > 0) {
    time--;
  } else if (time == 0){
    displayResults();
    time = -1;
  }
  //console.log(time);
}

//random overlay for wrong answer
function randomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

let acceptingAnswers;

function loadFromFile() {
  let xhr = new XMLHttpRequest();

  xhr.open("GET", "js.json", false);

  xhr.send();

  xhr.onload = function () {
    if (this.status == 200) {
      //console.log(this.response)
    } else {
      console.log("Oops something went wrong");
    }
  };

  return xhr.response;
}

let questions = JSON.parse(loadFromFile());

startGame = () => {
  questionCounter = 0;
  score = 0;
  acceptingAnswers = true;
  scoreText.innerText = score;
  availableQuestions = getRandomQuestions(questions, MAX_QUESTIONS);
  getNewQuestion();
  time = startingMinutes * 60
  wrongOverlay.style.visibility = "hidden";
  //inster full shotglasses
  s1full = true;
  s2full = true;
  s3full = true;
  shotglass1.src = "/img/IconShotglass_full.png";
  shotglass2.src = "/img/IconShotglass_full.png";
  shotglass3.src = "/img/IconShotglass_full.png";
};

const getRandomQuestions = (arr, n) => {
  let len = arr.length;
  if (n > len) {
    throw new RangeError(
      "getRandomQuestions: more elements taken than available"
    );
  }

  const shuffled = [...arr].sort(() => 0.5 - Math.random());

  return (selected = shuffled.slice(0, n));
};


const getNewQuestion = () => {
  if (availableQuestions.length === 0) {
    displayResults();
    return;
  }

  questionCounter++;
  questionCounterText.innerText = `${questionCounter}/${MAX_QUESTIONS}`;

  currentQuestion = availableQuestions[0];
  question.innerText = currentQuestion.question;

  answers.forEach((answer) => {
    answer.innerText = currentQuestion[answer.dataset["answer"]];
  });
  //TODO add randomization

  answers.forEach((answer) => {
    answer.addEventListener("click", (e) => {
      if (!acceptingAnswers) {
        return;
      }
      acceptingAnswers = false;
      const clickedAnswer = e.target;

      const anwseredLetter = clickedAnswer.dataset["answer"];
      
      let classToApply = "incorrect";
      

      if (anwseredLetter === currentQuestion.answer) {
        score++;
        scoreText.innerText = score;
        classToApply = "correct";
        //wrongOverlay.style.visibility = "visible";
      } else {

        //random number for Overlay
        const rndInt = randomInteger(1,2);
        console.log("Random Number: "+rndInt);
        
        
        if (rndInt == 2){
              if (s3full == true) {
                shotglass3.src = "/img/IconShotglass_empty.png";
                console.log("Shotglass 3 was full");
                s3full = false;
                wrongOverlay.style.visibility = "visible";
              } else if (s3full == false && s2full==true) {
                shotglass2.src = "/img/IconShotglass_empty.png";
                console.log("Shotglass 2 was full");
                s2full = false;
                wrongOverlay.style.visibility = "visible";
              } else if (s2full == false && s1full == true) {
                shotglass1.src = "/img/IconShotglass_empty.png";
                console.log("Shotglass 1 was full");
                s1full = false;
                time = -1;
                wrongOverlay.style.visibility = "visible";
                displayResults();
                return;
            }  else {
              console.log("All shotglasses are full");
            }
          } else {
            //phone overlay
          wrongOverlay2.style.visibility = "visible";
          time = time - 10;
          }

      }


      clickedAnswer.parentElement.classList.add(classToApply);

      setTimeout(() => {
        clickedAnswer.parentElement.classList.remove(classToApply);
        getNewQuestion();
        acceptingAnswers = true;
        wrongOverlay.style.visibility = "hidden";
        wrongOverlay2.style.visibility = "hidden";
      }, 2000);
    });
  });
  availableQuestions.shift();
};

displayResults = () => {
  const myModalEl = document.getElementById("myModal");
  const modal = new mdb.Modal(endGameModal);
  const modalBody = document.getElementById("modal-body");
  modalBody.innerText = `You scored: ${score}`;
  modal.show();
  acceptingAnswers = false;
};

restart.addEventListener("click", startGame);

startGame();
