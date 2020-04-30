import { Player, Game, GuessInput } from "../../../interfaces";
import { getCurrentQuestionRound } from ".";

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
  const currentQuestionRound = getCurrentQuestionRound(game);
  if (!currentQuestionRound?.id) {
    throw new Error("could not find currentQuestionRound");
  }
  addGuessMutation({
    variables: {
      input: {
        gameId: game.id,
        questionRoundId: currentQuestionRound.id,
        playerId: playerId,
        guess,
      },
    },
  });
};
