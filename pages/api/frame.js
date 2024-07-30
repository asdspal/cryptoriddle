import { createFrames } from "frames.js/next";
import { generateNewPuzzle, checkGuess, getHint, revealAnswer } from "../../lib/game";

const frames = createFrames({
  basePath: "/api/frame",
});

const handler = frames(async (ctx) => {
  const { buttonIndex, inputText } = ctx;

  if (!buttonIndex || buttonIndex === 1) {
    // New game
    const puzzle = await generateNewPuzzle();
    return {
      image: puzzle.imageUrl,
      buttons: [
        { label: "Guess" },
        { label: "Hint" },
        { label: "Give Up" },
      ],
      input: { text: "Enter your guess" },
    };
  } else if (buttonIndex === 2) {
    // Check guess
    const result = await checkGuess(inputText);
    if (result.correct) {
      return {
        image: result.feedbackImage,
        buttons: [
          { label: "New Game" },
        ],
      };
    }
    return {
      image: result.feedbackImage,
      buttons: [
        { label: "Guess Again" },
        { label: "Hint" },
        { label: "Give Up" },
      ],
      input: { text: "Enter your guess" },
    };
  } else if (buttonIndex === 3) {
    // Provide hint
    const hint = await getHint();
    return {
      image: hint.imageUrl,
      buttons: [
        { label: "Guess" },
        { label: "Another Hint" },
        { label: "Give Up" },
      ],
      input: { text: "Enter your guess" },
    };
  } else {
    // Give up
    const answer = await revealAnswer();
    return {
      image: answer.imageUrl,
      buttons: [
        { label: "New Game" },
      ],
    };
  }
});

export const GET = handler;
export const POST = handler;
