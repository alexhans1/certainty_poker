import React, { useEffect, useState } from "react";
import Drawer from "@material-ui/core/Drawer";
import { getPlayerIdFromStorage, setPlayerIdToStorage } from "../../../storage";
import { Game, Player } from "../../../interfaces";

type CreatePlayer = ({
  variables: {
    input: { gameId, playerName },
  },
}: {
  variables: { input: { gameId: Game["id"]; playerName: Player["name"] } };
}) => void;

interface NameInputProps {
  gameId: Game["id"];
  playerId: Player["id"];
  newPlayerData: { addPlayer: Player } | undefined;
  startGameData: { startGame: Game } | undefined;
  fetchGameData: { game: Game } | undefined;
  createPlayer: CreatePlayer;
  placeBetData: { placeBet: Game } | undefined;
  addGuessData: { addGuess: Game } | undefined;
  setPlayerId: React.Dispatch<React.SetStateAction<string | undefined>>;
  setGame: React.Dispatch<React.SetStateAction<Game | undefined>>;
}

export default (dependencies: NameInputProps) => {
  const [name, setName] = useState("");
  useEffect(() => {
    console.log(123);

    if (dependencies.gameId) {
      const storedPlayerId = getPlayerIdFromStorage(dependencies.gameId);
      const newPlayerId = dependencies.newPlayerData?.addPlayer?.id;

      if (storedPlayerId) {
        dependencies.setPlayerId(storedPlayerId);
      }

      if (newPlayerId) {
        setPlayerIdToStorage(dependencies.gameId, newPlayerId);
        dependencies.setPlayerId(newPlayerId);
      }

      if (!storedPlayerId && !newPlayerId) {
        dependencies.createPlayer({
          variables: {
            input: {
              gameId: dependencies.gameId,
              playerName: [
                "🧟‍♂️",
                "⛹🏻‍♀️",
                "🏈",
                "🍪",
                "🍆",
                "🍑",
                "🌈",
                "🦔",
                "🦧",
                "🦊",
                "💆‍♀️",
                "🤷🏻‍♂️",
                "🧝🏽‍♂️",
                "🦹🏿‍♀️",
              ][Math.floor(Math.random() * 14)],
            },
          },
        });
      }
    }

    dependencies.setGame(
      dependencies.fetchGameData?.game ||
        dependencies.startGameData?.startGame ||
        dependencies.placeBetData?.placeBet ||
        dependencies.addGuessData?.addGuess
    );
  }, [dependencies]);

  return (
    <Drawer anchor={"bottom"} open={true} variant="persistent">
      <span>alex</span>
    </Drawer>
  );
};
