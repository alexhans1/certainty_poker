import React, { useState } from "react";
import Drawer from "@material-ui/core/Drawer";
import { Game, Player, QuestionRound } from "../../../interfaces";
import { AddGuess, addGuess, isPlayerDead } from "../helpers";

import "./styles.scss";

interface QuestionProps {
  game: Game;
  currentQuestionRound: QuestionRound;
  playerId: Player["id"];
  addGuessMutation: AddGuess;
}

export default ({
  currentQuestionRound,
  playerId,
  addGuessMutation,
  game,
}: QuestionProps) => {
  const player = game.players.find((p) => p.id === playerId);
  const isDead = player && isPlayerDead(currentQuestionRound, player);
  if (isDead) {
    return null;
  }
  const [guess, setGuess] = useState(0);
  const canAddGuess = !currentQuestionRound.guesses.find(
    (guess) => guess.playerId === playerId
  );
  return (
    <Drawer
      anchor={"bottom"}
      open={canAddGuess}
      variant="persistent"
      className="drawer"
    >
      <div className="d-flex align-items-center flex-column">
        <span id="newQuestion">New Question</span>
        <div className="container px-5 pt-4 pb-5 d-flex flex-column">
          <p>{currentQuestionRound.question.question}</p>
          <div className="d-flex justify-content-center">
            <input
              value={guess}
              onChange={(e) => {
                setGuess(parseFloat(e.target.value) ?? 0);
              }}
              disabled={!canAddGuess}
              type="number"
              className="form-control form-control-lg"
              placeholder="Your answer"
              aria-label="Your answer"
              aria-describedby="basic-addon2"
            />

            <button
              type="submit"
              className="submitButton btn btn-primary"
              disabled={!canAddGuess}
              onClick={(e) => {
                addGuess(addGuessMutation, game, guess, playerId);
              }}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </Drawer>
  );
};
