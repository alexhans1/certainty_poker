import React from "react";
import Drawer from "../../shared/Drawer";
import NumberInput from "./NumberInput";
import DateInput from "./DateInput";
import MapInput from "./MapInput";
import MultipleChoiceInput from "./MultipleChoiceInput";
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
  player?: Player;
  addGuessMutation: AddGuess;
  showAnswerDrawer: boolean;
  setShowAnswerDrawer: React.Dispatch<React.SetStateAction<boolean>>;
  hasPlayerPlacedGuessInCurrentQuestionRound: boolean;
}

export default function AnswerDrawer({
  currentQuestionRound,
  player,
  addGuessMutation,
  game,
  showAnswerDrawer,
  setShowAnswerDrawer,
  hasPlayerPlacedGuessInCurrentQuestionRound,
}: QuestionProps) {
  if (!player || player.isDead) {
    return null;
  }

  const handleNumberInputSubmit = (guess: number | string) => {
    if ((guess || guess === 0) && typeof guess === "number") {
      addGuess(
        addGuessMutation,
        game,
        {
          numerical: guess,
        },
        player.id
      );
      setShowAnswerDrawer(false);
    }
  };

  const handleMapInputSubmit = (geoCoordinate: GeoCoordinate) => {
    const guess: Answer = {
      geo: geoCoordinate,
    };
    addGuess(addGuessMutation, game, guess, player.id);
    setShowAnswerDrawer(false);
  };

  const getInput = () => {
    switch (currentQuestionRound.question.type) {
      case QuestionTypes.NUMERICAL:
        return <NumberInput handleSubmit={handleNumberInputSubmit} />;
      case QuestionTypes.DATE:
        return <DateInput handleSubmit={handleNumberInputSubmit} />;
      case QuestionTypes.GEO:
        return <MapInput handleSubmit={handleMapInputSubmit} />;
      case QuestionTypes.MULTIPLE_CHOICE:
        const alternatives = currentQuestionRound.question.alternatives?.map(
          (alt) => ({ value: alt, active: true })
        );
        return (
          <MultipleChoiceInput
            usedQuestionRound={currentQuestionRound}
            alternatives={alternatives}
            handleSubmit={handleNumberInputSubmit}
          />
        );
      default:
        throw new Error("Unknow Question Type");
    }
  };

  return (
    <Drawer
      onClose={() => {
        setShowAnswerDrawer(false);
      }}
      anchor={"bottom"}
      open={
        (showAnswerDrawer || game.questionRounds.length === 1) &&
        !hasPlayerPlacedGuessInCurrentQuestionRound
      }
      variant="temporary"
    >
      <>
        <p className="font-bold">{currentQuestionRound.question.question}</p>
        <p className="mt-4 text-sm">Your answer</p>
        {getInput()}
      </>
    </Drawer>
  );
}
