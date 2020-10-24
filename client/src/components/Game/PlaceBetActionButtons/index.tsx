import React from "react";
import { QuestionRound, Player, Game, BettingRound } from "../../../interfaces";
import {
  PlaceBet,
  check,
  call,
  raise,
  fold,
  haveAllPlayersPlacedTheirBets,
} from "../helpers";
import ActionButton from "./ActionButton";

interface ActionButtonsProps {
  game: Game;
  currentQuestionRound: QuestionRound;
  currentBettingRound?: BettingRound;
  playerId: Player["id"];
  placeBet: PlaceBet;
}

export default ({
  game,
  currentQuestionRound,
  currentBettingRound,
  playerId,
  placeBet,
}: ActionButtonsProps) => {
  if (!currentQuestionRound || !currentBettingRound) {
    return null;
  }
  return (
    <>
      {[
        {
          text: "Check",
          handleOnClick: () => {
            check(placeBet, game, playerId);
          },
        },
        {
          text: "Call",
          handleOnClick: () => {
            call(placeBet, game, playerId);
          },
        },
        {
          text: "Raise",
          handleOnClick: () => {
            raise(50, placeBet, game, playerId);
          },
        },
        {
          text: "Fold",
          handleOnClick: () => {
            fold(placeBet, game, playerId);
          },
        },
      ].map((actionButtonProps) => (
        <ActionButton
          key={actionButtonProps.text}
          {...actionButtonProps}
          isDisabled={
            currentBettingRound?.currentPlayer.id !== playerId ||
            !haveAllPlayersPlacedTheirBets(currentQuestionRound, game.players)
          }
        />
      ))}
    </>
  );
};
