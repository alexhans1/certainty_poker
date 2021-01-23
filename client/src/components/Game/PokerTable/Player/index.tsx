import React from "react";
import { Player } from "../../../../interfaces";

import "./styles.scss";

interface Props {
  player: Player;
  index: number;
}

export default ({ player, index }: Props) => {
  return (
    <div className={`player player-${index + 1}`}>
      <span className="status" />
      <div className="info">
        <span className="name">{player.name}</span>
        <span className="money">{player.money}</span>
      </div>
    </div>
  );
};
