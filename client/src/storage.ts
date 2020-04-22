const PLAYER_ID_KEY = "player_id";

export const setPlayerIdToStorage = (gameId: string, playerId: string) => {
  sessionStorage.setItem(`${PLAYER_ID_KEY}_${gameId}`, playerId);
};

export const getPlayerIdFromStorage = (gameId: string) =>
  sessionStorage.getItem(`${PLAYER_ID_KEY}_${gameId}`);
