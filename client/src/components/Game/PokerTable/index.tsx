import React from "react";
import PlayerComp from "./Player";
import Question from "../Question";
import {
  Game,
  Guess,
  Player,
  QuestionRound,
  QuestionTypes,
} from "../../../interfaces";
import {
  getCurrentBettingRound,
  hasPlayerFolded,
  haveAllPlayersPlacedTheirGuess,
} from "../helpers";
import GuessMap from "../GuessMap";

import "./styles.scss";
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
  const allPlayersPlacedTheirGuess =
    usedQuestionRound &&
    game.players &&
    haveAllPlayersPlacedTheirGuess(usedQuestionRound, game.players);
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
            const hasFolded = !!(
              usedQuestionRound && hasPlayerFolded(usedQuestionRound, player.id)
            );
            const guess = usedQuestionRound?.guesses.find(
              (g) => g.playerId === player.id
            );
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
                  isShowdown: !!usedQuestionRound?.isShowdown,
                  hasFolded,
                  isSpectator,
                  allPlayersPlacedTheirGuess,
                  guess,
                  questionType: usedQuestionRound?.question.type,
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
