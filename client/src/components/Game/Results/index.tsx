import React from "react";
import Backdrop from "@material-ui/core/Backdrop";
import PlayerTable, { PlayerTableProps } from "../PlayerTable";

const styles = {
  backdrop: {
    zIndex: 1,
    color: "#fff",
  },
};

export default (props: PlayerTableProps) => {
  return (
    <Backdrop style={styles.backdrop} open={true} onClick={() => {}}>
      <div className="d-flex flex-column align-items-center">
        <h1>Results</h1>
        <PlayerTable {...{ ...props, isResultList: true }} />
      </div>
    </Backdrop>
  );
};
