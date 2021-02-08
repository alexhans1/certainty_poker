import React, { useState } from "react";
import Drawer from "../../Drawer";
import { Game, Player } from "../../../interfaces";

type CreatePlayer = ({
  variables: {
    input: { gameId, playerName },
  },
}: {
  variables: { input: { gameId: Game["id"]; playerName: Player["name"] } };
}) => void;

interface Props {
  createPlayer: CreatePlayer;
  gameId: Game["id"];
  playerId?: Player["id"];
}

export default ({ createPlayer, gameId, playerId }: Props) => {
  const [name, setName] = useState("");

  const handleSubmit = () => {
    if (!playerId) {
      createPlayer({ variables: { input: { gameId, playerName: name } } });
    }
  };

  return (
    <Drawer
      title="Your avatar"
      anchor={"bottom"}
      open={!playerId}
      variant="persistent"
      className="drawer"
    >
      <>
        <p>Use an emoji or your initials as your avatar</p>
        <div className="input-group mb-3">
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
            className="form-control form-control-lg"
            placeholder="Type an emoji or letter"
            aria-label="Your answer"
            aria-describedby="basic-addon2"
            autoFocus
          />
          <div className="input-group-append">
            <button
              type="submit"
              disabled={!name.length}
              className="btn btn-primary"
              onClick={handleSubmit}
            >
              ⮑
            </button>
          </div>
        </div>
      </>
    </Drawer>
  );
};
