import React, { useState } from "react";
import Drawer from "../../Drawer";
import { Game, Player, QuestionRound } from "../../../interfaces";
import { AddGuess, addGuess, isPlayerDead } from "../helpers";

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
  const [guess, setGuess] = useState<number | string>("");
  const canAddGuess = !currentQuestionRound.guesses.find(
    (guess) => guess.playerId === playerId
  );
  return (
    <Drawer
      title="New Question"
      isCollapseAble={true}
      shouldBeCollapsed={canAddGuess}
      anchor={"bottom"}
      open={canAddGuess}
      variant="persistent"
    >
      <>
        <p>{currentQuestionRound.question.question}</p>
        <div className="input-group mb-3">
          <input
            value={guess}
            onChange={(e) => {
              const value = parseFloat(e.target.value);
              setGuess(value || e.target.value);
            }}
            disabled={!canAddGuess}
            type="number"
            className="form-control form-control-lg"
            placeholder="Your answer"
            aria-label="Your answer"
            aria-describedby="basic-addon2"
          />
          <div className="input-group-append">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={
                !canAddGuess ||
                typeof guess === "string" ||
                (!guess && guess !== 0)
              }
              onClick={(e) => {
                if ((guess || guess === 0) && typeof guess === "number") {
                  addGuess(addGuessMutation, game, guess, playerId);
                }
              }}
            >
              ⮑
            </button>
          </div>
        </div>
      </>
    </Drawer>
  );
};
