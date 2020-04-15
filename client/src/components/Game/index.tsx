import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";

const styles = { playersContainer: { padding: 10 } };

const query = gql`
  {
    games {
      id
      questionRounds {
        question {
          question
        }
        bettingRounds {
          foldedPlayerIds
          currentPlayerId
          lastRaisedPlayerId
          bets {
            amount
            playerId
          }
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

interface Game {
  id: string;
  name: string;
  remaining_money: number;
}

function App() {
  const { game_id } = useParams();
  const { data, error, loading } = useQuery<{ games: any[] }>(query);
  console.log("data", data);

  if (loading || !data) return <p>Loading...</p>;
  if (error) return <p>Error: {error?.message}</p>;

  const { games } = data;

  return (
    <div>
      <p>Players:</p>
      {games.map(({ id, dealerId }) => (
        <div style={styles.playersContainer}>
          <div>Name: {id}</div>
          <div>Remaining money: {dealerId}</div>
        </div>
      ))}
    </div>
  );
}

export default App;
