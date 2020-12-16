import React from "react";
import { Game } from "../../../../interfaces";
import ConformDialogButton from "../../../shared/ConfirmDialogButton";
import { StartGame } from "..";

interface Props {
  gameId: Game["id"];
  startGame: StartGame;
  isDisabled: boolean;
}

export default ({ startGame, gameId, isDisabled }: Props) => {
  const onConfirm = () => {
    startGame({ variables: { gameId } });
  };
  return (
    <ConformDialogButton
      onConfirm={onConfirm}
      dialogTitle="Are you sure you want to start the game? Once it's started no more players can join."
      confirmLabel="Start Game"
      buttonLabel="Start Game"
      isDisabled={isDisabled}
    />
  );
};
