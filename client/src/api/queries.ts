import { gql } from "apollo-boost";
import { Game, Player } from "../interfaces";

export const CREATE_GAME_QUERY = gql`
  mutation createGame($setNames: [String!]!) {
    createGame(setNames: $setNames) {
      id
    }
  }
`;

export const UPLOAD_QUESTION_SET = gql`
  mutation uploadQuestions(
    $questions: [QuestionInput!]!
    $setName: String!
    $isPrivate: Boolean!
    $language: String!
  ) {
    uploadQuestions(
      questions: $questions
      setName: $setName
      isPrivate: $isPrivate
      language: $language
    )
  }
`;

export const GET_SETS_QUERY = gql`
  query sets($setName: String) {
    sets(setName: $setName) {
      setName
      numberOfQuestions
      language
    }
  }
`;

export const GET_GAME_BY_ID = gql`
  query findGame($gameId: ID!) {
    game(gameId: $gameId) {
      id
      setNames
      questionRounds {
        question {
          id
          hints
          answer {
            numerical
            geo {
              latitude
              longitude
              toleranceRadius
            }
          }
          alternatives
          hiddenAlternatives
          question
          explanation
          type
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
          guess {
            numerical
            geo {
              latitude
              longitude
            }
          }
          playerId
          difference
        }
        results {
          playerId
          changeInMoney
        }
        isOver
        isShowdown
      }
      players {
        id
        money
        name
        isDead
        bettingState
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
  subscription GameUpdated($gameId: ID!, $hash: String!) {
    gameUpdated(gameId: $gameId, hash: $hash) {
      id
      setNames
      questionRounds {
        question {
          id
          hints
          answer {
            numerical
            geo {
              latitude
              longitude
              toleranceRadius
            }
          }
          alternatives
          hiddenAlternatives
          question
          explanation
          type
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
          guess {
            numerical
            geo {
              latitude
              longitude
            }
          }
          playerId
          difference
        }
        results {
          playerId
          changeInMoney
        }
        isOver
        isShowdown
      }
      players {
        id
        money
        name
        isDead
        bettingState
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
    startGame(gameId: $gameId)
  }
`;

export const PLACE_BET = gql`
  mutation placeBet($input: BetInput!) {
    placeBet(input: $input)
  }
`;

export const ADD_GUESS = gql`
  mutation addGuess($input: GuessInput!) {
    addGuess(input: $input)
  }
`;

export interface RemovePlayerVariables {
  gameId: Game["id"];
  playerId: Player["id"];
}
export const REMOVE_PLAYER = gql`
  mutation removePlayer($gameId: ID!, $playerId: ID!) {
    removePlayer(gameId: $gameId, playerId: $playerId)
  }
`;
