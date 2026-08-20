(() => {
  "use strict";

  const quizData = window.NEXT_QUIZ;
  if (!quizData || !Array.isArray(quizData.questions)) {
    throw new Error("Quizdata kunne ikke indlæses.");
  }

  const questions = quizData.questions;
  const categories = quizData.categories;
  const categoryDescriptions = {
    Navn: "Latinske navne og muskelgrupper",
    Placering: "Udspring, hæfte og anatomi",
    Funktion: "Led, retning og bevægelse",
    Øvelser: "Praktisk træningsanvendelse"
  };

  const elements = {
    intro: document.querySelector("#intro-screen"),
    quiz: document.querySelector("#quiz-screen"),
    result: document.querySelector("#result-screen"),
    questionCounter: document.querySelector("#question-counter"),
    questionCategory: document.querySelector("#question-category"),
    progress: document.querySelector(".progress-track"),
    progressBar: document.querySelector("#progress-bar"),
    categoryList: document.querySelector("#category-list"),
    muscleName: document.querySelector("#muscle-name"),
    questionTitle: document.querySelector("#question-title"),
    answerList: document.querySelector("#answer-list"),
    questionAction: document.querySelector("#question-action"),
    selectionHint: document.querySelector("#selection-hint"),
    submit: document.querySelector("#submit-answer"),
    feedback: document.querySelector("#feedback-panel"),
    feedbackSymbol: document.querySelector("#feedback-symbol"),
    feedbackKicker: document.querySelector("#feedback-kicker"),
    feedbackTitle: document.querySelector("#feedback-title"),
    feedbackExplanation: document.querySelector("#feedback-explanation"),
    next: document.querySelector("#next-question"),
    resultTitle: document.querySelector("#result-title"),
    resultSummary: document.querySelector("#result-summary"),
    resultScore: document.querySelector("#result-score"),
    resultPercentage: document.querySelector("#result-percentage"),
    categoryBreakdown: document.querySelector("#category-breakdown"),
    answerReview: document.querySelector("#answer-review")
  };

  let order = [];
  let currentIndex = 0;
  let selectedIndex = null;
  let answered = false;
  let responses = {};

  const pad = (value) => String(value).padStart(2, "0");

  function shuffle(items) {
    const copy = [...items];
    for (let index = copy.length - 1; index > 0; index -= 1) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      [copy[index], copy[randomIndex]] = [copy[randomIndex], copy[index]];
    }
    return copy;
  }

  function showScreen(name) {
    elements.intro.hidden = name !== "intro";
    elements.quiz.hidden = name !== "quiz";
    elements.result.hidden = name !== "result";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function startQuiz() {
    order = shuffle(questions);
    currentIndex = 0;
    selectedIndex = null;
    answered = false;
    responses = {};
    showScreen("quiz");
    renderQuestion();
  }

  function goHome(event) {
    if (event) event.preventDefault();
    showScreen("intro");
  }

  function renderCategoryRail(activeCategory) {
    elements.categoryList.replaceChildren();

    categories.forEach((category) => {
      const item = document.createElement("li");
      const count = questions.filter((question) => question.category === category).length;
      item.classList.toggle("active", category === activeCategory);
      item.append(document.createTextNode(category));

      const countElement = document.createElement("span");
      countElement.textContent = pad(count);
      item.append(countElement);
      elements.categoryList.append(item);
    });
  }

  function renderQuestion() {
    const question = order[currentIndex];
    const questionNumber = currentIndex + 1;
    const progressPercentage = (questionNumber / order.length) * 100;

    selectedIndex = null;
    answered = false;

    elements.questionCounter.textContent = `Spørgsmål ${pad(questionNumber)} / ${pad(order.length)}`;
    elements.questionCategory.textContent = question.category;
    elements.progressBar.style.width = `${progressPercentage}%`;
    elements.progress.setAttribute("aria-valuenow", String(questionNumber));

    elements.muscleName.replaceChildren();
    const numberBadge = document.createElement("span");
    numberBadge.textContent = pad(questionNumber);
    elements.muscleName.append(numberBadge, document.createTextNode(question.muscle));
    elements.questionTitle.textContent = question.question;

    elements.answerList.replaceChildren();
    question.options.forEach((option, optionIndex) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "answer-option";
      button.setAttribute("role", "radio");
      button.setAttribute("aria-checked", "false");
      button.dataset.index = String(optionIndex);

      const letter = document.createElement("span");
      letter.className = "answer-letter";
      letter.textContent = String.fromCharCode(65 + optionIndex);

      const text = document.createElement("span");
      text.textContent = option;

      const state = document.createElement("span");
      state.className = "answer-state";
      state.setAttribute("aria-hidden", "true");

      button.append(letter, text, state);
      button.addEventListener("click", () => selectAnswer(optionIndex));
      elements.answerList.append(button);
    });

    elements.questionAction.hidden = false;
    elements.selectionHint.textContent = "Vælg en svarmulighed for at fortsætte.";
    elements.submit.disabled = true;
    elements.feedback.hidden = true;
    elements.feedback.className = "feedback-panel";

    renderCategoryRail(question.category);
    window.setTimeout(() => elements.questionTitle.focus(), 0);
  }

  function selectAnswer(optionIndex) {
    if (answered) return;

    selectedIndex = optionIndex;
    elements.submit.disabled = false;
    elements.selectionHint.textContent = `Svar ${String.fromCharCode(65 + optionIndex)} er valgt.`;

    elements.answerList.querySelectorAll(".answer-option").forEach((button, index) => {
      const isSelected = index === optionIndex;
      button.classList.toggle("selected", isSelected);
      button.setAttribute("aria-checked", String(isSelected));
    });
  }

  function submitAnswer() {
    if (selectedIndex === null || answered) return;

    const question = order[currentIndex];
    const isCorrect = selectedIndex === question.correct;
    answered = true;
    responses[question.id] = selectedIndex;

    elements.answerList.querySelectorAll(".answer-option").forEach((button, index) => {
      const state = button.querySelector(".answer-state");
      button.disabled = true;
      button.classList.remove("selected");

      if (index === question.correct) {
        button.classList.add("correct");
        state.textContent = "✓";
      } else if (index === selectedIndex) {
        button.classList.add("wrong");
        state.textContent = "×";
      }
    });

    elements.questionAction.hidden = true;
    elements.feedback.hidden = false;
    elements.feedback.classList.add(isCorrect ? "is-correct" : "is-wrong");
    elements.feedbackSymbol.textContent = isCorrect ? "✓" : "×";
    elements.feedbackKicker.textContent = isCorrect ? "Korrekt svar" : "Forkert svar";
    elements.feedbackTitle.textContent = isCorrect ? "Rigtigt!" : "Ikke helt";
    elements.feedbackExplanation.textContent = question.explanation;
    elements.next.innerHTML = currentIndex === order.length - 1
      ? "Se resultat <span aria-hidden=\"true\">→</span>"
      : "Næste spørgsmål <span aria-hidden=\"true\">→</span>";
  }

  function nextQuestion() {
    if (currentIndex === order.length - 1) {
      renderResult();
      return;
    }

    currentIndex += 1;
    renderQuestion();
  }

  function getEvaluation(score) {
    const percentage = Math.round((score / questions.length) * 100);

    if (percentage >= 90) {
      return {
        title: "Anatomi i topform",
        summary: "Du har sikkert styr på både musklernes navne, funktioner og de øvelser, der rammer dem. Brug facitoversigten til at finpudse de få detaljer, der mangler."
      };
    }

    if (percentage >= 73) {
      return {
        title: "Stærk anatomisk basis",
        summary: "Du er godt med. Gennemgå især de spørgsmål, du missede, så udspring, hæfte og funktion sidder helt fast før næste træningsanalyse."
      };
    }

    if (percentage >= 50) {
      return {
        title: "Godt på vej",
        summary: "Du genkender de vigtigste muskler, men nogle detaljer kræver en ekstra repetitionsrunde. Brug forklaringerne som digitale muskelkort."
      };
    }

    return {
      title: "Tid til en ny runde",
      summary: "Start med funktionerne og de store muskelgrupper, og arbejd derefter videre med udspring og hæfte. Gentag quizzen, når du har gennemgået facit."
    };
  }

  function renderResult() {
    const score = questions.filter((question) => responses[question.id] === question.correct).length;
    const percentage = Math.round((score / questions.length) * 100);
    const evaluation = getEvaluation(score);

    elements.resultTitle.textContent = evaluation.title;
    elements.resultSummary.textContent = evaluation.summary;
    elements.resultScore.textContent = pad(score);
    elements.resultPercentage.textContent = `${percentage}% rigtige`;

    elements.categoryBreakdown.replaceChildren();
    categories.forEach((category) => {
      const categoryQuestions = questions.filter((question) => question.category === category);
      const correctAnswers = categoryQuestions.filter(
        (question) => responses[question.id] === question.correct
      ).length;
      const categoryPercentage = Math.round((correctAnswers / categoryQuestions.length) * 100);

      const card = document.createElement("article");
      card.className = "category-card";
      card.innerHTML = `
        <header>
          <h3>${category}</h3>
          <strong>${correctAnswers}/${categoryQuestions.length}</strong>
        </header>
        <div class="category-track" aria-hidden="true"><span style="width:${categoryPercentage}%"></span></div>
        <p>${categoryDescriptions[category]}</p>
      `;
      elements.categoryBreakdown.append(card);
    });

    elements.answerReview.replaceChildren();
    questions.forEach((question, index) => {
      const chosen = responses[question.id];
      const isCorrect = chosen === question.correct;
      const details = document.createElement("details");

      const summary = document.createElement("summary");
      const status = document.createElement("span");
      status.className = `review-status ${isCorrect ? "correct" : "wrong"}`;
      status.textContent = isCorrect ? "✓" : "×";

      const title = document.createElement("span");
      title.className = "review-title";
      const muscle = document.createElement("small");
      muscle.textContent = question.muscle;
      const questionText = document.createElement("strong");
      questionText.textContent = `${pad(index + 1)}. ${question.question}`;
      title.append(muscle, questionText);

      const plus = document.createElement("span");
      plus.className = "review-plus";
      plus.textContent = "+";
      plus.setAttribute("aria-hidden", "true");

      summary.append(status, title, plus);

      const body = document.createElement("div");
      body.className = "review-body";

      if (!isCorrect) {
        const chosenAnswer = document.createElement("p");
        const chosenLabel = document.createElement("label");
        chosenLabel.textContent = "Dit svar";
        chosenAnswer.append(
          chosenLabel,
          document.createTextNode(chosen === undefined ? "Ikke besvaret" : question.options[chosen])
        );
        body.append(chosenAnswer);
      }

      const correctAnswer = document.createElement("p");
      const correctLabel = document.createElement("label");
      correctLabel.textContent = "Korrekt svar";
      correctAnswer.append(correctLabel, document.createTextNode(question.options[question.correct]));

      const explanation = document.createElement("p");
      explanation.className = "review-explanation";
      explanation.textContent = question.explanation;

      body.append(correctAnswer, explanation);
      details.append(summary, body);
      elements.answerReview.append(details);
    });

    showScreen("result");
  }

  document.querySelectorAll("[data-start]").forEach((button) => {
    button.addEventListener("click", startQuiz);
  });

  document.querySelectorAll("[data-home]").forEach((button) => {
    button.addEventListener("click", goHome);
  });

  elements.submit.addEventListener("click", submitAnswer);
  elements.next.addEventListener("click", nextQuestion);

  document.addEventListener("keydown", (event) => {
    if (elements.quiz.hidden || answered) return;

    const numericChoice = Number(event.key);
    if (numericChoice >= 1 && numericChoice <= 4) {
      selectAnswer(numericChoice - 1);
    } else if (event.key === "Enter" && selectedIndex !== null) {
      submitAnswer();
    }
  });
})();
