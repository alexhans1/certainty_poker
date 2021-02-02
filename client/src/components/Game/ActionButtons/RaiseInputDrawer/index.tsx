import React, { useState } from "react";
import Drawer from "../../../Drawer";
import { BettingRound, Game, Player } from "../../../../interfaces";
import { calculateAmountToCall, PlaceBet, raise } from "../../helpers";

type CreatePlayer = ({
  variables: {
    input: { gameId, playerName },
  },
}: {
  variables: { input: { gameId: Game["id"]; playerName: Player["name"] } };
}) => void;

interface Props {
  currentBettingRound: BettingRound;
  game: Game;
  handleRaise: typeof raise;
  placeBet: PlaceBet;
  playerId: Player["id"];
  showRaiseDrawer: boolean;
  setShowRaiseDrawer: React.Dispatch<React.SetStateAction<boolean>>;
}

export default ({
  currentBettingRound,
  game,
  handleRaise,
  placeBet,
  playerId,
  showRaiseDrawer,
  setShowRaiseDrawer,
}: Props) => {
  const amountToCall = calculateAmountToCall(currentBettingRound, playerId);
  const moneyRemaining = game.players.find(({ id }) => id === playerId)?.money;
  const [amount, setAmount] = useState(amountToCall);

  const handleSubmit = () => {
    handleRaise(amount, placeBet, game, playerId);
    setShowRaiseDrawer(false);
  };

  return (
    <Drawer
      title="Raise"
      anchor={"bottom"}
      open={showRaiseDrawer}
      onClose={() => {
        setShowRaiseDrawer(false);
      }}
      variant="temporary"
      className="drawer"
    >
      <>
        <p>Raise by how much?</p>
        <div className="grid grid-cols-2 gap-4">
          <input
            value={amount}
            onChange={(e) => {
              setAmount(Math.round(parseFloat(e.target.value)));
            }}
            onKeyUp={(e) => {
              if (e.which === 13) {
                handleSubmit();
              }
            }}
            type="number"
            pattern="[0-9]"
            min={amountToCall}
            max={moneyRemaining}
            className="bg-white border border-gray-400 px-4"
            placeholder="Amount to raise"
            aria-label="Amount to raise"
            aria-describedby="basic-addon2"
            autoFocus
          />
          <button
            disabled={
              !!moneyRemaining &&
              (amount < amountToCall || amount > moneyRemaining)
            }
            className="bg-blue-500 mr-auto rounded-lg font-bold text-white text-center px-4 py-3 transition duration-300 ease-in-out hover:bg-blue-600"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
        {moneyRemaining && (
          <span
            style={{ cursor: "pointer" }}
            onClick={() => setAmount(moneyRemaining)}
            className="mt-2 text-white bg-blue-500 mr-auto px-4 rounded-2xl hover:bg-blue-600"
          >
            All in
          </span>
        )}
      </>
    </Drawer>
  );
};
