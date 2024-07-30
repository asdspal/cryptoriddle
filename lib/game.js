const { requestOAOWithRetry } = require("./oaoIntegration");

let currentWord = '';
let attempts = 0;

async function generateNewPuzzle() {
  const prompt = "Generate a random blockchain term, maximum 2 words.";
  currentWord = await requestOAOWithRetry(prompt, 11); // Using model ID 11 for text generation (llama)
  currentWord = currentWord.toLowerCase().trim();
  attempts = 0;

  const imagePrompt = `Generate an abstract image description for the blockchain term: ${currentWord}`;
  const imageDescription = await requestOAOWithRetry(imagePrompt, 11);
  
  // For now, we'll use a placeholder for the image URL
  const imageUrl = `https://placeholder.com/image/${encodeURIComponent(imageDescription)}`;
  
  return { imageUrl };
}

async function checkGuess(guess) {
  attempts++;
  guess = guess.toLowerCase().trim();
  let feedback = '';
  for (let i = 0; i < Math.max(guess.length, currentWord.length); i++) {
    if (guess[i] === currentWord[i]) {
      feedback += '🟩';
    } else if (currentWord.includes(guess[i])) {
      feedback += '🟨';
    } else {
      feedback += '⬜';
    }
  }
  
  // Generate feedback image
  const feedbackImage = `https://placeholder.com/image/${encodeURIComponent(feedback)}`;
  
  return { feedbackImage, correct: guess === currentWord };
}

async function getHint() {
  const prompt = `Generate a hint for the blockchain term: ${currentWord}. The hint should not directly reveal the term.`;
  const hint = await requestOAOWithRetry(prompt, 11);
  
  // Generate hint image
  const imageUrl = `https://placeholder.com/image/${encodeURIComponent(hint)}`;
  
  return { hint, imageUrl };
}

async function revealAnswer() {
  const prompt = `Explain the blockchain term '${currentWord}' in simple terms, suitable for beginners.`;
  const explanation = await requestOAOWithRetry(prompt, 11);
  
  // Generate explanation image
  const imageUrl = `https://placeholder.com/image/${encodeURIComponent(currentWord)}`;
  
  return { explanation, imageUrl };
}

module.exports = { generateNewPuzzle, checkGuess, getHint, revealAnswer };
