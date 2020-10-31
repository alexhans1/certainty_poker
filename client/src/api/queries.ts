import { gql } from "apollo-boost";

export const GET_GAME_BY_ID = gql`
  query findGame($gameId: ID!) {
    game(gameId: $gameId) {
      id
      questionRounds {
        question {
          id
          hints
          answer
          question
        }
        foldedPlayerIds
        bettingRounds {
          currentPlayer {
            id
          }
          bets {
            amount
            playerId
          }
        }
        guesses {
          guess
          playerId
        }
      }
      players {
        id
        money
        name
      }
      dealerId
      questions {
        id
      }
      isOver
    }
  }
`;

export const SUBSCRIBE_TO_GAME_BY_ID = gql`
  subscription GameUpdated($gameId: ID!) {
    gameUpdated(gameId: $gameId) {
      id
      questionRounds {
        question {
          id
          hints
          answer
          question
        }
        foldedPlayerIds
        bettingRounds {
          currentPlayer {
            id
          }
          bets {
            amount
            playerId
          }
        }
        guesses {
          guess
          playerId
        }
      }
      players {
        id
        money
        name
      }
      dealerId
      questions {
        id
      }
      isOver
    }
  }
`;

export const CREATE_PLAYER = gql`
  mutation addPlayer($input: PlayerInput!) {
    addPlayer(input: $input) {
      id
      money
      name
    }
  }
`;

export const START_GAME = gql`
  mutation startGame($gameId: ID!) {
    startGame(gameId: $gameId) {}
  }
`;

export const PLACE_BET = gql`
  mutation placeBet($input: BetInput!) {
    placeBet(input: $input) {}
  }
`;

export const ADD_GUESS = gql`
  mutation addGuess($input: GuessInput!) {
    addGuess(input: $input) {}
  }
`;
