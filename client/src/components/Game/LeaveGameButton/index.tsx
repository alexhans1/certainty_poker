import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import ExitToAppOutlinedIcon from "@material-ui/icons/ExitToAppOutlined";
import { useMutation } from "@apollo/react-hooks";
import { Game, Player } from "../../../interfaces";
import { REMOVE_PLAYER, RemovePlayerVariables } from "../../../api/queries";
import errorLogger from "../../../api/errorHandler";
import { deletePlayerIdFromStorage } from "../../../storage";

interface Props {
  gameId?: Game["id"];
  playerId?: Player["id"];
  gameHasStarted: Boolean;
  setPlayerId: React.Dispatch<React.SetStateAction<string | undefined>>;
}

export default ({ gameId, playerId, gameHasStarted, setPlayerId }: Props) => {
  const [open, setOpen] = React.useState(false);
  const [removePlayer] = useMutation<any, RemovePlayerVariables>(
    REMOVE_PLAYER,
    {
      onError: errorLogger,
      onCompleted: () => {
        if (gameId) {
          deletePlayerIdFromStorage(gameId);
          setPlayerId(undefined);
        }
      },
    }
  );

  if (!gameId || !playerId) {
    return null;
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = () => {
    removePlayer({ variables: { playerId, gameId } });
    setOpen(false);
  };

  return (
    <>
      <button
        id="leave-game"
        className="btn btn-link btn-lg"
        onClick={handleClickOpen}
      >
        <ExitToAppOutlinedIcon />
      </button>
      <Dialog open={open} onClose={handleClose}>
        <div className="px-4 py-2">
          <DialogTitle>
            Are you sure?
            {gameHasStarted && (
              <p>If you leave the game, you cannot join again later.</p>
            )}
          </DialogTitle>
          <DialogActions>
            <button className="btn btn-outline-dark" onClick={handleClose}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleConfirm}>
              Leave Game
            </button>
          </DialogActions>
        </div>
      </Dialog>
    </>
  );
};
