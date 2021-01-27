import React from "react";
import { Close, EmojiObjects, MoreHoriz } from "@material-ui/icons";
import { GiLaurelsTrophy, GiPartyPopper, GiTombstone } from "react-icons/gi";
import { FaSadCry } from "react-icons/fa";
import { FiArrowUp, FiMinus } from "react-icons/fi";
import { CgMore } from "react-icons/cg";

export const actionIcons = {
  raised: <FiArrowUp />,
  called: <FiMinus />,
  checked: <FiMinus />,
  waiting: <CgMore />,
};

interface Props {
  isQuestionRoundOver: boolean;
  isWinningPlayer?: boolean;
  changeInMoney?: number;
  hasFolded: boolean;
  isDead: boolean;
  isTurnPlayer: boolean;
  playerHasPlacedTheirGuess?: boolean;
  allPlayersPlacedTheirGuess?: boolean;
  playerAction?: keyof typeof actionIcons;
}

function Status({
  isWinningPlayer,
  isQuestionRoundOver,
  changeInMoney,
  isDead,
  hasFolded,
  allPlayersPlacedTheirGuess,
  playerHasPlacedTheirGuess,
  playerAction,
  isTurnPlayer,
}: Props) {
  if (isDead) {
    return <GiTombstone />;
  }
  if (hasFolded) {
    return <Close fontSize="large" />;
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
    return null;
  }
  if (playerAction) {
    return actionIcons[playerAction];
  }
  return null;
}

export default Status;
