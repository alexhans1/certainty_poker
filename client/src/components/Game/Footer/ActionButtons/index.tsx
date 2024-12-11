import { useState } from "react";
import {
  BettingRound,
  Game,
  Player,
  QuestionRound,
} from "../../../../interfaces";
import {
  PlaceBet,
  calculateAmountToCall,
  call,
  fold,
  raise,
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
  const [loading, setLoading] = useState(false);

  if (!usedQuestionRound || !currentBettingRound) {
    return null;
  }

  const player = game.players.find((p) => p.id === playerId);

  const amountToCall = calculateAmountToCall(currentBettingRound, playerId);

  return (
    <div className="grid md:grid-cols-3 gap-3 md:gap-4">
      <ActionButton
        text={amountToCall > 0 ? `Call for ${amountToCall}` : "Check"}
        handleOnClick={async () => {
          setLoading(true);
          await call(placeBet, game, playerId);
          setLoading(false);
        }}
        isDisabled={!isAppPlayerTurn || loading}
      />
      <ActionButton
        text="Raise"
        handleOnClick={() => {
          setShowRaiseDrawer(true);
        }}
        isDisabled={
          (player?.money && amountToCall >= player?.money) ||
          !isAppPlayerTurn ||
          loading
        }
      />
      <ActionButton
        text="Fold"
        handleOnClick={async () => {
          setLoading(true);
          await fold(placeBet, game, playerId);
          setLoading(false);
        }}
        isDisabled={!isAppPlayerTurn || loading}
      />
      <RaiseInputDrawer
        {...{
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
