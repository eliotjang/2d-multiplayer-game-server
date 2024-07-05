import { findUserByDeviceID, updateLastPosition } from '../db/user/user.db.js';
import { getGameSession } from '../session/game.session.js';
import { getUserBySocket, removeUser } from '../session/user.session.js';

export const onEnd = (socket) => async () => {
  const user = getUserBySocket(socket);

  await updateLastPosition(user.x, user.y, user.id);

  console.log('x, y, id : ', user.x, user.y, user.id);
  let userDB = await findUserByDeviceID(user.id);
  console.log('userDB device ID : ', userDB.deviceId);

  removeUser(socket);

  const gameInstance = getGameSession();
  gameInstance.removeUser(user.id);

  console.log('클라이언트 연결이 종료되었습니다.');
};
