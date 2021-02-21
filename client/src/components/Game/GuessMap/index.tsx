import React from "react";
import { AiFillCheckCircle } from "react-icons/ai";
import {
  Game,
  Player,
  QuestionRound,
  QuestionTypes,
} from "../../../interfaces";
import { getRevealAnswer, hasPlayerFolded } from "../helpers";
import Map, { MarkerType } from "../Map";

interface Props {
  playerId?: Player["id"];
  players: Game["players"];
  usedQuestionRound: QuestionRound;
  isSpectator: Boolean;
  className?: string;
}

export default function GuessMap({
  usedQuestionRound,
  isSpectator,
  playerId,
  players,
  className,
}: Props) {
  const questionType = usedQuestionRound.question.type;
  if (!usedQuestionRound || questionType !== QuestionTypes.GEO) {
    return null;
  }

  const playerGuess = usedQuestionRound.guesses.find(
    (g) => g.playerId === playerId
  );

  let mapMarkers: MarkerType[] = playerGuess?.guess.geo
    ? [
        {
          position: playerGuess.guess.geo,
          label: "You",
          distanceToAnswer: playerGuess.difference,
        },
      ]
    : [];

  if (
    isSpectator ||
    (usedQuestionRound.isOver && usedQuestionRound.isShowdown)
  ) {
    mapMarkers.push(
      ...usedQuestionRound.guesses.reduce<MarkerType[]>(
        (acc, { guess, playerId: pId, difference }) => {
          if (
            guess.geo &&
            playerId !== pId &&
            (isSpectator || !hasPlayerFolded(usedQuestionRound, pId))
          ) {
            const label = players.find((p) => p.id === pId)?.name || "";
            acc.push({
              position: guess.geo,
              label,
              distanceToAnswer: difference,
            });
          }
          return acc;
        },
        []
      )
    );
  }
  if (
    getRevealAnswer(usedQuestionRound) &&
    usedQuestionRound.question.answer.geo
  ) {
    mapMarkers.push({
      position: usedQuestionRound.question.answer.geo,
      label: <AiFillCheckCircle className="text-green-500 text-2xl" />,
      isAnswer: true,
      radiusInKilometres: usedQuestionRound.question.answer.geo.toleranceRadius,
    });
  }

  return <Map className={className} markers={mapMarkers} />;
}
