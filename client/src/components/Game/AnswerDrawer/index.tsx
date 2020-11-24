import React from "react";
import Drawer from "../../Drawer";
import NumberInput from "./NumberInput";
import MapInput from "./MapInput";
import {
  Answer,
  Game,
  GeoCoordinate,
  Player,
  QuestionRound,
  QuestionTypes,
} from "../../../interfaces";
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
  const canAddGuess = !currentQuestionRound.guesses.find(
    (guess) => guess.playerId === playerId
  );

  const handleNumberInputSubmit = (guess: number | string) => {
    if ((guess || guess === 0) && typeof guess === "number") {
      addGuess(
        addGuessMutation,
        game,
        {
          numerical: guess,
        },
        playerId
      );
      setShowNewQuestionRound(false);
    }
  };

  const handleMapInputSubmit = (geoCoordinate: GeoCoordinate) => {
    const guess: Answer = {
      geo: geoCoordinate,
    };
    addGuess(addGuessMutation, game, guess, playerId);
    setShowNewQuestionRound(false);
  };

  const getInput = () => {
    switch (currentQuestionRound.question.type) {
      case QuestionTypes.NUMERICAL:
        return <NumberInput handleSubmit={handleNumberInputSubmit} />;
      case QuestionTypes.GEO:
        return <MapInput handleSubmit={handleMapInputSubmit} />;
      default:
        throw new Error("Unknow Question Type");
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
        {getInput()}
      </>
    </Drawer>
  );
};
