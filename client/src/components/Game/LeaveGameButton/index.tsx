import React, { useState } from "react";
import { Game, Player } from "../../../interfaces";
import { deletePlayerIdFromStorage } from "../../../storage";
import ConfirmDialogButton from "../../shared/ConfirmDialogButton";
import { IoExit } from "react-icons/io5";
import { removePlayer as removePlayerRequest } from "../../../api";

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
  const [loading, setLoading] = useState(false);

  const removePlayer = async (playerId: string, gameId: string) => {
    await removePlayerRequest({ gameId, playerId });
    deletePlayerIdFromStorage(gameId);
    setPlayerId(undefined);
  };

  if (!gameId || !playerId) {
    return null;
  }

  const handleConfirm = async () => {
    setLoading(true);
    await removePlayer(playerId, gameId);
    setLoading(false);
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
      isDisabled={loading}
    />
  );
}

export default LeaveGameButton;
