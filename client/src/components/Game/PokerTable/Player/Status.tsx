import React from "react";
import { Close, EmojiObjects, MoreHoriz } from "@material-ui/icons";
import { GiLaurelsTrophy, GiPartyPopper } from "react-icons/gi";
import { FaBell, FaSadCry, FaSkullCrossbones } from "react-icons/fa";
import { FiArrowUp, FiMinus } from "react-icons/fi";
import { CgMore } from "react-icons/cg";
import { GrMoney } from "react-icons/gr";
import { BettingRound, Player } from "../../../../interfaces";
import { getCurrentPlayerAction } from "../helpers";

export const actionIcons = {
  raised: <FiArrowUp />,
  called: <FiMinus />,
  checked: <FiMinus />,
  waiting: <CgMore />,
};

interface Props {
  player: Player;
  currentBettingRound?: BettingRound;
  bettingRoundSpending: number;
  isQuestionRoundOver: boolean;
  isWinningPlayer?: boolean;
  changeInMoney?: number;
  hasFolded: boolean;
  isDead?: boolean;
  isTurnPlayer: boolean;
  playerHasPlacedTheirGuess?: boolean;
  allPlayersPlacedTheirGuess?: boolean;
  playerIsAllIn?: boolean;
}

function Status({
  player,
  currentBettingRound,
  bettingRoundSpending,
  isWinningPlayer,
  isQuestionRoundOver,
  changeInMoney,
  isDead,
  hasFolded,
  allPlayersPlacedTheirGuess,
  playerHasPlacedTheirGuess,
  isTurnPlayer,
  playerIsAllIn,
}: Props) {
  if (isDead) {
    return <FaSkullCrossbones />;
  }
  if (hasFolded) {
    return <Close fontSize="large" />;
  }
  if (playerIsAllIn) {
    return <GrMoney />;
  }
  if (isWinningPlayer && isQuestionRoundOver) {
    return <GiLaurelsTrophy />;
  }
  if (isQuestionRoundOver && changeInMoney && changeInMoney > 0) {
    return <GiPartyPopper />;
  }
  if (isQuestionRoundOver && changeInMoney && changeInMoney < 0) {
    return <FaSadCry />;
  }
  if (!allPlayersPlacedTheirGuess) {
    if (playerHasPlacedTheirGuess) {
      return <EmojiObjects fontSize="large" />;
    } else {
      return <MoreHoriz fontSize="large" />;
    }
  }
  if (isTurnPlayer) {
    return <FaBell className="text-red-600" />;
  }
  const playerAction = getCurrentPlayerAction(
    player,
    bettingRoundSpending,
    currentBettingRound
  );
  if (playerAction) {
    return actionIcons[playerAction];
  }
  return null;
}

export default Status;
