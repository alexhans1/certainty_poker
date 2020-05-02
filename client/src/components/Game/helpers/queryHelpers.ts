import { Player, Game, GuessInput } from "../../../interfaces";

export type AddGuess = ({
  variables: { input },
}: {
  variables: { input: GuessInput };
}) => void;

export const addGuess = (
  addGuessMutation: AddGuess,
  game: Game,
  guess: number,
  playerId: Player["id"]
) => {
  addGuessMutation({
    variables: {
      input: {
        gameId: game.id,
        playerId: playerId,
        guess,
      },
    },
  });
};
