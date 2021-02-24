import React from "react";
import Tooltip from "@material-ui/core/Tooltip";
import { AiOutlineQuestion } from "react-icons/ai";
import { GiLaurelsTrophy, GiPartyPopper } from "react-icons/gi";
import {
  FaBell,
  FaRegLightbulb,
  FaSadCry,
  FaSkullCrossbones,
} from "react-icons/fa";
import { FiArrowUp, FiMinus } from "react-icons/fi";
import { CgMore } from "react-icons/cg";
import { GrClose, GrMoney } from "react-icons/gr";
import { BettingStates, Player } from "../../../../interfaces";

const StatusWithTooltip = ({
  tooltipTitle,
  children,
}: {
  tooltipTitle: string;
  children: React.ReactNode;
}) => (
  <Tooltip title={tooltipTitle}>
    <span>{children}</span>
  </Tooltip>
);

const actionIcons = {
  [BettingStates.RAISED]: (
    <StatusWithTooltip tooltipTitle="Raised">
      <FiArrowUp />
    </StatusWithTooltip>
  ),
  [BettingStates.CALLED]: (
    <StatusWithTooltip tooltipTitle="Called">
      <FiMinus />
    </StatusWithTooltip>
  ),
  [BettingStates.CHECKED]: (
    <StatusWithTooltip tooltipTitle="Checked">
      <FiMinus />
    </StatusWithTooltip>
  ),
};

interface Props {
  player: Player;
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
    return (
      <StatusWithTooltip tooltipTitle="Out">
        <FaSkullCrossbones />
      </StatusWithTooltip>
    );
  }
  if (hasFolded) {
    return (
      <StatusWithTooltip tooltipTitle="Folded">
        <GrClose />
      </StatusWithTooltip>
    );
  }
  if (playerIsAllIn) {
    return (
      <StatusWithTooltip tooltipTitle="All in">
        <GrMoney />
      </StatusWithTooltip>
    );
  }
  if (isQuestionRoundOver) {
    if (isWinningPlayer) {
      return <GiLaurelsTrophy />;
    }
    if (changeInMoney && changeInMoney > 0) {
      return <GiPartyPopper />;
    }
    if (changeInMoney && changeInMoney < 0) {
      return <FaSadCry />;
    }
    return null;
  }
  if (!allPlayersPlacedTheirGuess) {
    if (playerHasPlacedTheirGuess) {
      return (
        <StatusWithTooltip tooltipTitle="Already submitted guess">
          <FaRegLightbulb />
        </StatusWithTooltip>
      );
    } else {
      return (
        <StatusWithTooltip tooltipTitle="Not yet submitted guess">
          <AiOutlineQuestion />
        </StatusWithTooltip>
      );
    }
  }
  if (isTurnPlayer) {
    return (
      <StatusWithTooltip tooltipTitle="Player's turn">
        <FaBell className="text-red-600" />
      </StatusWithTooltip>
    );
  }
  const playerAction = player.bettingState;
  if (playerAction && actionIcons[playerAction]) {
    return actionIcons[playerAction];
  }
  return (
    <StatusWithTooltip tooltipTitle="Waiting for turn">
      <CgMore />
    </StatusWithTooltip>
  );
}

export default Status;
