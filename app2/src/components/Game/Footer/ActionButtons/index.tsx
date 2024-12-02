import React, { useState } from "react";
import {
  QuestionRound,
  Player,
  Game,
  BettingRound,
} from "../../../../interfaces";
import {
  PlaceBet,
  call,
  raise,
  fold,
  calculateAmountToCall,
} from "../../helpers";
import ActionButton from "./Button";
import RaiseInputDrawer from "./RaiseInputDrawer";

export interface ActionButtonsProps {
  game: Game;
  usedQuestionRound: QuestionRound;
  currentBettingRound?: BettingRound;
  playerId: Player["id"];
  placeBet: PlaceBet;
  isAppPlayerTurn: boolean;
}

export default function ActionButtons({
  game,
  usedQuestionRound,
  currentBettingRound,
  playerId,
  placeBet,
  isAppPlayerTurn,
}: ActionButtonsProps) {
  const [showRaiseDrawer, setShowRaiseDrawer] = useState(false);
  if (!usedQuestionRound || !currentBettingRound) {
    return null;
  }

  const player = game.players.find((p) => p.id === playerId);

  const amountToCall = calculateAmountToCall(currentBettingRound, playerId);

  return (
    <div className="grid md:grid-cols-3 gap-3 md:gap-4">
      <ActionButton
        text={amountToCall > 0 ? `Call for ${amountToCall}` : "Check"}
        handleOnClick={() => {
          call(placeBet, game, playerId);
        }}
        isDisabled={!isAppPlayerTurn}
      />
      <ActionButton
        text="Raise"
        handleOnClick={() => {
          setShowRaiseDrawer(true);
        }}
        isDisabled={
          (player?.money && amountToCall >= player?.money) || !isAppPlayerTurn
        }
      />
      <ActionButton
        text="Fold"
        handleOnClick={() => {
          fold(placeBet, game, playerId);
        }}
        isDisabled={!isAppPlayerTurn}
      />
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
}
