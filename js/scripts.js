import { randomItems, shuffle } from "./arrUtil.mjs";
import readQuestions from "./read.mjs";

const StartingMinutes = 4;
const StartingSeconds = StartingMinutes * 60;
const MaxQuestions = 10;

/**
 * 
 * @param {number} min 
 * @param {number} max 
 * @returns {number}
 */
function randomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function coolLog(thing) {
  console.log(JSON.stringify(thing))
}

function hide(selector) {
  document.querySelector(selector).style.display = "none";
}

function show(selector, display) {
  document.querySelector(selector).style.display = display;
}

function toggleResults() {
  hide(".resultsContainer");
  show(".endScreenContainer", "flex");
}

window.onload = async () => {
  const allQuestions = await readQuestions();
  const questionText = document.getElementById("question");
  const answerElements = Array.from(document.getElementsByClassName("answer-text"));
  let questionCountText = document.getElementById("counter");

  let scoreText = document.getElementById("scoreText");
  const restartBtn = document.getElementById("restart");
  const wrongOverlay = document.getElementById("wrongAnswer");
  wrongOverlay.style.visibility = "hidden";
  const wrongOverlay2 = document.getElementById("wrongAnswer2");
  wrongOverlay2.style.visibility = "hidden";
  const countDownText = document.getElementById("countdown");

  //shotglasses
  let shotglassImg1 = document.getElementById("shotglass1");
  let shotglassImg2 = document.getElementById("shotglass2");
  let shotglassImg3 = document.getElementById("shotglass3");

  //Lose Screen Image
  let loseImage = document.getElementById("lostScreenImage");

  function startScreen() {
    hide(".gameContainer");
    hide(".resultsContainer");
    hide(".instructions");
    //add to not have them while loading in the beginning
    hide(".instructions");

    show(".startScreenContainer", "flex");

    //zuerst der Screen dann play intro video und dann start Game

    //Buttons
    const startGameBtn = document.getElementById("startGameBtn");
    const showDescriptionBtn = document.getElementById("showDescriptionBtn");
    const backToStartScreenBtn = document.getElementById("backToStartScreenBtn");

    //add event listener to buttons
    startGameBtn.addEventListener("click", playStartVid);
    showDescriptionBtn.addEventListener("click", showInstructionsClick);
    backToStartScreenBtn.addEventListener("click", hideInstructionsClick);

    

    function showInstructionsClick() {
      show(".instructions", "flex");
    }

    function hideInstructionsClick() {
      hide(".instructions");
    }

  }

  function playStartVid() {
    hide(".startScreenContainer");
    show(".introVideoContainer", "flex");

    //ändere video at 

    //random number for Overlay
    const rndVideoInt = randomInteger(1, 2);
    let introVid = document.getElementById("introVid");

    if (rndVideoInt == 1) {
      introVid.src = "./img/Intro1.mp4";
    } else if (rndVideoInt == 2) {
      introVid.src = "./img/Intro2.mp4";
    }

    introVid.play();
    introVid.addEventListener('ended', videoEnd, false);

    function videoEnd(e) {
      startGame();
      introVid.webkitExitFullScreen();
    }
  }

  function startGame() {
    let score = 0;
    let answeredQuestionCount = 0;
    let remainingSeconds = StartingSeconds
    let timerReference = 0
    let isAcceptingAnswers = true;
    let s1full = true;
    let s2full = true;
    let s3full = true;
    let remainingQuestions = randomItems(allQuestions, MaxQuestions);
    //For the Results
    //let wrongAnsweredQuestions = randomItems(allQuestions, MaxQuestions);

    /**
     * @type {Question[]}
     */
    let wrongAnsweredQuestions = [];

    hide(".introVideoContainer");
    hide(".endScreenContainer");
    hide(".outroWinVideoContainer");
    hide(".winScreenContainer");

    /**
      * @param {number} value 
      */
    function setScore(value) {
      score = value;
      scoreText.innerHTML = score + "/10 Fragen korrekt";
    }

    function updateClock() {
      const minutes = Math.floor(remainingSeconds / 60);
      let seconds = remainingSeconds % 60;
      seconds = seconds < 10 ? '0' + seconds : seconds;
      countDownText.innerHTML = `${minutes}:${seconds}`;
    }

    function setRemainingSeconds(seconds) {
      remainingSeconds = Math.max(seconds, 0)
      updateClock()
    }

    function decreaseRemainingSeconds(seconds) {
      setRemainingSeconds(remainingSeconds - seconds)
    }

    function countDown() {
      decreaseRemainingSeconds(1)
      if (remainingSeconds === 0) {
        loseImage.src = "./img/Phone.gif";
        playLoseVid();
      } else {
        startOneSecondTimeout()
      }
    }

    function startOneSecondTimeout() {
      updateClock();
      timerReference = setTimeout(countDown, 1000)
    }

    function stopTimer() {
      clearTimeout(timerReference)
    }

    function setQuestionCount(value) {
      answeredQuestionCount = value;
      
      if (answeredQuestionCount > MaxQuestions){
        //show(".questionNewTry", "flex") 
        questionCountText.innerText = "2. Chance";
        questionCountText.style.color = "#f8719a";
      } else {
        questionCountText.innerText = `Frage ${answeredQuestionCount}/${MaxQuestions}`;
        questionCountText.style.color = "#bde7ed";
      }
    }

    function playLoseVid() {
      hide(".gameContainer");
      show(".outroVideoContainer", "flex");
      wrongOverlay.style.visibility = "hidden";
      wrongOverlay2.style.visibility = "hidden";
      let outroVid = document.getElementById("outroVidLose");
      outroVid.play();
      outroVid.addEventListener('ended', videoEnd, false);

      function videoEnd(e) {
        displayEndScreen();
        outroVid.webkitExitFullScreen();
      }

    }

    function playWinVid() {
      hide(".gameContainer");
      show(".outroWinVideoContainer", "flex");

      let outroVid = document.getElementById("outroVidWin");
      outroVid.play();
      outroVid.addEventListener('ended', videoEnd, false);

      function videoEnd(e) {
        displayWinScreen();
        outroVid.webkitExitFullScreen();
      }

    }

    function displayWinScreen() {
      stopTimer()
      hide(".outroWinVideoContainer");
      show(".winScreenContainer", "flex");
      isAcceptingAnswers = false;
      //Buttons
      const playAgainBtnWin = document.getElementById("playAgainButtonWin");
      playAgainBtnWin.addEventListener("click", playStartVid); 
    }

    function displayEndScreen() {
      wrongOverlay.style.visibility = "hidden";
      wrongOverlay2.style.visibility = "hidden";
      stopTimer()
      //hide(".gameContainer");
      hide(".outroVideoContainer");
      show(".endScreenContainer", "flex");
      isAcceptingAnswers = false;

      //Buttons
      const resultsBtn = document.getElementById("resultsButton");
      const playAgainBtn = document.getElementById("playAgainButton");

      //add event listener to buttons
      resultsBtn.addEventListener("click", displayResults);
      playAgainBtn.addEventListener("click", playStartVid);
    }

    function displayResults() {
      let resultIndex = 0;

      //Result Screen Buttons
      const backBtn = document.querySelector("#backButton");
      const nextResultBtn = document.getElementById("nextResultButton");
      const previousResultButton = document.getElementById("previousResultButton");

      const resultQuestionText = document.getElementById("result-question");
      const resultAnswerElements = Array.from(document.getElementsByClassName("result-answer-text"));

      hide(".endScreenContainer");
      show(".resultsContainer", "flex");

      //add event listener to back button
      backBtn.addEventListener("click", toggleResults);

      function incrementResultIndex() {
        //länge ist anzahl der tatsächlichen elemente/beginnt bei 1 und nicht bei 0
        if (resultIndex < wrongAnsweredQuestions.length - 1) {
          resultIndex++;
        }
        displayCurrentQuestion();
      }

      function decrementResultIndex() {
        if (resultIndex > 0) {
          resultIndex--;
        }
        displayCurrentQuestion();
      }

      function displayCurrentQuestion() {
        let currentResultQuestion = wrongAnsweredQuestions[resultIndex];
        resultQuestionText.innerText = currentResultQuestion.text;

        resultAnswerElements.forEach(function (element, index) {
          let currentResultAnswer = currentResultQuestion.answers[index]
          element.innerText = currentResultAnswer.text;

          if (currentResultAnswer.isCorrect) {
            element.parentElement.className = "correct"
          } else {
            element.parentElement.className = "incorrect"
          }
        })
      }

      nextResultBtn.addEventListener("click", incrementResultIndex);
      previousResultButton.addEventListener("click", decrementResultIndex);
      displayCurrentQuestion();
    }


  function displayNextQuestion() {
    if (remainingQuestions.length === 0) {
      playWinVid();
      return;
    }
    //löscht erste Frage aus dem Array und gibt sie in Variable
    const currentQuestion = remainingQuestions.shift();
    const currentAnswers = shuffle(currentQuestion.answers);

    function drinkShot() {
      wrongOverlay.style.visibility = "visible";
      if (s3full == true) {
        shotglassImg3.src = "./img/IconShotglass_empty.png";
        s3full = false;
      } else if (s2full == true) {
        shotglassImg2.src = "./img/IconShotglass_empty.png";
        s2full = false;
      } else if (s1full == true) {
        shotglassImg1.src = "./img/IconShotglass_empty.png";
        s1full = false;
        //displayResults();
        playLoseVid();
        //ändere BIld zu betrunken
        loseImage.src = "./img/ShotglassGif.gif";
      }
    }

    function callMum() {
      //phone overlay
      wrongOverlay2.style.visibility = "visible";
      decreaseRemainingSeconds(10)
    }

    function displayWrongAnswer() {

      //random number for Overlay
      const rndInt = randomInteger(1, 3);

      if (rndInt == 1) {
        drinkShot();
      } else if (rndInt == 2) {
        callMum();
      }
    }
    /**
     * 
     * @param {HTMLElement} element 
     * @param {Answer} answer 
     */
    function giveAnswer(element, answer) {
      isAcceptingAnswers = false;
      let classToApply = "incorrect";
      let classToApplyText = "selectedElementText";

      if (answer.isCorrect) {
        setScore(score + 1)
        classToApply = "correct";
        classToApplyText = "selectedElementText";
        //coolLog(wrongAnsweredQuestions);
        //wenn die frage im wrongAnswered array ist und ich sie richtig beantworte dann rauslöschen
        if(wrongAnsweredQuestions.indexOf(currentQuestion) > -1){
          //console.log("Frage ist schon im Array");
          wrongAnsweredQuestions = wrongAnsweredQuestions.filter(questions => questions.Question != currentQuestion);
        }
      } else {
        displayWrongAnswer();
        //push wrong question into array
        remainingQuestions.push(currentQuestion);
        //wrongAnsweredQuestions.push(currentQuestion);

        //nicht die gleiche Frage zwei Mal hinzufügen, falls zwei Mal falsch beantwortet
        //gibts trotzdem öfter rein!
        if(wrongAnsweredQuestions.indexOf(currentQuestion) === -1){
          wrongAnsweredQuestions.push(currentQuestion);
        }
        
        //coolLog(wrongAnsweredQuestions);
      }

      element.parentElement.classList.add(classToApply);
      element.classList.add(classToApplyText);

      setTimeout(() => {
        element.parentElement.classList.remove(classToApply);
        element.classList.remove(classToApplyText);
        displayNextQuestion();
        isAcceptingAnswers = true;
        wrongOverlay.style.visibility = "hidden";
        wrongOverlay2.style.visibility = "hidden";
      }, 2000);
    }

    setQuestionCount(answeredQuestionCount + 1);

    questionText.innerText = currentQuestion.text;

    answerElements.forEach((element, index) => {
      //speichert current answer an der stelle index in variable
      const answer = currentAnswers[index];
      //coolLog(answer);
      element.innerText = answer.text;
      element.onclick = function () {
        if (!isAcceptingAnswers) {
          return;
        }
        giveAnswer(element, answer);
      };
    });
  }

  show(".gameContainer", "flex");
  hide(".resultsContainer");

  displayNextQuestion();
  wrongOverlay.style.visibility = "hidden";
  countDownText.style.visibility = "visible";
  shotglassImg1.src = "./img/IconShotglass_full.png";
  shotglassImg2.src = "./img/IconShotglass_full.png";
  shotglassImg3.src = "./img/IconShotglass_full.png";

  startOneSecondTimeout() // Start timer first time

}
restartBtn.addEventListener("click", startGame);

//startGame();
startScreen();
}
