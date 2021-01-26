import React from "react";
import { MonetizationOn, EmojiObjects } from "@material-ui/icons";
import Status from "./Status";
import {
  BettingRound,
  Guess,
  Player,
  Question,
  QuestionTypes,
} from "../../../../interfaces";
import { calculateBettingRoundSpendingForPlayer } from "../../helpers";

import "./styles.scss";
import FormattedGuess from "../../Guess";

interface Props {
  player: Player;
  currentBettingRound?: BettingRound;
  changeInMoney?: number;
  index: number;
  isTurnPlayer: boolean;
  isAppPlayer: boolean;
  isWinningPlayer?: boolean;
  isQuestionRoundOver: boolean;
  isShowdown: boolean;
  hasFolded: boolean;
  isSpectator: boolean;
  allPlayersPlacedTheirGuess?: boolean;
  guess?: Guess;
  question?: Question;
}

export default ({
  player,
  index,
  isTurnPlayer,
  isAppPlayer,
  isWinningPlayer,
  isQuestionRoundOver,
  isShowdown,
  currentBettingRound,
  changeInMoney,
  hasFolded,
  isSpectator,
  allPlayersPlacedTheirGuess,
  guess,
  question,
}: Props) => {
  const isTurnPlayerClass =
    isTurnPlayer && !isQuestionRoundOver ? "isTurnPlayer" : "";
  const isAppPlayerClass = isAppPlayer ? "isAppPlayer" : "";

  const bettingRoundSpending = currentBettingRound
    ? calculateBettingRoundSpendingForPlayer(currentBettingRound, player.id)
    : 0;
  const revealGuess =
    question?.type !== QuestionTypes.GEO &&
    (isSpectator || (!!isQuestionRoundOver && isShowdown && !hasFolded));

  return (
    <div
      className={`player player-${
        index + 1
      } ${isTurnPlayerClass} ${isAppPlayerClass}`}
    >
      <span className="status">
        <Status
          {...{
            isWinningPlayer,
            changeInMoney,
            isQuestionRoundOver,
            isDead: player.isDead,
            hasFolded,
            allPlayersPlacedTheirGuess,
            playerHasPlacedTheirGuess: !!guess,
          }}
        />
      </span>
      <div className="info">
        <span className="name">{player.name}</span>
        <div className="d-flex align-items-center">
          <MonetizationOn className="mr-1" fontSize="small" />
          <span>{player.money}</span>
          {isQuestionRoundOver && changeInMoney && (
            <span
              className={`ml-1 ${
                changeInMoney > 0 ? "text-success" : "text-danger"
              }`}
            >
              ({changeInMoney})
            </span>
          )}
        </div>
        <div className="inner-info">
          {!isQuestionRoundOver && !!bettingRoundSpending && (
            <div className="d-flex align-items-center">
              <MonetizationOn className="mx-1" fontSize="inherit" />
              <span>{bettingRoundSpending}</span>
            </div>
          )}
          {revealGuess && question?.type && guess?.guess && (
            <div className="d-flex align-items-center">
              <EmojiObjects className="mx-1" fontSize="inherit" />
              <FormattedGuess
                {...{
                  guess: guess?.guess,
                  questionType: question.type,
                  alternatives: question.alternatives,
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
