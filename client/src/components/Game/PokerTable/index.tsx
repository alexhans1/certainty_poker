import React from "react";
import PlayerComp from "./Player";
import Question from "../Question";
import { Game, Player, QuestionRound } from "../../../interfaces";

import "./styles.scss";
import { getCurrentBettingRound } from "../helpers";

interface Props {
  game: Game;
  usedQuestionRound?: QuestionRound;
  playerId?: Player["id"];
}

const PokerTable = ({ game, usedQuestionRound, playerId }: Props) => {
  const currentBettingRound = getCurrentBettingRound(usedQuestionRound);
  return (
    <div className="poker-table">
      {game.players.map((player, index) => (
        <PlayerComp
          key={player.id}
          {...{
            player,
            index,
            currentBettingRound,
            isAppPlayer: player.id === playerId,
            isTurnPlayer: player.id === currentBettingRound?.currentPlayer.id,
            isQuestionRoundOver: !!usedQuestionRound?.isOver,
          }}
        />
      ))}
      {usedQuestionRound && (
        <Question
          {...{
            game,
            usedQuestionRound,
          }}
        />
      )}
    </div>
  );
};

export default PokerTable;
