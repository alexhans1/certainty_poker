import React from "react";
import {
  SentimentDissatisfied,
  SentimentVerySatisfied,
  AccountTree,
  Close,
} from "@material-ui/icons";

interface Props {
  isQuestionRoundOver: boolean;
  isWinningPlayer?: boolean;
  changeInMoney?: number;
  hasFolded: boolean;
  isDead: boolean;
}

function Status({
  isWinningPlayer,
  isQuestionRoundOver,
  changeInMoney,
  isDead,
  hasFolded,
}: Props) {
  if (isDead) {
    return <AccountTree fontSize="large" />;
  }
  if (hasFolded) {
    return <Close fontSize="large" />;
  }
  if (isWinningPlayer && isQuestionRoundOver) {
    return <SentimentVerySatisfied fontSize="large" />;
  }
  if (isQuestionRoundOver && changeInMoney && changeInMoney > 0) {
    return <SentimentVerySatisfied fontSize="large" />;
  }
  if (isQuestionRoundOver && changeInMoney && changeInMoney < 0) {
    return <SentimentDissatisfied fontSize="large" />;
  }
  return null;
}

export default Status;
