import { FiCopy } from "react-icons/fi";
import { Game, Player } from "../../../interfaces";
import NameInputDrawer, { CreatePlayer } from "../NameInputDrawer";
import PlayerSpot from "./PlayerSpot";
import StartGameButton, { StartGame } from "./StartGameButton";

interface Props {
  players: Player[];
  gameLink: string;
  startGame: StartGame;
  gameId: Game["id"];
  createPlayer: CreatePlayer;
  playerId?: Player["id"];
  setNames: Game["setNames"];
}

export const maxNumberOfPlayers = 12;

function PreGameLobby({
  players,
  gameLink,
  startGame,
  gameId,
  createPlayer,
  playerId,
  setNames,
}: Props) {
  return (
    <>
      <div className="flex flex-col items-center font-semibold mt-4 px-5 mx-auto md:max-w-screen-md">
        <h5>Share this link with friends who want to join the game</h5>
        <div className="flex items-center justify-between w-full break-all px-4 md:px-10 py-4 mt-4 bg-gray-200 rounded-md">
          <span className="w-3/4">{gameLink}</span>
          <button
            className="text-blue-500 hover:text-blue-600 p-2 ripple focus:outline-none text-2xl"
            onClick={async () => {
              await navigator.clipboard.writeText(window.location.href);
            }}
          >
            <FiCopy />
          </button>
        </div>
        <h4 className="mt-4 self-start text-lg">
          Question Set{setNames.length > 1 ? "s" : ""}: {setNames.join(", ")}
        </h4>
        <p className="mt-20 self-start">Players</p>
        <p className="text-xs font-normal self-start w-full pb-2 border-b-2 border-grey-200">
          {maxNumberOfPlayers - players.length} Open spot
          {maxNumberOfPlayers - players.length === 1 ? "" : "s"}
        </p>
        <hr />
        <div className="mt-8 grid gap-8 w-full sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {players.map((player) => (
            <PlayerSpot key={player.id} playerName={player?.name} />
          ))}
        </div>
        {playerId && (
          <div className="mt-16 self-start">
            <StartGameButton
              startGame={startGame}
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
