import { gameSessions } from './sessions.js';
import Game from '../classes/models/game.class.js';
import { GAME_SESSION_ID } from '../constants/gameSessionId.js';

export const addGameSession = () => {
  const session = new Game(GAME_SESSION_ID);
  gameSessions.push(session);
  session.startGame();
  console.log(`게임이 생성되었습니다.`);
  return session;
};

export const removeGameSession = () => {
  const index = gameSessions.findIndex((session) => session.id === GAME_SESSION_ID);
  if (index !== -1) {
    return gameSessions.splice(index, 1)[0];
  }
};

export const getGameSession = () => {
  return gameSessions.find((session) => session.id === GAME_SESSION_ID);
};

export const getAllGameSessions = () => {
  return gameSessions;
};
