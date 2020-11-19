import React, { useState } from "react";
import Drawer from "../../Drawer";
import { Game, Player, QuestionRound } from "../../../interfaces";
import { AddGuess, addGuess } from "../helpers";

interface QuestionProps {
  game: Game;
  currentQuestionRound: QuestionRound;
  playerId: Player["id"];
  addGuessMutation: AddGuess;
  showNewQuestionRound: boolean;
  setShowNewQuestionRound: React.Dispatch<React.SetStateAction<boolean>>;
}

export default ({
  currentQuestionRound,
  playerId,
  addGuessMutation,
  game,
  showNewQuestionRound,
  setShowNewQuestionRound,
}: QuestionProps) => {
  const player = game.players.find((p) => p.id === playerId);
  if (player?.isDead) {
    return null;
  }
  const [guess, setGuess] = useState<number | string>("");
  const canAddGuess = !currentQuestionRound.guesses.find(
    (guess) => guess.playerId === playerId
  );

  const handleSubmit = () => {
    if ((guess || guess === 0) && typeof guess === "number") {
      addGuess(addGuessMutation, game, guess, playerId);
      setGuess("");
      setShowNewQuestionRound(false);
    }
  };

  return (
    <Drawer
      title="New Question"
      onClose={() => {
        setShowNewQuestionRound(false);
      }}
      anchor={"bottom"}
      open={
        canAddGuess &&
        showNewQuestionRound &&
        !currentQuestionRound?.guesses.find(
          (guess) => guess.playerId === playerId
        )
      }
      variant="persistent"
    >
      <>
        <p>{currentQuestionRound.question.question}</p>
        <div className="input-group mb-3">
          <input
            value={guess}
            onChange={(e) => {
              const value = parseFloat(e.target.value);
              if (value === 0) setGuess(0);
              else setGuess(value || e.target.value);
            }}
            onKeyUp={(e) => {
              if (e.which === 13) {
                handleSubmit();
              }
            }}
            disabled={!canAddGuess}
            type="number"
            className="form-control form-control-lg"
            placeholder="Your answer"
            aria-label="Your answer"
            aria-describedby="basic-addon2"
            autoFocus
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
              onClick={handleSubmit}
            >
              ⮑
            </button>
          </div>
        </div>
      </>
    </Drawer>
  );
};
