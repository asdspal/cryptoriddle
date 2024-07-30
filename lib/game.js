import { requestOAO } from "./oaoIntegration";

let currentWord = '';
let attempts = 0;

export async function generateNewPuzzle() {
  const prompt = "Generate a random blockchain term, maximum 2 words.";
  currentWord = await requestOAO(prompt, 11); // Using model ID 11 for text generation (llama)
  currentWord = currentWord.toLowerCase().trim();
  attempts = 0;

  const imagePrompt = `Generate an abstract image description for the blockchain term: ${currentWord}`;
  const imageDescription = await requestOAO(imagePrompt, 11);
  
  // Generate actual image using Stable Diffusion
  const imageUrl = await requestOAO(imageDescription, 50); // Using model ID 50 for Stable Diffusion
  
  return { imageUrl };
}

export async function checkGuess(guess) {
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
  const feedbackImage = await requestOAO(`A visual representation of the guess feedback: ${feedback}`, 50);
  
  return { feedbackImage, correct: guess === currentWord };
}

export async function getHint() {
  const prompt = `Generate a hint for the blockchain term: ${currentWord}. The hint should not directly reveal the term.`;
  const hint = await requestOAO(prompt, 11);
  
  // Generate hint image
  const imageUrl = await requestOAO(`An abstract visual representation of the hint: ${hint}`, 50);
  
  return { hint, imageUrl };
}

export async function revealAnswer() {
  const prompt = `Explain the blockchain term '${currentWord}' in simple terms, suitable for beginners.`;
  const explanation = await requestOAO(prompt, 11);
  
  // Generate explanation image
  const imageUrl = await requestOAO(`A visual representation of the blockchain term: ${currentWord}`, 50);
  
  return { explanation, imageUrl };
}
