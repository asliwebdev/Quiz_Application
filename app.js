const startBtn = document.querySelector(".start-btn");
const rulesBox = document.querySelector(".rules-box");
const continueBtn = document.querySelector(".continue");
const quizBox = document.querySelector(".quiz-box");
const next = document.querySelector(".next");
const questionDiv = document.querySelector(".question");
const choices = document.querySelector(".choices");
const choice = document.querySelectorAll(".choice");
const countQuestions = document.querySelector(".count-question");
const resultText = document.querySelector(".result-text");
const remainingSeconds = document.querySelector(".remaining-seconds");
const timeLeft = document.querySelector(".time-left");
const resultBox = document.querySelector(".result-box");
const nextBtn = document.querySelector("footer .next-btn button");
const replayQuiz = document.querySelector(".replay");
const timeLine = document.querySelector(".quiz-box header .time-line");
const quitBtn = document.querySelector(".result-box button.quit");
const exitBtn = document.querySelector(".exit-btn");
const widthOfQuizBox = document.querySelector(".quiz-box");

let remainingtime = 15;

let myInterval;

let choicesArray;

let correctAnswer;

let questionsArray;

let numberOfQuestion;

let counterline;

let width;
width = widthOfQuizBox.clientWidth

function format(value) {
    if(value < 10) {
        value = `0${value}`;
    }
    return value;
}

function intervalFunction(remainingtime) {
    startTimeLine(remainingtime);
    let value = remainingtime;
    remainingSeconds.innerHTML = value;
    timeLeft.innerHTML = "Time Left"
    myInterval = setInterval(() => {
        value--;
        remainingSeconds.innerHTML = format(value);

        if(value === 0) {
            clearInterval(myInterval);
            timeLeft.innerHTML = "Time Off";
            choicesArray.forEach(choice => {
              choice.classList.add("disabled");
            })
            
             if(numberOfQuestion < questionsArray.length) {
                console.log(correctAnswer);
                correctAnswer.classList.add("correct");
              }
              nextBtn.classList.remove("hideNext"); 
        }
        if(numberOfQuestion >= questionsArray.length) {
            clearInterval(myInterval);
        }
  }, 1000)
}

function startTimeLine(remainingtime) {
   let time;
   time = remainingtime; 
  counterline = setInterval(timer, 29);
  
  function timer() {
    if(width <= 300) {
        time += 0.55;
      } else if(width <= 380){
        time += 0.7;
      } else if(width <= 430) {
        time += 0.8;
      }
       else {
        time += 1;
      }

     timeLine.style.width = time + "px";
     if(time > width - 1) {
        clearInterval(counterline);
     }
  }
}


let counterOfCorrectAnswers = 0;

class Questions {
  async  getQuestions() {
    try {
        let result = await fetch("quizzes.json");
        let data = await result.json();
        let questions = data.questions;

         questions = questions.map(item => {
          let  {numb, question, answer, options} = item;
          return {numb, question, answer, options};
         })
         questionsArray = questions;
         return questions;
    } catch (error) {
        console.log(error);
    }
  }
}


class ChangeQuestions {
  updateQuestions(questions) {
    let j = 0;
    numberOfQuestion = j;
   
    this.putQuestion(questions, j);
    
    let clickableQuestions =  this.clickQuestions();
    this.chooseAnswer(clickableQuestions, questions, j);
    
   
    next.addEventListener("click", () => {
        j++;
       this.resetItems(questions, j);
       remainingtime = 15;
       intervalFunction(remainingtime);
    })
    
    replayQuiz.addEventListener("click", () => {
        resultBox.classList.remove("active");
        j = 0;
        this.putQuestion(questions, j);
        quizBox.classList.add("active");
        clearInterval(myInterval);
        clearInterval(counterline);
        counterOfCorrectAnswers = 0;
        this.resetItems(questions, j);
        remainingtime = 15;
        intervalFunction(remainingtime);
    })
   
    quitBtn.addEventListener("click", () => {
       resultBox.classList.remove("active");
    })
  }
  resetItems(questions, j) {
    this.handleLastClick(questions, j);
    let clickableQuestions = this.clickQuestions();
    this.chooseAnswer(clickableQuestions, questions, j);
    if(!nextBtn.classList.contains("hideNext")) {
        nextBtn.classList.add("hideNext");
    }
}
   putQuestion(questions, j) {
    questionDiv.innerHTML = `${questions[j].numb}. ${questions[j].question}`;
    let result = "";
    for(let i = 0; i < 4; i++) {
     result += `<div class="choice"><span>${questions[j].options[i]}</span><div class="icons"><i class="bi bi-check-circle"></i><i class="bi bi-x-circle"></i></div></div>`
    }
    choices.innerHTML = result;
    countQuestions.innerHTML = `${questions[j].numb} of ${questions.length} questions`
}
 handleLastClick(questions, j) {
    if(j < questions.length) {
            this.putQuestion(questions, j);
    } else {
            quizBox.classList.remove("active");
            resultBox.classList.add("active");
            if(counterOfCorrectAnswers > 8) {
                resultText.innerHTML = `and great! 🎉, You got ${counterOfCorrectAnswers} out of ${questions.length}`;
            } else if(counterOfCorrectAnswers > 5) {
                resultText.innerHTML = `and congrats! 😎, You got ${counterOfCorrectAnswers} out of ${questions.length}, You can improve even better!`;
            } else if(counterOfCorrectAnswers > 3) {
                resultText.innerHTML = `and not bad! 😉, You got ${counterOfCorrectAnswers} out of ${questions.length}, Keep Learning!`;
            }
             else {
                resultText.innerHTML = `and sorry 😐, You got only ${counterOfCorrectAnswers} out of ${questions.length}`;
            }
    }
}
clickQuestions() {
    let clickableQuestions = document.querySelectorAll(".choice");
    return clickableQuestions;
}

chooseAnswer(clickableQuestions, questions, j) { 
    clickableQuestions = [...clickableQuestions];
    choicesArray = clickableQuestions;
  if(j < questions.length) {
    correctAnswer = clickableQuestions.find(choice => choice.children[0].innerHTML === questions[j].answer);
  }

  clickableQuestions.forEach(choice => {
    choice.addEventListener("click", e => {
        let element = e.currentTarget;
        let firstChild = element.children[0];
        if(firstChild.innerHTML === questions[j].answer) {
            element.classList.add("correct");
            counterOfCorrectAnswers++;
            
        } else {
            element.classList.add("incorrect");
            correctAnswer.classList.add("correct"); 
        }
    
        nextBtn.classList.remove("hideNext");
       disabled();
       clearInterval(myInterval);
       clearInterval(counterline);
    })
    function disabled() {
        clickableQuestions.forEach(option => {
            option.classList.add("disabled");
        })
    }
  })
}
}


document.addEventListener("DOMContentLoaded", () => {
 const questions = new Questions();
 const changingQuestions = new ChangeQuestions();

 startBtn.addEventListener("click", () => {
    rulesBox.classList.add("active");
});

 questions.getQuestions().then(questions => {
    continueBtn.addEventListener("click", () => {
        rulesBox.classList.remove("active");
        quizBox.classList.add("active");
        remainingtime = 15;
        intervalFunction(remainingtime);
    })
    exitBtn.addEventListener("click", () => {
      rulesBox.classList.remove("active");
    })
     changingQuestions.updateQuestions(questions);
     
 })
})