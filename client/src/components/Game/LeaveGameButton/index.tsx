import React, { useState } from "react";
import ExitToAppOutlinedIcon from "@material-ui/icons/ExitToAppOutlined";
import { useMutation } from "@apollo/react-hooks";
import { Game, Player } from "../../../interfaces";
import { REMOVE_PLAYER, GameAndPlayerIds } from "../../../api/queries";
import { deletePlayerIdFromStorage } from "../../../storage";
import ConfirmDialogButton from "../../shared/ConfirmDialogButton";

interface Props {
  gameId?: Game["id"];
  playerId?: Player["id"];
  gameHasStarted: Boolean;
  setPlayerId: React.Dispatch<React.SetStateAction<string | undefined>>;
}

function LeaveGameButton({
  gameId,
  playerId,
  gameHasStarted,
  setPlayerId,
}: Props) {
  const [_, setError] = useState();
  const [removePlayer] = useMutation<any, GameAndPlayerIds>(REMOVE_PLAYER, {
    onError: (err) => {
      setError(() => {
        throw err;
      });
    },
    onCompleted: () => {
      if (gameId) {
        deletePlayerIdFromStorage(gameId);
        setPlayerId(undefined);
      }
    },
  });

  if (!gameId || !playerId) {
    return null;
  }

  const handleConfirm = () => {
    removePlayer({ variables: { playerId, gameId } });
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
      buttonLabel={<ExitToAppOutlinedIcon />}
      btnClassName="leave-game btn btn-link btn-lg"
    />
  );
}

export default LeaveGameButton;
