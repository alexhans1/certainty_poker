import React from "react";

interface Props {
  playerName?: string;
}

function PlayerSpot({ playerName }: Props) {
  return (
    <div className="rounded-xl border-2 px-3 h-16 w-36 flex items-center justify-center shadow">
      <span className="overflow-hidden text-overflow-ellipsis">
        {playerName}
      </span>
    </div>
  );
}

export default PlayerSpot;
