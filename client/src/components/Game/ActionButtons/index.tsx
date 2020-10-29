import React, { useState } from "react";
import { QuestionRound, Player, Game, BettingRound } from "../../../interfaces";
import {
  PlaceBet,
  check,
  call,
  raise,
  fold,
  haveAllPlayersPlacedTheirGuess,
  calculateAmountToCall,
} from "../helpers";
import ActionButton from "./Button";
import RaiseInputDrawer from "./RaiseInputDrawer";

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

  const [showRaiseDrawer, setShowRaiseDrawer] = useState(false);

  return (
    <div className="d-flex flex-row w-100 justify-content-between">
      {[
        {
          text: "Check",
          handleOnClick: () => {
            check(placeBet, game, playerId);
          },
          isDisabled: calculateAmountToCall(currentBettingRound, playerId) > 0,
        },
        {
          text: "Call",
          handleOnClick: () => {
            call(placeBet, game, playerId);
          },
          isDisabled: calculateAmountToCall(currentBettingRound, playerId) <= 0,
        },
        {
          text: "Raise",
          handleOnClick: () => {
            setShowRaiseDrawer(true);
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
            actionButtonProps.isDisabled ||
            currentBettingRound?.currentPlayer.id !== playerId ||
            !haveAllPlayersPlacedTheirGuess(currentQuestionRound, game.players)
          }
        />
      ))}
      <RaiseInputDrawer
        {...{
          game,
          placeBet,
          playerId,
          currentBettingRound,
          handleRaise: raise,
          showRaiseDrawer,
          setShowRaiseDrawer,
        }}
      />
    </div>
  );
};
