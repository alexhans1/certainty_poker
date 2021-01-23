import React from "react";
import Player from "./Player";
import { Game } from "../../../interfaces";

import "./styles.scss";

interface Props {
  game: Game;
}

const PokerTable = ({ game }: Props) => {
  return (
    <div className="poker-table">
      {game.players.map((player, index) => (
        <Player key={player.id} {...{ player, index }} />
      ))}
    </div>
  );
};

export default PokerTable;
