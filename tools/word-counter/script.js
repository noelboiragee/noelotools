// এই ফাইলে লাইভ ওয়ার্ড কাউন্ট এবং টেক্সট পরিসংখ্যানের লজিক রাখা হয়েছে।
const textInput = document.querySelector("#text-input");
const clearButton = document.querySelector("#clear-button");
const textStatus = document.querySelector("#text-status");

const outputs = {
  words: document.querySelector("#word-count"),
  characters: document.querySelector("#character-count"),
  charactersNoSpaces: document.querySelector("#character-no-spaces-count"),
  sentences: document.querySelector("#sentence-count"),
  paragraphs: document.querySelector("#paragraph-count"),
  readingTime: document.querySelector("#reading-time")
};

const numberFormatter = new Intl.NumberFormat();

function countWords(text) {
  const matches = text.match(/[\p{L}\p{N}]+(?:['’\-][\p{L}\p{N}]+)*/gu);
  return matches ? matches.length : 0;
}

function countSentences(text) {
  const trimmed = text.trim();
  if (!trimmed) return 0;

  return trimmed
    .split(/[.!?…]+(?:[”’"')\]]*)\s*/u)
    .filter((sentence) => sentence.trim().length > 0)
    .length;
}

function countParagraphs(text) {
  const trimmed = text.trim();
  if (!trimmed) return 0;

  return trimmed
    .split(/\n\s*\n+/u)
    .filter((paragraph) => paragraph.trim().length > 0)
    .length;
}

function formatReadingTime(wordCount) {
  if (wordCount === 0) return "0 min";

  const totalSeconds = Math.ceil((wordCount / 200) * 60);
  if (totalSeconds < 60) return "<1 min";

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (seconds === 0) return `${minutes} min`;
  return `${minutes} min ${seconds} sec`;
}

function updateCounts() {
  const text = textInput.value;
  const words = countWords(text);
  const characters = Array.from(text).length;
  const charactersNoSpaces = Array.from(text.replace(/\s/gu, "")).length;
  const sentences = countSentences(text);
  const paragraphs = countParagraphs(text);

  outputs.words.textContent = numberFormatter.format(words);
  outputs.characters.textContent = numberFormatter.format(characters);
  outputs.charactersNoSpaces.textContent = numberFormatter.format(charactersNoSpaces);
  outputs.sentences.textContent = numberFormatter.format(sentences);
  outputs.paragraphs.textContent = numberFormatter.format(paragraphs);
  outputs.readingTime.textContent = formatReadingTime(words);

  textStatus.textContent = text.length === 0
    ? "Ready to count"
    : `${numberFormatter.format(characters)} characters entered`;
}

textInput.addEventListener("input", updateCounts);

clearButton.addEventListener("click", () => {
  textInput.value = "";
  updateCounts();
  textInput.focus();
});

updateCounts();