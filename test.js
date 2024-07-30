const { generateNewPuzzle, checkGuess, getHint, revealAnswer } = require('./lib/game');

async function runTest() {
  try {
    console.log("Generating new puzzle...");
    const puzzle = await generateNewPuzzle();
    console.log("Puzzle generated:", puzzle);

    console.log("Making a guess...");
    const guessResult = await checkGuess("blockchain");
    console.log("Guess result:", guessResult);

    console.log("Getting a hint...");
    const hint = await getHint();
    console.log("Hint:", hint);

    console.log("Revealing answer...");
    const answer = await revealAnswer();
    console.log("Answer:", answer);

    console.log("Test completed successfully!");
  } catch (error) {
    console.error("Test failed:", error);
  }
}

runTest();
