const API_URL = "http://localhost:5000/api/upload";

document.getElementById("uploadForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  
  const formData = new FormData();
  const file = document.getElementById("fileInput").files[0];
  formData.append("file", file);

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    console.log("Server Response:", data);

    if (data.quiz) {
      renderQuiz(data.quiz);
    }
  } catch (err) {
    alert("❌ Error uploading file");
    console.error(err);
  }
});

function renderQuiz(quizText) {
  const quizSection = document.getElementById("quizSection");
  const quizArea = document.getElementById("quizArea");
  quizSection.style.display = "block";
  quizArea.innerHTML = "";

  // Split by questions (assumes GPT response has Q & options in plain text)
  const questions = quizText.split(/\d+\./).filter(Boolean);

  questions.forEach((q, index) => {
    const div = document.createElement("div");
    div.classList.add("question-box");

    const [question, ...options] = q.trim().split(/\n/);
    div.innerHTML = `<p><b>${index + 1}. ${question}</b></p>`;

    options.forEach((opt, i) => {
      if (opt.trim()) {
        const optionId = `q${index}_opt${i}`;
        div.innerHTML += `
          <label>
            <input type="radio" name="q${index}" value="${opt.trim()}" id="${optionId}">
            ${opt.trim()}
          </label><br>
        `;
      }
    });

    quizArea.appendChild(div);
  });

  document.getElementById("submitQuiz").onclick = () => checkAnswers(quizText);
}

function checkAnswers(quizText) {
  const quizResult = document.getElementById("quizResult");
  let score = 0;

  // Extract correct answers from GPT output (assumes "Answer: X" is included)
  const answers = quizText.match(/Answer: [A-D]/g) || [];

  answers.forEach((ans, index) => {
    const correct = ans.split(":")[1].trim();
    const selected = document.querySelector(`input[name="q${index}"]:checked`);
    if (selected && selected.value.startsWith(correct)) {
      score++;
    }
  });

  quizResult.innerHTML = `✅ You scored <b>${score}</b> out of <b>${answers.length}</b>`;
}
