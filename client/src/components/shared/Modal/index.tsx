import { Modal } from "@mui/material"
import React from "react"
import { FaTimes } from "react-icons/fa"

interface Props {
  open: boolean
  handleClose: () => void
  children: React.ReactNode
}

function ModalComponent({ open, handleClose, children }: Props) {
  return (
    <Modal
      disablePortal
      disableEnforceFocus
      disableAutoFocus
      open={open}
      className="flex justify-center items-center p-5"
      onClose={handleClose}
      closeAfterTransition
    >
      <div className="bg-white flex flex-col h-full relative rounded-md border border-gray-500 lg:w-2/3 md:w-3/4 overflow-y-auto py-5 px-8 focus:outline-none max-w-2xl">
        <button onClick={handleClose} className="absolute top-4 right-4">
          <FaTimes />
        </button>
        {children}
      </div>
    </Modal>
  )
}

export default ModalComponent
