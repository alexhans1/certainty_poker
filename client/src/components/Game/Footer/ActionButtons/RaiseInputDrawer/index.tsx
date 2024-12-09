import React, { useState } from "react";
import Drawer from "../../../../shared/Drawer";
import { BettingRound, Player } from "../../../../../interfaces";
import { calculateAmountToCall, PlaceBet, raise } from "../../../helpers";
import { useGame } from "../../../Context";

interface Props {
  currentBettingRound: BettingRound;
  handleRaise: typeof raise;
  placeBet: PlaceBet;
  playerId: Player["id"];
  showRaiseDrawer: boolean;
  setShowRaiseDrawer: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function RaiseInputDrawer({
  currentBettingRound,
  handleRaise,
  placeBet,
  playerId,
  showRaiseDrawer,
  setShowRaiseDrawer,
}: Props) {
  const { game } = useGame();
  if (!game) {
    throw new Error("Game not found");
  }

  const amountToCall = calculateAmountToCall(currentBettingRound, playerId);
  const moneyRemaining = game.players.find(({ id }) => id === playerId)?.money;
  const [amount, setAmount] = useState(amountToCall);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    await handleRaise(amount, placeBet, game, playerId);
    setShowRaiseDrawer(false);
    setLoading(false);
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
              loading ||
              (!!moneyRemaining &&
                (amount < amountToCall || amount > moneyRemaining))
            }
            className="bg-blue-500 mr-auto rounded-lg font-bold text-white text-center px-4 py-3 transition duration-300 ease-in-out hover:bg-blue-600"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
        <div className="flex">
          {moneyRemaining && (
            <>
              {[5, 10, 20, 50]
                .filter((amount) => amount < moneyRemaining)
                .map((amount) => (
                  <span
                    key={amount}
                    style={{ cursor: "pointer" }}
                    onClick={() => setAmount(amount)}
                    className="mt-2 text-white bg-blue-500 mr-2 px-4 rounded-2xl hover:bg-blue-600"
                  >
                    {amount}
                  </span>
                ))}
              <span
                style={{ cursor: "pointer" }}
                onClick={() => setAmount(moneyRemaining)}
                className="mt-2 text-white bg-blue-500 mr-2 px-4 rounded-2xl hover:bg-blue-600"
              >
                All in
              </span>
            </>
          )}
        </div>
      </>
    </Drawer>
  );
}
