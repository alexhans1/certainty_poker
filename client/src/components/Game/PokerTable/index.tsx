import React from "react";
import PlayerComp from "./Player";
import Question from "../Question";
import {
  BettingRound,
  Game,
  Player,
  QuestionRound,
  QuestionTypes,
} from "../../../interfaces";
import { hasPlayerFolded, haveAllPlayersPlacedTheirGuess } from "../helpers";
import GuessMap from "../GuessMap";
import MultipleChoiceOptions from "../MultipleChoiceOptions";

import "./styles.css";
import { getWinningPlayerArray } from "./helpers";
interface Props {
  game: Game;
  usedQuestionRound?: QuestionRound;
  currentBettingRound?: BettingRound;
  playerId?: Player["id"];
  isSpectator: boolean;
}

const PokerTable = ({
  game,
  usedQuestionRound,
  currentBettingRound,
  playerId,
  isSpectator,
}: Props) => {
  const isGeoQuestion = usedQuestionRound?.question.type === QuestionTypes.GEO;
  const isMultipleChoiceQuestion =
    usedQuestionRound?.question.type === QuestionTypes.MULTIPLE_CHOICE;
  const allPlayersPlacedTheirGuess =
    usedQuestionRound &&
    game.players &&
    haveAllPlayersPlacedTheirGuess(usedQuestionRound, game.players);
  const winningPlayerIds = getWinningPlayerArray(game) || [];

  return (
    <div className="flex flex-col items-center">
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
                  numberOfPlayers: game.players.length,
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
                  question: usedQuestionRound?.question,
                  isWinningPlayer: winningPlayerIds.includes(player.id),
                  isGameOver: game.isOver,
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
            {isGeoQuestion && (
              <GuessMap
                {...{
                  usedQuestionRound,
                  isSpectator,
                  playerId,
                  players: game.players,
                  className: "map",
                }}
              />
            )}
            {isMultipleChoiceQuestion && (
              <MultipleChoiceOptions
                {...{
                  usedQuestionRound,
                  alternatives:
                    usedQuestionRound?.question.alternatives?.map((alt) => ({
                      value: alt,
                      active: !usedQuestionRound.question.hiddenAlternatives?.includes(
                        alt
                      ),
                    })) || [],
                  guess: usedQuestionRound?.guesses.find(
                    (g) => g.playerId === playerId
                  )?.guess.numerical,
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PokerTable;
