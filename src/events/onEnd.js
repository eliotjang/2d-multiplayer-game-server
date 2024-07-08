import { findUserByDeviceID, updateLastPosition } from '../db/user/user.db.js';
import { getGameSession } from '../session/game.session.js';
import { getUserBySocket, removeUser } from '../session/user.session.js';
import { handleError } from '../utils/error/errorHandler.js';

export const onEnd = (socket) => async () => {
  try {
    const user = getUserBySocket(socket);

    await updateLastPosition(user.x, user.y, user.id);

    console.log('x, y, id : ', user.x, user.y, user.id);
    let userDB = await findUserByDeviceID(user.id);
    console.log('userDB device ID : ', userDB.deviceId);

    const gameInstance = getGameSession();
    gameInstance.removeUser(user.id);

    removeUser(socket);

    console.log('클라이언트 연결이 종료되었습니다.');
  } catch (error) {
    handleError(socket, error);
  }
};
