const copyButtons = document.querySelectorAll(".copy-btn");

copyButtons.forEach(function (button) {
  button.addEventListener("click", async function () {
    const codeId = button.getAttribute("data-copy");
    const codeElement = document.getElementById(codeId);
    const codeText = codeElement.textContent;

    try {
      await navigator.clipboard.writeText(codeText);
      button.textContent = "Copied!";
    } catch (error) {
      const textArea = document.createElement("textarea");
      textArea.value = codeText;
      document.body.appendChild(textArea);
      textArea.select();

      const copied = document.execCommand("copy");
      textArea.remove();

      button.textContent = copied ? "Copied!" : "Select Code";
    }

    setTimeout(function () {
      button.textContent = "Copy Code";
    }, 1500);
  });
});

const questions = [
  {
    question: "What is a thread in Java?",
    options: [
      "A database",
      "A unit of execution within a process",
      "A Java package",
      "A CSS property",
    ],
    answer: 1,
    explanation: "Correct! A thread is a unit of execution within a process.",
  },
  {
    question: "Which method starts a new thread?",
    options: ["execute()", "run()", "start()", "begin()"],
    answer: 2,
    explanation: "Correct! start() initiates a new thread of execution.",
  },
  {
    question: "Which interface is commonly used to represent a task?",
    options: ["Runnable", "Serializable", "Comparable", "Cloneable"],
    answer: 0,
    explanation:
      "Correct! Runnable represents a task that can be executed by a thread.",
  },
  {
    question: "What does Thread.sleep() do?",
    options: [
      "Terminates the thread permanently",
      "Starts another process",
      "Pauses the current thread for a period",
      "Deletes the thread",
    ],
    answer: 2,
    explanation:
      "Correct! sleep() pauses the current thread for the specified duration, subject to scheduling.",
  },
  {
    question: "How many times can a Thread object be started?",
    options: ["Only once", "Twice", "Any number of times", "Zero times only"],
    answer: 0,
    explanation: "Correct! A Thread object can be started only once.",
  },
];

let currentQuestion = 0;
let score = 0;
let answered = false;

const questionElement = document.getElementById("question");
const optionsElement = document.getElementById("options");
const feedbackElement = document.getElementById("feedback");
const countElement = document.getElementById("quizCount");
const nextButton = document.getElementById("nextQuestion");

function displayQuestion() {
  const question = questions[currentQuestion];

  answered = false;
  questionElement.textContent = question.question;
  countElement.textContent =
    "QUESTION " +
    String(currentQuestion + 1).padStart(2, "0") +
    " / " +
    String(questions.length).padStart(2, "0");

  optionsElement.innerHTML = "";
  feedbackElement.textContent = "";
  nextButton.disabled = true;
  nextButton.textContent =
    currentQuestion === questions.length - 1
      ? "View Results →"
      : "Next Question →";

  question.options.forEach(function (option, index) {
    const button = document.createElement("button");

    button.className = "option-btn";
    button.textContent = option;

    button.addEventListener("click", function () {
      checkAnswer(index);
    });

    optionsElement.appendChild(button);
  });
}

function checkAnswer(selectedIndex) {
  if (answered) {
    return;
  }

  answered = true;

  const question = questions[currentQuestion];
  const optionButtons = optionsElement.querySelectorAll(".option-btn");

  optionButtons.forEach(function (button, index) {
    button.disabled = true;

    if (index === question.answer) {
      button.classList.add("correct");
    }
  });

  if (selectedIndex === question.answer) {
    score++;
    feedbackElement.textContent = question.explanation;
  } else {
    optionButtons[selectedIndex].classList.add("wrong");
    feedbackElement.textContent = "Not quite. " + question.explanation;
  }

  nextButton.disabled = false;
}

nextButton.addEventListener("click", function () {
  if (!answered) {
    return;
  }

  currentQuestion++;

  if (currentQuestion < questions.length) {
    displayQuestion();
  } else {
    showResults();
  }
});

function showResults() {
  countElement.textContent = "QUIZ COMPLETED";
  questionElement.textContent =
    "Your score: " + score + " / " + questions.length;

  optionsElement.innerHTML = "";

  const message = document.createElement("p");

  if (score === questions.length) {
    message.textContent = "Excellent! You understood the fundamentals.";
  } else if (score >= 3) {
    message.textContent = "Good job! Review the concepts you missed.";
  } else {
    message.textContent =
      "Keep practising. Revisit the examples and try again.";
  }

  optionsElement.appendChild(message);
  feedbackElement.textContent = "";
  nextButton.textContent = "Try Again ↻";
  nextButton.disabled = false;

  nextButton.onclick = function () {
    currentQuestion = 0;
    score = 0;

    nextButton.onclick = null;
    nextButton.addEventListener("click", function () {}, { once: true });

    displayQuestion();
  };
}

displayQuestion();
