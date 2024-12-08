import { Game } from "../../../interfaces";

export const getWinningPlayerArray = (game: Game) => {
  if (game.isOver) {
    return game.players
      .reduce(
        (winners, player, i) => {
          if (i === 0) return winners;
          if (winners[0].money < player.money) {
            return [player];
          }
          if (winners[0].money === player.money) {
            return [...winners, player];
          }
          return winners;
        },
        [game.players[0]]
      )
      .map((p) => p.id);
  }
};
