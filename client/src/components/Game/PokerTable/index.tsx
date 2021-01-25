import React from "react";
import PlayerComp from "./Player";
import Question from "../Question";
import {
  Game,
  Player,
  QuestionRound,
  QuestionTypes,
} from "../../../interfaces";

import "./styles.scss";
import { getCurrentBettingRound } from "../helpers";
import GuessMap from "../GuessMap";

interface Props {
  game: Game;
  usedQuestionRound?: QuestionRound;
  playerId?: Player["id"];
  isSpectator: boolean;
}

const PokerTable = ({
  game,
  usedQuestionRound,
  playerId,
  isSpectator,
}: Props) => {
  const currentBettingRound = getCurrentBettingRound(usedQuestionRound);
  const isGeoQuestion = usedQuestionRound?.question.type === QuestionTypes.GEO;
  return (
    <div className="d-flex flex-column align-items-center">
      {usedQuestionRound && isGeoQuestion && (
        <Question
          {...{
            game,
            usedQuestionRound,
          }}
        />
      )}
      <div className="relative-wrap">
        <div className={`poker-table ${isGeoQuestion ? "isGeoQuestion" : ""}`}>
          {game.players.map((player, index) => {
            const { changeInMoney } =
              usedQuestionRound?.results?.find(
                ({ playerId }) => player.id === playerId
              ) || {};
            return (
              <PlayerComp
                key={player.id}
                {...{
                  player,
                  index,
                  currentBettingRound,
                  changeInMoney,
                  isAppPlayer: player.id === playerId,
                  isTurnPlayer:
                    player.id === currentBettingRound?.currentPlayer.id,
                  isQuestionRoundOver: !!usedQuestionRound?.isOver,
                }}
              />
            );
          })}
          <div className="inner-content">
            {usedQuestionRound && !isGeoQuestion && (
              <Question
                {...{
                  game,
                  usedQuestionRound,
                }}
              />
            )}
            <GuessMap
              {...{
                usedQuestionRound,
                isSpectator,
                playerId,
                players: game.players,
                className: "map",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PokerTable;
