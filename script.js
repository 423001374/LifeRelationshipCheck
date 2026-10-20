// State Management
let currentLang = localStorage.getItem("app_lang") || "tl";
let isDarkMode = localStorage.getItem("app_dark") === "true";
let isLargeFont = localStorage.getItem("app_font") === "true";

let selectedCatKey = null;
let currentStep = 0; // 0-19 Questions
let userScores = [];
let userTextAnswers = {};

// Translations UI
const UI = {
  tl: {
    badgeSelf: "Self-Assessment System",
    catHeader: "Ano ang gusto mong suriin ngayon?",
    catSub: "Pumili ng kategorya para malaman ang kalagayan ng iyong emosyon, relasyon, at personal na buhay.",
    badgeResult: "Resulta ng Pagsusuri",
    scoreLabel: "Score",
    summaryHeader: "📊 Analysis Breakdown",
    reflectionHeader: "📝 Ang Iyong Saloobin at Komento",
    solutionsHeader: "🌱 7-Day Personal Improvement Plan",
    disclaimerText: "📌 Paalala: Ang tool na ito ay para sa self-reflection lamang at hindi kapalit ng propesyonal na payo o counseling.",
    btnRetry: "Ulitin ang Quiz",
    btnChangeCat: "Pumili ng ibang Kategorya",
    btnNext: "Isumite at Magpatuloy ➔",
    historyTitle: "📜 Nakaraang Assessment History",
    btnClearHistory: "Burahin ang History",
    questionPrefix: "Tanong",
    questionOf: "ng",
    trueText: "Tama (True)",
    falseText: "Mali (False)",
    placeholderText: "Isulat ang iyong sagot o saloobin dito...",
    labels: { healthy: "Healthy", slight: "Slight Issue", selos: "Unstable / Insecure", toxic: "Toxic / Critical" }
  },
  en: {
    badgeSelf: "Self-Assessment System",
    catHeader: "What would you like to assess today?",
    catSub: "Select a category to understand the state of your emotions, relationships, or personal life.",
    badgeResult: "Assessment Result",
    scoreLabel: "Score",
    summaryHeader: "📊 Analysis Breakdown",
    reflectionHeader: "📝 Your Reflections & Notes",
    solutionsHeader: "🌱 7-Day Personal Improvement Plan",
    disclaimerText: "📌 Note: This tool is designed for self-reflection only and is not a substitute for professional mental health advice.",
    btnRetry: "Retake Quiz",
    btnChangeCat: "Choose Another Category",
    btnNext: "Submit & Continue ➔",
    historyTitle: "📜 Previous Assessment History",
    btnClearHistory: "Clear History",
    questionPrefix: "Question",
    questionOf: "of",
    trueText: "True",
    falseText: "False",
    placeholderText: "Type your thoughts or answer here...",
    labels: { healthy: "Healthy", slight: "Slight Issue", selos: "Unstable / Insecure", toxic: "Toxic / Critical" }
  }
};

// 20 Questions per Category
const DATA = {
  tl: {
    relationship: {
      title: "Relationship",
      icon: "❤️",
      desc: "Suriin ang tiwala, komunikasyon, at paggalang sa inyong magkapareha.",
      mcq: [
        { q: "1. Kapag may hindi pagkakaunawaan, ano ang ginagawa ninyo?", o: [["Nag-uusap nang kalmado.", 100], ["Medyo tensyado pero nagkakaayos.", 70], ["Nagseselos o naghihinala.", 50], ["Nagsisigawan o silent treatment.", 20]] },
        { q: "2. Ano ang nararamdaman mo kapag kasama ng partner mo ang mga kaibigan niya?", o: [["Masaya at may sarili ring buhay.", 100], ["Medyo naiwanan pero okay lang.", 70], ["Palaging nag-iisip kung sino ang kasama.", 50], ["Pinagbabawalan at kailangan ng update.", 20]] },
        { q: "3. May tiwala ba kayo sa phone at social media ng isa't isa?", o: [["Oo, walang kailangang i-check.", 100], ["Oo, pero minsan curious.", 70], ["Patagong tinitingnan ang messages.", 50], ["Chine-check ang phone at humihingi ng password.", 20]] },
        { q: "4. Paano ninyo ginagawa ang mga desisyon?", o: [["Pantay na nagkakasundo.", 100], ["Madalas pantay.", 70], ["Nagtatampo kapag di nasunod.", 50], ["Isang tao lang ang nagdedesisyon.", 20]] },
        { q: "5. Paano mo ipinapahayag ang nararamdaman mo?", o: [["Bukas at tapat.", 100], ["Nagtatago para maiwasan ang away.", 70], ["Nagbibigay ng pahiwatig.", 50], ["Natatakot magsalita.", 20]] },
        { q: "6. Paano inaayos ang mga pagkakamali?", o: [["Nag-a-apologize at inaayos.", 100], ["Nagkakaayos din agad.", 70], ["Naungkat ang lumang mali.", 50], ["Mani-manipula o sumbatan.", 20]] },
        { q: "7. Ano ang nararamdaman mo sa sarili mo sa relasyong ito?", o: [["Ligtas at pinahahalagahan.", 100], ["Maayos naman.", 70], ["Insecure at nakikipagkumpara.", 50], ["Maliit at natatakot.", 20]] },
        { q: "8. Paano itinuturing ang pamilya at kaibigan ng partner?", o: [["May respeto at warmth.", 100], ["Maayos naman.", 70], ["Nagseselos sa oras nila.", 50], ["Inilalayo sa isa't isa.", 20]] },
        { q: "9. Paano hinaharap ang oras na magkalayo kayo?", o: [["Komportable at may tiwala.", 100], ["Medyo naiinip.", 70], ["Nagaalala nang sobra.", 50], ["Nagalit kapag di nakasagot agad.", 20]] },
        { q: "10. Nakikita mo ba ang magandang hinaharap na magkasama?", o: [["Oo, sama-samang lumalago.", 100], ["Medyo, may kailangang ayusin.", 70], ["Natatakot na iwanan.", 50], ["Pakiramdam ko nakakulong ako.", 20]] }
      ],
      tf: [
        { q: "11. Pakiramdam ko ba ay naririnig at naiintindihan ako ng partner ko kapag nagsasalita ako?", tScore: 100, fScore: 30 },
        { q: "12. Madalas ba naming pag-awayan ang maliliit na bagay nang walang malinaw na solusyon?", tScore: 30, fScore: 100 },
        { q: "13. Ligtas ba akong maging tunay na sarili ko kapag kasama ko siya?", tScore: 100, fScore: 30 },
        { q: "14. May mga pagkakataon ba na nararamdaman kong kontrolado niya ang pera o kilos ko?", tScore: 20, fScore: 100 },
        { q: "15. Masaya ba ako sa kasalukuyang estado ng aming relasyon?", tScore: 100, fScore: 40 }
      ],
      reflections: [
        { id: "p1", q: "16. Reflection: Ano ang madalas na pinagmumulan ng away o hindi ninyo pagkakaunawaan?" },
        { id: "p2", q: "17. Reflection: Ano ang mga katangian o gawi ng partner mo na nakakapagdulot sa iyo ng stress o alinlangan?" },
        { id: "p3", q: "18. Reflection: Ano ang mga personal mong pagkukulang sa relasyon na gusto mong maiwasto?" },
        { id: "p4", q: "19. Reflection: Paano kayo huling nag-usap tungkol sa inyong pangarap o plano sa buhay?" },
        { id: "p5", q: "20. Improvement Plan: Isulat sa isang talata kung ano ang pangarap mong pagbabago sa inyong relasyon sa susunod na buwan." }
      ],
      tips: [
        "Day 1-2: Mag-practice ng '10-Minute Quiet Talk' kung saan walang hahawak ng phone habang nag-uusap.",
        "Day 3-4: Gumamit ng 'I feel...' statements sa halip na sumbatan ang partner.",
        "Day 5-6: Maglaan ng hiwalay na oras para sa sariling hobbies at mga kaibigan.",
        "Day 7: Magkasamang isulat ang 3 bagay na pinapasalamatan ninyo sa isa't isa."
      ]
    },
    self: {
      title: "Self-Care & Mental Health",
      icon: "🧠",
      desc: "Suriin ang iyong emotional well-being at trato sa iyong sarili.",
      mcq: [
        { q: "1. Kapag nagkakamali ka, ano ang natatanging reaction mo?", o: [["Tinatanggap at natututo.", 100], ["Nanghihinayang pero nakaka-move on.", 70], ["Iniisip na walang ginagawang tama.", 50], ["Sobrang galit sa sarili.", 20]] },
        { q: "2. Paano mo pinamamahalaan ang pahinga at stress?", o: [["Naglalaan ng sapat na oras.", 100], ["Minsan puyat sa trabaho.", 70], ["Nakakalimutan ang sarili.", 50], ["Nai-burnout sa tuloy-tuloy na isip.", 20]] },
        { q: "3. Gaano ka kadalas magkumpara sa social media?", o: [["Bihira lang.", 100], ["Napapatingin pero naaalala ang worth.", 70], ["Madalas at pakiramdam naiiwanan.", 50], ["Palaging naiinggit at nagagalit.", 20]] },
        { q: "4. Paano mo itinuturing ang iyong katawan?", o: [["Pinahahalagahan sa kain at tulog.", 100], ["Sinusubukan maging healthy.", 70], ["Hindi masaya sa hitsura.", 50], ["Pinarurusahan ang sarili sa gutom/pagod.", 20]] },
        { q: "5. Kapag malungkot ka, ano ang ginagawa mo?", o: [["Hinahayaang maramdaman at humihingi ng tulong.", 100], ["Nag-iisa muna.", 70], ["Iniiwasan sa distraction.", 50], ["Sinisisi ang sarili.", 20]] },
        { q: "6. Naglalaan ka ba ng oras sa hobbies?", o: [["Oo, regular na may time.", 100], ["Kapag may libreng oras lang.", 70], ["Nakakaramdam ng guilt kapag nagpapahinga.", 50], ["Hindi na kailanman.", 20]] },
        { q: "7. Ano ang nararamdaman mo kapag tumanggi (say 'No') sa iba?", o: [["Nakakatanggi nang walang guilt.", 100], ["Medyo naiilang pero kaya.", 70], ["Natatakot magalit sila.", 50], ["Di makatanggi kahit nasasaktan.", 20]] },
        { q: "8. Paano mo inilalarawan ang iyong inner voice?", o: [["Suportado at mabait.", 100], ["Neutral at patas.", 70], ["Madalas nagdududa.", 50], ["Laging nanlalait at nananakot.", 20]] },
        { q: "9. Paano ka humihingi ng tulong?", o: [["Tapat na nakikipag-usap.", 100], ["Naghihintay muna.", 70], ["Ayaw maging pabuhat.", 50], ["Hindi humihingi kailanman.", 20]] },
        { q: "10. Ano ang tingin mo sa iyong hinaharap?", o: [["May pag-asa at inspirasyon.", 100], ["Medyo nag-aalala pero kakayanin.", 70], ["Natatakot sa direksyon.", 50], ["Walang pag-asa.", 20]] }
      ],
      tf: [
        { q: "11. Nakakakuha ba ako ng 7-8 oras na maayos na tulog gabi-gabi?", tScore: 100, fScore: 40 },
        { q: "12. Pakiramdam ko ba ay wala akong kontrol sa takbo ng araw ko?", tScore: 30, fScore: 100 },
        { q: "13. Madalas ba akong makaramdam ng physical tension tulad ng pananakit ng ulo o leeg?", tScore: 30, fScore: 100 },
        { q: "14. May kahit isang tao ba sa buhay ko na nakakausap ko nang walang takot maging bukas?", tScore: 100, fScore: 30 },
        { q: "15. Bumabawi ba ako sa sarili ko kapag ramdam kong pagod na ako?", tScore: 100, fScore: 30 }
      ],
      reflections: [
        { id: "p1", q: "16. Reflection: Ano ang pinakamalaking nagdudulot sa iyo ng stress o pag-aalala ngayong linggo?" },
        { id: "p2", q: "17. Reflection: Ano ang mga negatibong gawi na gusto mong itigil para sa iyong mental health?" },
        { id: "p3", q: "18. Reflection: Kailan ang huling beses na naramdaman mong tunay kang masaya o payapa?" },
        { id: "p4", q: "19. Reflection: Paano mo inaalagaan ang iyong sarili kapag mabigat ang iyong emosyon?" },
        { id: "p5", q: "20. Improvement Plan: Isulat sa isang talata ang iyong personal pledge para sa iyong self-care ngayong buwan." }
      ],
      tips: [
        "Day 1-2: Magsimula ng 'Digital Detox' — huwag humawak ng phone 30 minuto bago matulog.",
        "Day 3-4: Maglaan ng 15-minutong paglalakad o stretching sa umaga.",
        "Day 5-6: Isulat sa papel ang 3 bagay na ipinagmamalaki mo sa iyong sarili.",
        "Day 7: Mag-practice ng 'No-Guilt Rest' kung saan magpapahinga nang walang iniisip na trabaho."
      ]
    }
  },
  en: {
    relationship: {
      title: "Relationship",
      icon: "❤️",
      desc: "Evaluate trust, communication, and mutual respect in your relationship.",
      mcq: [
        { q: "1. When you disagree, what usually happens?", o: [["We calmly talk it out.", 100], ["Tense, but we reconcile.", 70], ["Jealous or suspicious.", 50], ["Shouting or silent treatment.", 20]] },
        { q: "2. How do you feel when your partner hangs out with friends?", o: [["Happy and have my own life.", 100], ["A bit left out, but fine.", 70], ["Worry who they are with.", 50], ["Forbid them or demand updates.", 20]] },
        { q: "3. Do you trust each other with phones and social media?", o: [["Yes, no checking needed.", 100], ["Mostly, sometimes curious.", 70], ["Secretly check messages.", 50], ["Check phone and demand passwords.", 20]] },
        { q: "4. How do you make decisions together?", o: [["Discuss and compromise.", 100], ["Usually equal.", 70], ["Upset if not chosen.", 50], ["One person controls all.", 20]] },
        { q: "5. How do you communicate your feelings?", o: [["Openly and honestly.", 100], ["Hold back to avoid fights.", 70], ["Drop hints or test them.", 50], ["Afraid to speak up.", 20]] },
        { q: "6. How do you handle mistakes?", o: [["Apologize and fix together.", 100], ["Apologize eventually.", 70], ["Old mistakes brought up.", 50], ["Blame, insults, or revenge.", 20]] },
        { q: "7. How do you feel about yourself in this relationship?", o: [["Safe, valued, and free.", 100], ["Mostly good.", 70], ["Often insecure.", 50], ["Small, anxious, or afraid.", 20]] },
        { q: "8. How do you treat each other's family/friends?", o: [["With respect and warmth.", 100], ["Fine, minor awkwardness.", 70], ["Jealous of time spent.", 50], ["Try to isolate each other.", 20]] },
        { q: "9. How do you handle time apart?", o: [["Comfortable with total trust.", 100], ["Miss them, but fine.", 70], ["Anxious, need updates.", 50], ["Angry if reply is late.", 20]] },
        { q: "10. Do you see a good future together?", o: [["Yes, growing together.", 100], ["Maybe, needs work.", 70], ["Afraid they will leave.", 50], ["Trapped or stuck.", 20]] }
      ],
      tf: [
        { q: "11. Do you feel heard and understood by your partner when speaking?", tScore: 100, fScore: 30 },
        { q: "12. Do small disagreements constantly escalate into unresolved arguments?", tScore: 30, fScore: 100 },
        { q: "13. Do you feel completely safe to be your authentic self around them?", tScore: 100, fScore: 30 },
        { q: "14. Are there moments where you feel controlled financially or socially?", tScore: 20, fScore: 100 },
        { q: "15. Are you genuinely content with the current state of your relationship?", tScore: 100, fScore: 40 }
      ],
      reflections: [
        { id: "p1", q: "16. Reflection: What is the primary source of conflict or tension in your relationship?" },
        { id: "p2", q: "17. Reflection: What behaviors or habits from your partner cause you stress or doubt?" },
        { id: "p3", q: "18. Reflection: What personal traits or shortcomings would you like to improve?" },
        { id: "p4", q: "19. Reflection: How was your last conversation regarding shared future goals?" },
        { id: "p5", q: "20. Improvement Plan: Write a brief paragraph describing the ideal growth for your relationship this month." }
      ],
      tips: [
        "Day 1-2: Practice a '10-Minute Phone-Free' check-in every evening.",
        "Day 3-4: Shift from accusatory tone to 'I feel...' expressions during talks.",
        "Day 5-6: Dedicate time to independent interests and friends.",
        "Day 7: Exchange 3 specific appreciations with each other."
      ]
    },
    self: {
      title: "Self-Care & Mental Health",
      icon: "🧠",
      desc: "Assess your emotional well-being and how you treat yourself.",
      mcq: [
        { q: "1. When you make a mistake, how do you react?", o: [["Accept and learn.", 100], ["Disappointed, but move on.", 70], ["Feel useless.", 50], ["Extremely angry at self.", 20]] },
        { q: "2. How do you handle rest and stress?", o: [["Prioritize adequate rest.", 100], ["Work disrupts sleep sometimes.", 70], ["Forget self-care.", 50], ["Work until burnout.", 20]] },
        { q: "3. How often do you compare on social media?", o: [["Rarely.", 100], ["Occasionally, but remember worth.", 70], ["Frequently feel left behind.", 50], ["Deep envy and self-hate.", 20]] },
        { q: "4. How do you treat your body?", o: [["Nourish with food and sleep.", 100], ["Try to be healthy.", 70], ["Unhappy with looks.", 50], ["Punish with exhaustion.", 20]] },
        { q: "5. When feeling sad, what do you do?", o: [["Feel it and seek support.", 100], ["Isolate temporarily.", 70], ["Distract/suppress.", 50], ["Blame self internally.", 20]] },
        { q: "6. Do you make time for hobbies?", o: [["Regularly dedicated time.", 100], ["Only when free.", 70], ["Feel guilty resting.", 50], ["Never anymore.", 20]] },
        { q: "7. How do you feel saying 'No' to others?", o: [["Decline without guilt.", 100], ["Slightly uncomfortable.", 70], ["Fear making them angry.", 50], ["Unable to say no.", 20]] },
        { q: "8. How is your inner monologue?", o: [["Supportive and kind.", 100], ["Neutral and fair.", 70], ["Doubtful.", 50], ["Abusive and scary.", 20]] },
        { q: "9. How do you ask for help?", o: [["Reach out directly.", 100], ["Wait a bit first.", 70], ["Dread being a burden.", 50], ["Never ask.", 20]] },
        { q: "10. How do you view your future?", o: [["Hopeful and confident.", 100], ["Anxious, but managing.", 70], ["Fearful of path.", 50], ["Hopeless and trapped.", 20]] }
      ],
      tf: [
        { q: "11. Do you consistently get 7-8 hours of quality sleep daily?", tScore: 100, fScore: 40 },
        { q: "12. Do you feel completely out of control over your daily routine?", tScore: 30, fScore: 100 },
        { q: "13. Do you experience frequent physical symptoms of stress (e.g., tension headaches)?", tScore: 30, fScore: 100 },
        { q: "14. Is there at least one person you can be 100% open with?", tScore: 100, fScore: 30 },
        { q: "15. Do you allow yourself grace and recovery time when exhausted?", tScore: 100, fScore: 30 }
      ],
      reflections: [
        { id: "p1", q: "16. Reflection: What has been your primary source of emotional strain this week?" },
        { id: "p2", q: "17. Reflection: What negative habit would you like to eliminate for your mental wellness?" },
        { id: "p3", q: "18. Reflection: When was the last time you felt truly peaceful and content?" },
        { id: "p4", q: "19. Reflection: How do you comfort yourself when feeling overwhelmed?" },
        { id: "p5", q: "20. Improvement Plan: Write your personal self-care pledge for this upcoming month." }
      ],
      tips: [
        "Day 1-2: Initiate a digital detox—no screens 30 minutes before sleep.",
        "Day 3-4: Take a daily 15-minute mindful walk.",
        "Day 5-6: Write down 3 genuine self-appreciations.",
        "Day 7: Schedule a dedicated period of guilt-free relaxation."
      ]
    }
  }
};

// Controls & DOM Interactions
const DOM = {
  langSelect: document.getElementById("langSelect"),
  themeToggleBtn: document.getElementById("themeToggleBtn"),
  fontToggleBtn: document.getElementById("fontToggleBtn"),
  categoryScreen: document.getElementById("category-screen"),
  quizScreen: document.getElementById("quiz-screen"),
  resultScreen: document.getElementById("result-screen"),
  categoryGrid: document.getElementById("categoryGrid"),
  historyBox: document.getElementById("historyBox"),
  historyList: document.getElementById("historyList"),
  clearHistoryBtn: document.getElementById("clearHistoryBtn"),
  questionContainer: document.getElementById("questionContainer"),
  questionText: document.getElementById("questionText"),
  optionsContainer: document.getElementById("optionsContainer"),
  questionCount: document.getElementById("questionCount"),
  progressPercent: document.getElementById("progressPercent"),
  progressFill: document.getElementById("progressFill"),
  categoryTitleTag: document.getElementById("categoryTitleTag"),
  scoreText: document.getElementById("scoreText"),
  resultLabel: document.getElementById("resultLabel"),
  resultMsg: document.getElementById("resultMsg"),
  summaryText: document.getElementById("summaryText"),
  reflectionList: document.getElementById("reflectionList"),
  solutionsList: document.getElementById("solutionsList")
};

// Application Settings
function initSettings() {
  if (isDarkMode) document.body.classList.add("dark-mode");
  if (isLargeFont) document.body.classList.add("large-font");
  DOM.langSelect.value = currentLang;

  DOM.themeToggleBtn.onclick = () => {
    isDarkMode = !isDarkMode;
    document.body.classList.toggle("dark-mode", isDarkMode);
    localStorage.setItem("app_dark", isDarkMode);
  };

  DOM.fontToggleBtn.onclick = () => {
    isLargeFont = !isLargeFont;
    document.body.classList.toggle("large-font", isLargeFont);
    localStorage.setItem("app_font", isLargeFont);
  };

  DOM.langSelect.onchange = (e) => setLanguage(e.target.value);
  DOM.clearHistoryBtn.onclick = clearHistory;

  renderHistory();
  setLanguage(currentLang);
}

// Set Language & Translate Interface
function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem("app_lang", lang);

  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (UI[lang] && UI[lang][key]) {
      el.textContent = UI[lang][key];
    }
  });

  renderCategoryGrid();
}

// Categories
function renderCategoryGrid() {
  DOM.categoryGrid.innerHTML = "";
  const categories = DATA[currentLang];

  Object.keys(categories).forEach(key => {
    const cat = categories[key];
    const card = document.createElement("div");
    card.className = "cat-card";
    card.innerHTML = `
      <div class="cat-icon">${cat.icon}</div>
      <div class="cat-title">${cat.title}</div>
      <div class="cat-desc">${cat.desc}</div>
    `;
    card.onclick = () => startQuiz(key);
    DOM.categoryGrid.appendChild(card);
  });
}

// Start Quiz Session
function startQuiz(catKey) {
  selectedCatKey = catKey;
  currentStep = 0;
  userScores = [];
  userTextAnswers = {};

  DOM.categoryScreen.classList.add("hidden");
  DOM.quizScreen.classList.remove("hidden");
  DOM.resultScreen.classList.add("hidden");

  renderStep();
}

// Render Questions
function renderStep() {
  const catData = DATA[currentLang][selectedCatKey];
  const ui = UI[currentLang];
  const total = 20;

  DOM.categoryTitleTag.textContent = catData.title;
  DOM.questionCount.textContent = `${ui.questionPrefix} ${currentStep + 1} ${ui.questionOf} ${total}`;
  const pct = Math.round(((currentStep + 1) / total) * 100);
  DOM.progressPercent.textContent = `${pct}%`;
  DOM.progressFill.style.width = `${pct}%`;

  DOM.optionsContainer.innerHTML = "";

  // Multiple Choice
  if (currentStep < 10) {
    const qData = catData.mcq[currentStep];
    DOM.questionText.textContent = qData.q;
    qData.o.forEach(([text, score]) => {
      const btn = document.createElement("button");
      btn.className = "opt-btn";
      btn.textContent = text;
      btn.onclick = () => handleChoice(score);
      DOM.optionsContainer.appendChild(btn);
    });
  }
  // True or False 
  else if (currentStep < 15) {
    const qData = catData.tf[currentStep - 10];
    DOM.questionText.textContent = qData.q;

    const tBtn = document.createElement("button");
    tBtn.className = "opt-btn";
    tBtn.textContent = ui.trueText;
    tBtn.onclick = () => handleChoice(qData.tScore);

    const fBtn = document.createElement("button");
    fBtn.className = "opt-btn";
    fBtn.textContent = ui.falseText;
    fBtn.onclick = () => handleChoice(qData.fScore);

    DOM.optionsContainer.appendChild(tBtn);
    DOM.optionsContainer.appendChild(fBtn);
  }
  // Open Reflections & Paragraph
  else {
    const qData = catData.reflections[currentStep - 15];
    DOM.questionText.textContent = qData.q;

    const textarea = document.createElement("textarea");
    textarea.className = "textarea-input";
    textarea.placeholder = ui.placeholderText;
    textarea.value = userTextAnswers[qData.id] || "";

    const submitBtn = document.createElement("button");
    submitBtn.className = "btn btn-primary";
    submitBtn.textContent = ui.btnNext;
    submitBtn.onclick = () => {
      userTextAnswers[qData.id] = textarea.value.trim() || "(Walang nailagay na sagot)";
      nextStep();
    };

    DOM.optionsContainer.appendChild(textarea);
    DOM.optionsContainer.appendChild(submitBtn);
  }
}

function handleChoice(score) {
  userScores.push(score);
  nextStep();
}

function nextStep() {
  currentStep++;
  if (currentStep < 20) {
    renderStep();
  } else {
    showResults();
  }
}

// Display Results Page & Save to History
function showResults() {
  DOM.quizScreen.classList.add("hidden");
  DOM.resultScreen.classList.remove("hidden");

  const catData = DATA[currentLang][selectedCatKey];
  const ui = UI[currentLang];

  const totalScore = userScores.reduce((sum, s) => sum + s, 0);
  const avgScore = Math.round(totalScore / userScores.length);

  let key = "healthy";
  if (avgScore < 40) key = "toxic";
  else if (avgScore < 65) key = "selos";
  else if (avgScore < 85) key = "slight";

  DOM.scoreText.textContent = `${avgScore}%`;
  DOM.resultLabel.textContent = ui.labels[key];

  const colorMap = { healthy: "var(--healthy)", slight: "var(--slight)", selos: "var(--selos)", toxic: "var(--toxic)" };
  DOM.scoreText.style.color = colorMap[key];
  DOM.resultLabel.style.color = colorMap[key];

  DOM.summaryText.innerHTML = `
    May kabuuang score ka na <b>${avgScore}%</b> sa kategoryang <b>${catData.title}</b>.
  `;

  // Reflections List
  DOM.reflectionList.innerHTML = "";
  Object.keys(userTextAnswers).forEach(id => {
    const p = document.createElement("p");
    p.innerHTML = `<b>${id.toUpperCase()}:</b> ${userTextAnswers[id]}`;
    DOM.reflectionList.appendChild(p);
  });

  // 7-Day Plan Tips
  DOM.solutionsList.innerHTML = "";
  catData.tips.forEach(tip => {
    const li = document.createElement("li");
    li.textContent = tip;
    DOM.solutionsList.appendChild(li);
  });

  saveHistory(catData.title, avgScore, ui.labels[key]);
}

// History
function saveHistory(catTitle, score, label) {
  let history = JSON.parse(localStorage.getItem("app_history") || "[]");
  const date = new Date().toLocaleDateString();
  history.unshift({ catTitle, score, label, date });
  if (history.length > 5) history.pop();
  localStorage.setItem("app_history", JSON.stringify(history));
  renderHistory();
}

function renderHistory() {
  let history = JSON.parse(localStorage.getItem("app_history") || "[]");
  if (history.length === 0) {
    DOM.historyBox.classList.add("hidden");
    return;
  }
  DOM.historyBox.classList.remove("hidden");
  DOM.historyList.innerHTML = "";
  history.forEach(item => {
    const li = document.createElement("li");
    li.innerHTML = `<span><b>${item.catTitle}</b> (${item.date})</span> <span>${item.score}% - ${item.label}</span>`;
    DOM.historyList.appendChild(li);
  });
}

function clearHistory() {
  localStorage.removeItem("app_history");
  renderHistory();
}

// Global Nav Bindings
document.getElementById("backBtn").onclick = () => {
  DOM.quizScreen.classList.add("hidden");
  DOM.categoryScreen.classList.remove("hidden");
};

document.getElementById("retryBtn").onclick = () => {
  if (selectedCatKey) startQuiz(selectedCatKey);
};

document.getElementById("changeCatBtn").onclick = () => {
  DOM.resultScreen.classList.add("hidden");
  DOM.categoryScreen.classList.remove("hidden");
};

initSettings();
