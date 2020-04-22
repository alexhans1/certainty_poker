import { gql } from "apollo-boost";

export const GET_GAME_BY_ID = gql`
  query findGame($gameId: ID!) {
    game(gameId: $gameId) {
      id
      questionRounds {
        id
        question {
          id
          hints
          answer
          question
        }
        foldedPlayerIds
        currentBettingRound
        bettingRounds {
          id
          currentPlayerId
          lastRaisedPlayerId
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
      currentQuestionRound
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
        id
        question {
          id
          hints
          answer
          question
        }
        foldedPlayerIds
        currentBettingRound
        bettingRounds {
          id
          currentPlayerId
          lastRaisedPlayerId
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
      currentQuestionRound
      players {
        id
        money
      }
      dealerId
    }
  }
`;
