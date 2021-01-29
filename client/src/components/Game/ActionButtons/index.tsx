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
  usedQuestionRound: QuestionRound;
  currentBettingRound?: BettingRound;
  playerId: Player["id"];
  placeBet: PlaceBet;
  isAppPlayerTurn: boolean;
}

export default ({
  game,
  usedQuestionRound,
  currentBettingRound,
  playerId,
  placeBet,
  isAppPlayerTurn,
}: ActionButtonsProps) => {
  if (!usedQuestionRound || !currentBettingRound) {
    return null;
  }

  const [showRaiseDrawer, setShowRaiseDrawer] = useState(false);
  const player = game.players.find((p) => p.id === playerId);

  const amountToCall = calculateAmountToCall(currentBettingRound, playerId);

  return (
    <div className="d-flex flex-column w-100">
      <ActionButton
        text={amountToCall > 0 ? `Call for ${amountToCall}` : "Check"}
        handleOnClick={() => {
          call(placeBet, game, playerId);
        }}
        isDisabled={amountToCall <= 0 || !isAppPlayerTurn}
      />
      <div className="d-flex justify-content-between flex-row my-2">
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
      </div>
      {/* {[
        {
          text: amountToCall > 0 ? `Call for ${amountToCall}` : "Check",
          handleOnClick: () => {
            call(placeBet, game, playerId);
          },
          isDisabled: amountToCall <= 0,
        },
        {
          text: "Raise",
          handleOnClick: () => {
            setShowRaiseDrawer(true);
          },
          isDisabled: player?.money && amountToCall >= player?.money,
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
            !isAppPlayerTurn
          }
        />
      ))} */}
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
