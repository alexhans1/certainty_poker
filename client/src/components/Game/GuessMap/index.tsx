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
}

export default ({
  usedQuestionRound,
  isSpectator,
  playerId,
  players,
}: Props) => {
  const questionType = usedQuestionRound?.question.type;
  if (!usedQuestionRound || questionType !== QuestionTypes.GEO) {
    return null;
  }

  const playerGuess = usedQuestionRound?.guesses.find(
    (g) => g.playerId === playerId
  )?.guess.geo;

  let mapMarkers: Marker[] = playerGuess
    ? [{ position: playerGuess, label: "You" }]
    : [];

  if (
    isSpectator ||
    (usedQuestionRound?.isOver && usedQuestionRound?.isShowdown)
  ) {
    mapMarkers.push(
      ...usedQuestionRound?.guesses.reduce<Marker[]>(
        (acc, { guess, playerId: pId }) => {
          if (
            guess.geo &&
            playerId !== pId &&
            (isSpectator || !hasPlayerFolded(usedQuestionRound, pId))
          ) {
            const label = players.find((p) => p.id === playerId)?.name || "";
            acc.push({ position: guess.geo, label });
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
    });
  }

  console.log("mapMarkers", mapMarkers);
  return <Map markers={mapMarkers} />;
};
