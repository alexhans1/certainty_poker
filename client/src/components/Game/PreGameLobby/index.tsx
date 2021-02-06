import React from "react";
import { FiCopy } from "react-icons/fi";
import PlayerSpot from "./PlayerSpot";
import { Game, Player } from "../../../interfaces";
import { ButtonLink } from "../../base/Button";
import StartGameButton, { StartGame } from "./StartGameButton";
import NameInputDrawer, { CreatePlayer } from "../NameInputDrawer";

interface Props {
  players: Player[];
  gameLink: string;
  startGame: StartGame;
  gameId: Game["id"];
  createPlayer: CreatePlayer;
  playerId?: Player["id"];
}

export const maxNumberOfPlayers = 12;

function PreGameLobby({
  players,
  gameLink,
  startGame,
  gameId,
  createPlayer,
  playerId,
}: Props) {
  console.log("playerId", playerId);
  return (
    <>
      <div className="flex flex-col items-center font-semibold mt-4 container px-5 mx-auto">
        <h5>Share this link with friends who want to join the game</h5>
        <div className="flex items-center justify-between w-full break-all px-4 md:px-10 py-4 mt-4 bg-gray-200 rounded-md">
          <span className="w-3/4">{gameLink}</span>
          <ButtonLink
            className="text-2xl"
            onClick={async () => {
              await navigator.clipboard.writeText(window.location.href);
            }}
          >
            <FiCopy />
          </ButtonLink>
        </div>
        <p className="mt-20 self-start">Players</p>
        <p className="text-xs font-normal self-start w-full pb-2 border-b-2 border-grey-200">
          {maxNumberOfPlayers - players.length} Open spot
          {maxNumberOfPlayers - players.length === 1 ? "" : "s"}
        </p>
        <hr />
        <div className="mt-8 grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {players.map((player) => (
            <PlayerSpot key={player.id} playerName={player?.name} />
          ))}
        </div>
        {playerId && (
          <div className="mt-16 self-start">
            <StartGameButton
              startGame={startGame}
              gameId={gameId}
              isDisabled={players.length <= 1}
            />
          </div>
        )}
      </div>
      <NameInputDrawer {...{ gameId, createPlayer, playerId }} />
    </>
  );
}

export default PreGameLobby;
