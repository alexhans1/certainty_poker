import React from "react";
import {
  Game,
  Player,
  QuestionRound,
  QuestionTypes,
} from "../../../interfaces";
import { getRevealAnswer, hasPlayerFolded } from "../helpers";
import Map, { Marker } from "../Map";

interface Props {
  playerId?: Player["id"];
  players: Game["players"];
  usedQuestionRound?: QuestionRound;
  isSpectator: Boolean;
  className?: string;
}

export default ({
  usedQuestionRound,
  isSpectator,
  playerId,
  players,
  className,
}: Props) => {
  const questionType = usedQuestionRound?.question.type;
  if (!usedQuestionRound || questionType !== QuestionTypes.GEO) {
    return null;
  }

  const playerGuess = usedQuestionRound?.guesses.find(
    (g) => g.playerId === playerId
  );

  let mapMarkers: Marker[] = playerGuess?.guess.geo
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
    (usedQuestionRound?.isOver && usedQuestionRound?.isShowdown)
  ) {
    mapMarkers.push(
      ...usedQuestionRound?.guesses.reduce<Marker[]>(
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
      label: "Correct Answer",
      isAnswer: true,
    });
  }

  return <Map className={className} markers={mapMarkers} />;
};
