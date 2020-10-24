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
import ActionButton from "./Button";

export interface ActionButtonsProps {
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
    <div className="d-flex flex-row w-100 justify-content-between">
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
    </div>
  );
};
