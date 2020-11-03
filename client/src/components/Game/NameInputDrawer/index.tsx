import React, { useState } from "react";
import Drawer from "../../Drawer";
import { Game, Player } from "../../../interfaces";

const emojiRegex = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;

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
    createPlayer({ variables: { input: { gameId, playerName: name } } });
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
              const newName = e.target.value;
              const match = newName.match(emojiRegex);
              setName(match ? newName : newName.substring(0, 2));
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
