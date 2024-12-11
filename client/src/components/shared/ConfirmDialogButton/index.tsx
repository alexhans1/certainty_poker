import { Dialog, DialogActions, DialogTitle } from "@mui/material";
import React, { useState } from "react";

interface Props {
  buttonLabel: string | React.ReactNode;
  dialogTitle: string | React.ReactNode;
  confirmLabel: string;
  onConfirm: () => void;
  isDisabled?: boolean;
  btnClassName?: string;
}

export default function ConfirmDialogButton({
  buttonLabel,
  dialogTitle,
  confirmLabel,
  onConfirm,
  isDisabled,
  btnClassName,
}: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = async () => {
    setLoading(true);
    await onConfirm();
    setOpen(false);
    setLoading(false);
  };

  return (
    <>
      <button
        className={
          btnClassName ||
          "bg-blue-500 rounded-lg font-bold text-white text-center px-4 py-3 transition duration-300 ease-in-out hover:bg-blue-600"
        }
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
            <button
              disabled={loading}
              className="bg-blue-500 rounded-lg font-bold text-white text-center px-4 py-3 transition duration-300 ease-in-out hover:bg-blue-600"
              onClick={handleConfirm}
            >
              {loading ? "Loading..." : confirmLabel}
            </button>
          </DialogActions>
        </div>
      </Dialog>
    </>
  );
}
