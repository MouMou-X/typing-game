const articles = [
  {
    title: "The Atlantic — On the Internet, Nobody Knows You're a Dog",
    text:
      "On the Internet, nobody knows you're a dog, but everyone knows you're curious. A curious mind wanders between pixels and ideas, spinning small universes from polite sentences and borrowed light.",
  },
  {
    title: "Scientific American — The Most Beautiful Experiment",
    text:
      "Science is a quiet choreography. Hypotheses bow, data pirouette, and the audience discovers that wonder can be measured yet never contained.",
  },
  {
    title: "The New Yorker — A Room With a View",
    text:
      "Stories are windows. We lean on the sill, inhale the weather, and let the world rearrange itself into meaning, word by word.",
  },
  {
    title: "Nature — The Poetry of the Cosmos",
    text:
      "The cosmos hums in wavelengths and whispers. Our instruments listen, but it is our language that translates the vast into a human heartbeat.",
  },
];

const encouragements = [
  "✨ Brilliant burst!",
  "🍬 Sweet strike!",
  "🌈 Macaron magic!",
  "💫 Luminous word!",
  "🌸 Soft glow!",
  "🎉 Velvet victory!",
];

const articleTitle = document.getElementById("article-title");
const articleText = document.getElementById("article-text");
const currentWordEl = document.getElementById("current-word");
const typedBuffer = document.getElementById("typed-buffer");
const reactionLayer = document.getElementById("reaction-layer");
const streakEl = document.getElementById("streak");
const wordCountEl = document.getElementById("word-count");
const shuffleButton = document.getElementById("shuffle");
const keyboardKeys = Array.from(document.querySelectorAll("[data-key]"));
const keyboardKeys = Array.from(document.querySelectorAll(".key"));

let words = [];
let currentIndex = 0;
let buffer = "";
let streak = 0;
let totalWords = 0;

const normalize = (value) => value.toLowerCase();

const buildWords = (article) => {
  articleTitle.textContent = article.title;
  articleText.innerHTML = "";
  words = article.text.split(/\s+/).filter(Boolean);
  words = article.text
    .replace(/[^\w\s'’]/g, "")
    .split(/\s+/)
    .filter(Boolean);

  words.forEach((word, index) => {
    const span = document.createElement("span");
    span.className = "word";
    if (index === 0) {
      span.classList.add("current");
    }
    span.textContent = word;
    articleText.appendChild(span);
  });

  currentIndex = 0;
  buffer = "";
  updateStatus();
};

const updateStatus = () => {
  const currentWord = words[currentIndex] || "";
  renderCurrentWord(currentWord, buffer);
  typedBuffer.textContent = buffer || " ";
  wordCountEl.textContent = totalWords.toString();
  streakEl.textContent = streak.toString();
  highlightCurrentWord();
};

const renderCurrentWord = (word, typed) => {
  currentWordEl.innerHTML = "";
  if (!word) {
    currentWordEl.textContent = "—";
    return;
  }

  const normalizedTyped = normalize(typed);
  word.split("").forEach((letter, index) => {
    const span = document.createElement("span");
    span.className = "letter";
    if (normalizedTyped[index] === normalize(letter)) {
      span.classList.add("matched");
    } else {
      span.classList.add("pending");
    }
    span.textContent = letter;
    currentWordEl.appendChild(span);
  });
};

const highlightCurrentWord = () => {
  const wordEls = Array.from(document.querySelectorAll(".word"));
  wordEls.forEach((wordEl, index) => {
    wordEl.classList.remove("current");
    if (index < currentIndex) {
      wordEl.classList.add("completed");
    }
    if (index === currentIndex) {
      wordEl.classList.add("current");
    }
  });
};

const showReaction = () => {
  const reaction = document.createElement("div");
  reaction.className = "reaction";
  reaction.textContent =
    encouragements[Math.floor(Math.random() * encouragements.length)];
  reaction.style.top = `${30 + Math.random() * 30}px`;
  reactionLayer.appendChild(reaction);
  for (let i = 0; i < 6; i += 1) {
    const sprinkle = document.createElement("span");
    sprinkle.className = "sprinkle";
    sprinkle.style.setProperty("--x", `${(Math.random() - 0.5) * 80}px`);
    sprinkle.style.setProperty("--y", `${(Math.random() - 0.5) * 60}px`);
    sprinkle.style.left = `${20 + Math.random() * 60}%`;
    sprinkle.style.top = `${10 + Math.random() * 40}%`;
    reaction.appendChild(sprinkle);
  }
  setTimeout(() => reaction.remove(), 1800);
};

const handleWordComplete = () => {
  totalWords += 1;
  streak += 1;
  showReaction();
  currentIndex += 1;
  buffer = "";
  updateStatus();

  if (currentIndex >= words.length) {
    streak = 0;
    buildWords(articles[Math.floor(Math.random() * articles.length)]);
  }
};

const handleKeydown = (event) => {
  const { key } = event;
  const isPrintable = key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey;
  const isSpace = key === " ";
  const isSubmit = isSpace || key === "Enter";

  if (!isPrintable && key !== "Backspace" && !isSubmit) {
    return;
  }

  const keyId = getKeyId(key);
  highlightKey(keyId);
  const isLetter = /^[a-zA-Z]$/.test(key);
  const isSpace = key === " " || key === "Spacebar";

  if (!isLetter && !isSpace && key !== "Backspace") {
    return;
  }

  const normalizedKey = key.toLowerCase();
  highlightKey(normalizedKey, isSpace);

  if (key === "Backspace") {
    buffer = buffer.slice(0, -1);
    updateStatus();
    return;
  }

  if (isSubmit) {
  if (isSpace) {
    const currentWord = words[currentIndex] || "";
    if (normalize(buffer) === normalize(currentWord)) {
      handleWordComplete();
    } else {
      streak = 0;
      buffer = "";
      updateStatus();
    }
    return;
  }

  if (isPrintable) {
  if (isLetter) {
    buffer += key;
    updateStatus();

    const currentWord = words[currentIndex] || "";
    if (normalize(buffer) === normalize(currentWord)) {
      handleWordComplete();
    }
  }
};

const getKeyId = (key) => {
  if (key === " ") {
    return "space";
  }
  if (key === "Backspace") {
    return "backspace";
  }
  if (key === "Enter") {
    return "enter";
  }
  return key.toLowerCase();
};

const highlightKey = (keyId) => {
  const match = keyboardKeys.find((keyEl) => keyEl.dataset.key === keyId);
const highlightKey = (key, isSpace) => {
  const match = keyboardKeys.find((keyEl) => {
    if (isSpace) {
      return keyEl.classList.contains("wide");
    }
    return keyEl.textContent === key;
  });

  if (!match) return;
  match.classList.add("active");
  setTimeout(() => match.classList.remove("active"), 120);
};

shuffleButton.addEventListener("click", () => {
  buildWords(articles[Math.floor(Math.random() * articles.length)]);
});

document.addEventListener("keydown", handleKeydown);

buildWords(articles[0]);
