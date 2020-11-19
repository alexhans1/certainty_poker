const PLAYER_ID_KEY = "player_id";
const FINGERPRINT_KEY = "fingerprint";

export const setPlayerIdToStorage = (gameId: string, playerId: string) => {
  localStorage.setItem(`${PLAYER_ID_KEY}_${gameId}`, playerId);
};

export const getPlayerIdFromStorage = (gameId: string) =>
  localStorage.getItem(`${PLAYER_ID_KEY}_${gameId}`);

export const deletePlayerIdFromStorage = (gameId: string) =>
  localStorage.removeItem(`${PLAYER_ID_KEY}_${gameId}`);

export const setFingerprintToStorage = (gameId: string) => {
  const value = Math.random().toString(36).substring(2);
  localStorage.setItem(`${FINGERPRINT_KEY}_${gameId}`, value);
  return value;
};

export const getFingerprintFromStorage = (gameId: string) =>
  localStorage.getItem(`${FINGERPRINT_KEY}_${gameId}`);
