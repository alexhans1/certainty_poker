import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { Game, Player } from "../../../interfaces";
import { deletePlayerIdFromStorage } from "../../../storage";
import ConfirmDialogButton from "../../shared/ConfirmDialogButton";
import { IoExit } from "react-icons/io5";

interface Props {
  gameId?: Game["id"];
  playerId?: Player["id"];
  gameHasStarted: boolean;
  setPlayerId: React.Dispatch<React.SetStateAction<string | undefined>>;
}

function LeaveGameButton({
  gameId,
  playerId,
  gameHasStarted,
  setPlayerId,
}: Props) {
  const removePlayer = (playerId: string, gameId: string) => {};

  if (!gameId || !playerId) {
    return null;
  }

  const handleConfirm = () => {
    removePlayer(playerId, gameId);
  };

  return (
    <ConfirmDialogButton
      onConfirm={handleConfirm}
      dialogTitle={
        <>
          Are you sure?
          {gameHasStarted && (
            <p>If you leave the game, you cannot join again later.</p>
          )}
        </>
      }
      confirmLabel="Leave Game"
      buttonLabel={<IoExit />}
      btnClassName="leave-game btn btn-link btn-lg"
    />
  );
}

export default LeaveGameButton;
