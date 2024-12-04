import { useState } from "react";
import Drawer from "../../shared/Drawer";
import { Game, Player } from "../../../interfaces";

export type CreatePlayer = (gameId: string, playerName: string) => void;

interface Props {
  createPlayer: CreatePlayer;
  gameId: Game["id"];
  playerId?: Player["id"];
}

export default function NameInputDrawer({
  createPlayer,
  gameId,
  playerId,
}: Props) {
  const [name, setName] = useState("");

  const handleSubmit = () => {
    if (!playerId) {
      createPlayer(gameId, name);
    }
  };

  return (
    <Drawer
      title="Your name"
      anchor={"bottom"}
      open={!playerId}
      variant="temporary"
    >
      <>
        <p className="font-bold">Enter your name</p>
        <p className="mt-4 text-sm">Username</p>

        <div className="grid grid-cols-2 gap-4">
          <input
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
            onKeyUp={(e) => {
              if (e.which === 13) {
                handleSubmit();
              }
            }}
            type="text"
            className="bg-white border border-gray-400 px-4"
            placeholder="Your name"
            aria-label="Your answer"
            aria-describedby="basic-addon2"
            autoFocus
          />
          <button
            type="submit"
            disabled={!name.length}
            className="bg-blue-500 mr-auto rounded-lg font-bold text-white text-center px-4 py-3 transition duration-300 ease-in-out hover:bg-blue-600"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      </>
    </Drawer>
  );
}
