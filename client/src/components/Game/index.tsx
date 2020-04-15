import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";

const styles = { playersContainer: { padding: 10 } };

const query = gql`
  {
    players {
      id
      name
      remaining_money
    }
  }
`;

interface Player {
  id: string;
  name: string;
  remaining_money: number;
}

function App() {
  const { game_id } = useParams();
  const { data, error, loading } = useQuery<{ players: Player[] }>(query);
  console.log("data", data);

  if (loading || !data) return <p>Loading...</p>;
  if (error) return <p>Error: {error?.message}</p>;

  const { players } = data;

  return (
    <div>
      <p>Players:</p>
      {players.map(({ name, remaining_money }) => (
        <div style={styles.playersContainer}>
          <div>Name: {name}</div>
          <div>Remaining money: {remaining_money}</div>
        </div>
      ))}
    </div>
  );
}

export default App;
