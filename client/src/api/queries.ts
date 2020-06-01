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
      }
      dealerId
    }
  }
`;

export const CREATE_PLAYER = gql`
  mutation addPlayer($gameId: ID!) {
    addPlayer(gameId: $gameId) {
      id
      money
    }
  }
`;

export const START_GAME = gql`
  mutation startGame($gameId: ID!) {
    startGame(gameId: $gameId) {
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
      }
      dealerId
    }
  }
`;

export const PLACE_BET = gql`
  mutation placeBet($input: BetInput!) {
    placeBet(input: $input) {
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
      }
      dealerId
    }
  }
`;

export const ADD_GUESS = gql`
  mutation addGuess($input: GuessInput!) {
    addGuess(input: $input) {
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
      }
      dealerId
    }
  }
`;
