import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";

interface Props {
  buttonLabel: string | React.ReactNode;
  dialogTitle: string | React.ReactNode;
  confirmLabel: string;
  onConfirm: () => void;
  isDisabled?: boolean;
  btnClassName?: string;
}

export default ({
  buttonLabel,
  dialogTitle,
  confirmLabel,
  onConfirm,
  isDisabled,
  btnClassName,
}: Props) => {
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = () => {
    onConfirm();
    setOpen(false);
  };

  return (
    <>
      <button
        className={btnClassName || "btn btn-primary"}
        onClick={handleClickOpen}
        disabled={isDisabled}
      >
        {buttonLabel}
      </button>
      <Dialog open={open} onClose={handleClose}>
        <div className="px-4 py-2">
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogActions>
            <button className="btn btn-outline-dark" onClick={handleClose}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleConfirm}>
              {confirmLabel}
            </button>
          </DialogActions>
        </div>
      </Dialog>
    </>
  );
};
