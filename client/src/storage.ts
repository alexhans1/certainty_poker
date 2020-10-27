const PLAYER_ID_KEY = "player_id";

export const setPlayerIdToStorage = (gameId: string, playerId: string) => {
  localStorage.setItem(`${PLAYER_ID_KEY}_${gameId}`, playerId);
};

export const getPlayerIdFromStorage = (gameId: string) =>
  localStorage.getItem(`${PLAYER_ID_KEY}_${gameId}`);
