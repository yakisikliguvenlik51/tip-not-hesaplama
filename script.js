const weights = {
  1: [0.15, 0.15, 0.15, 0.15],
  2: [0.08, 0.10, 0.12, 0.12, 0.11, 0.07],
  3: [0.09, 0.10, 0.11, 0.11, 0.10, 0.09],
};

function updateKurulInputs() {
  const year = document.getElementById("year").value;
  const container = document.getElementById("kurul-inputs");
  container.innerHTML = "";
  const kurulCount = weights[year].length;
  for (let i = 1; i <= kurulCount; i++) {
    const input = document.createElement("input");
    input.type = "number";
    input.id = "kurul" + i;
    input.placeholder = `${i}. Kurul Notu`;
    input.min = 0;
    input.max = 100;
    container.appendChild(input);
  }
  document.getElementById("kurul-progress-container").innerHTML = "";
  document.getElementById("final-progress-container").innerHTML = "";
  document.getElementById("result").innerHTML = "";
}

updateKurulInputs();

function calculateFinalGrade() {
  const year = document.getElementById("year").value;
  const w = weights[year];
  const kurulScores = w.map((_, i) => parseFloat(document.getElementById("kurul" + (i + 1)).value) || 0);
  const finalExam = parseFloat(document.getElementById("final").value) || 0;
  const makeupExam = parseFloat(document.getElementById("makeup").value);

  const effectiveFinal = (!isNaN(makeupExam) && makeupExam > finalExam) ? makeupExam : finalExam;

  updateProgressBars(kurulScores, effectiveFinal);

  const kurulWeighted = kurulScores.reduce((sum, score, i) => sum + score * w[i], 0);
  const kurulAverage = kurulWeighted / 0.60;
  const finalGrade = (kurulAverage * 0.60) + (effectiveFinal * 0.40);

  const passMark = 60;
  const resultDiv = document.getElementById("result");

  resultDiv.innerHTML = "";
  const resultText = document.createElement("div");
  resultText.style.opacity = 0;
  resultText.innerHTML = `Kurul Ortalamanız: <b>${kurulAverage.toFixed(2)}</b><br>
  Genel Ortalama: <b>${finalGrade.toFixed(2)}</b><br>
  ${finalGrade >= passMark ? "<span class='pass'>✅ Tebrikler, geçtiniz!</span>" : "<span class='fail'>❌ Maalesef kaldınız.</span>"}`;
  resultDiv.appendChild(resultText);

  let opacity = 0;
  const fade = setInterval(() => {
    opacity += 0.05;
    if (opacity >= 1) {
      opacity = 1;
      clearInterval(fade);
    }
    resultText.style.opacity = opacity;
  }, 30);
}

function updateProgressBars(kurulScores, finalScore) {
  const kurulContainer = document.getElementById("kurul-progress-container");
  kurulContainer.innerHTML = "";
  kurulScores.forEach((score) => {
    const barContainer = document.createElement("div");
    barContainer.className = "progress-container";

    const bar = document.createElement("div");
    bar.className = "progress-bar";
    bar.style.width = score + "%";

    if (score >= 70) bar.style.backgroundColor = "#2e8b57";
    else if (score >= 60) bar.style.backgroundColor = "#f4a261";
    else bar.style.backgroundColor = "#e63946";

    bar.textContent = score;
    barContainer.appendChild(bar);
    kurulContainer.appendChild(barContainer);
  });

  const finalContainer = document.getElementById("final-progress-container");
  finalContainer.innerHTML = "";

  const finalBarContainer = document.createElement("div");
  finalBarContainer.className = "progress-container";

  const finalBar = document.createElement("div");
  finalBar.className = "progress-bar";
  finalBar.style.width = finalScore + "%";

  if (finalScore >= 70) finalBar.style.backgroundColor = "#2e8b57";
  else if (finalScore >= 60) finalBar.style.backgroundColor = "#f4a261";
  else finalBar.style.backgroundColor = "#e63946";

  finalBar.textContent = finalScore;
  finalBarContainer.appendChild(finalBar);
  finalContainer.appendChild(finalBarContainer);
}

function resetCalculator() {
  updateKurulInputs();
  document.getElementById("final").value = "";
  document.getElementById("makeup").value = "";
  document.getElementById("result").innerHTML = "";
}
