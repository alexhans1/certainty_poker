import React, { useState } from "react";
import { QuestionRound, Player, Game } from "../../../interfaces";
import { AddGuess, addGuess } from "../helpers";

interface QuestionProps {
  game: Game;
  currentQuestionRound: QuestionRound;
  playerId: Player["id"];
  addGuessMutation: AddGuess;
}

const styles = {
  submitButton: {
    borderRadius: 0,
  },
};

export default ({
  game,
  currentQuestionRound,
  playerId,
  addGuessMutation,
}: QuestionProps) => {
  const [guess, setGuess] = useState(0);
  const inputIsDisabled = !!currentQuestionRound.guesses.find(
    (guess) => guess.playerId === playerId
  );
  return (
    <>
      <p>Question:</p>
      <p>
        <b>{currentQuestionRound.question.question}</b>
      </p>
      <div className="input-group mb-3">
        <div className="input-group-append">
          <span className="input-group-text" id="basic-addon2">
            Answer
          </span>
        </div>
        <input
          value={guess}
          onChange={(e) => {
            setGuess(parseFloat(e.target.value) ?? 0);
          }}
          disabled={inputIsDisabled}
          type="number"
          className="form-control"
          placeholder="Your answer"
          aria-label="Your answer"
          aria-describedby="basic-addon2"
        />
        <button
          type="submit"
          className="btn btn-outline-secondary"
          style={styles.submitButton}
          disabled={inputIsDisabled}
          onClick={(e) => {
            addGuess(addGuessMutation, game, guess, playerId);
          }}
        >
          ↪
        </button>
      </div>
    </>
  );
};
