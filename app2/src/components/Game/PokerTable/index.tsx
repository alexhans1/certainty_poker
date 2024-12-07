import PlayerComp from "./Player";
import Pot from "./Pot";
import Question from "../Question";
import {
  BettingRound,
  Game,
  Player,
  QuestionRound,
  QuestionTypes,
} from "../../../interfaces";
import { hasPlayerFolded, haveAllPlayersPlacedTheirGuess } from "../helpers";
import GuessMap from "../GuessMap";
import MultipleChoiceOptions from "../MultipleChoiceOptions";

import "./styles.css";
import { getWinningPlayerArray } from "./helpers";
import { maxNumberOfPlayers } from "../PreGameLobby";
interface Props {
  game: Game;
  usedQuestionRound: QuestionRound;
  currentBettingRound?: BettingRound;
  playerId?: Player["id"];
  isSpectator: boolean;
}

const PokerTable = ({
  game,
  usedQuestionRound,
  currentBettingRound,
  playerId,
  isSpectator,
}: Props) => {
  const isGeoQuestion = usedQuestionRound?.question.type === QuestionTypes.GEO;
  const isMultipleChoiceQuestion =
    usedQuestionRound?.question.type === QuestionTypes.MULTIPLE_CHOICE;
  const allPlayersPlacedTheirGuess =
    usedQuestionRound &&
    game.players &&
    haveAllPlayersPlacedTheirGuess(usedQuestionRound, game.players);
  const winningPlayerIds = getWinningPlayerArray(game) || [];

  return (
    <div className="flex flex-col items-center">
      {isGeoQuestion && (
        <Question
          {...{
            game,
            usedQuestionRound,
          }}
        />
      )}
      <div className="relative w-full md:w-4/5 my-6">
        <div
          className={`poker-table ${
            isGeoQuestion ? "md:p-0 md:overflow-hidden" : "md:px-48 md:py-24"
          } rounded-full flex md:justify-center flex-col-reverse md:flex-col md:items-center md:w-full md:border-8 md:border-white md:shadow-xl`}
        >
          <div className="grid gap-y-6 mt-7 px-5 md:mt-0 md:px-0">
            {game.players.map((player, index) => {
              const { changeInMoney } =
                usedQuestionRound.results?.find(
                  ({ playerId }) => player.id === playerId
                ) || {};
              const hasFolded = !!(
                usedQuestionRound &&
                hasPlayerFolded(usedQuestionRound, player.id)
              );
              const guess = usedQuestionRound.guesses.find(
                (g) => g.playerId === player.id
              );
              return (
                <PlayerComp
                  key={player.id}
                  {...{
                    gameId: game.id,
                    player,
                    index,
                    numberOfPlayers: game.players.length,
                    currentBettingRound,
                    changeInMoney,
                    isAppPlayer: player.id === playerId,
                    isTurnPlayer:
                      player.id === currentBettingRound?.currentPlayer.id,
                    isQuestionRoundOver: !!usedQuestionRound?.isOver,
                    isShowdown: !!usedQuestionRound?.isShowdown,
                    hasFolded,
                    isSpectator,
                    allPlayersPlacedTheirGuess,
                    guess,
                    question: usedQuestionRound.question,
                    isWinningPlayer: winningPlayerIds.includes(player.id),
                    isGameOver: game.isOver,
                    isRevealingGuess:
                      usedQuestionRound.revealedGuesses.includes(player.id),
                  }}
                />
              );
            })}
          </div>
          <div className="flex flex-col gap-2 justify-center items-center w-full h-full">
            {!isGeoQuestion && (
              <div>
                <Pot
                  usedQuestionRound={usedQuestionRound}
                  isGameFull={game.players.length === maxNumberOfPlayers}
                />
                <Question
                  {...{
                    game,
                    usedQuestionRound,
                  }}
                />
              </div>
            )}
            {isGeoQuestion && (
              <div className="flex flex-col-reverse w-full">
                <GuessMap
                  {...{
                    usedQuestionRound,
                    isSpectator,
                    playerId,
                    players: game.players,
                    className: "map",
                  }}
                />
                <Pot
                  usedQuestionRound={usedQuestionRound}
                  isGameFull={game.players.length === maxNumberOfPlayers}
                />
              </div>
            )}
            {isMultipleChoiceQuestion && (
              <MultipleChoiceOptions
                {...{
                  usedQuestionRound,
                  alternatives:
                    usedQuestionRound?.question.alternatives?.map((alt) => ({
                      value: alt,
                      active:
                        !usedQuestionRound.question.hiddenAlternatives?.includes(
                          alt
                        ),
                    })) || [],
                  guess: usedQuestionRound?.guesses.find(
                    (g) => g.playerId === playerId
                  )?.guess.numerical,
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PokerTable;
