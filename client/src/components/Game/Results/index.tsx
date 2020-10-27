import React from "react";
import Backdrop from "@material-ui/core/Backdrop";
import PlayerTable, { PlayerTableProps } from "../PlayerTable";

const styles = {
  backdrop: {
    zIndex: 1,
    color: "#fff",
  },
};

interface ResultsProps extends PlayerTableProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default (props: ResultsProps) => {
  const { open, setOpen } = props;
  return (
    <Backdrop
      style={styles.backdrop}
      open={open}
      onClick={() => {
        setOpen(false);
      }}
    >
      <div className="d-flex flex-column align-items-center">
        <h1>Results</h1>
        <PlayerTable {...{ ...props, isResultList: true }} />
      </div>
    </Backdrop>
  );
};
