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
  currentWordEl.textContent = currentWord || "—";
  typedBuffer.textContent = buffer || " ";
  wordCountEl.textContent = totalWords.toString();
  streakEl.textContent = streak.toString();
  highlightCurrentWord();
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

  if (isLetter) {
    buffer += key;
    updateStatus();

    const currentWord = words[currentIndex] || "";
    if (normalize(buffer) === normalize(currentWord)) {
      handleWordComplete();
    }
  }
};

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
