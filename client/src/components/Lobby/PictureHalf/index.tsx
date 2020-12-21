import React from "react";

import "./styles.scss";
import Image from "../../../assets/certainty_poker_bg.png";

export default () => {
  return (
    <div className="image-container">
      <img src={Image} alt="background" />
    </div>
  );
};
