import { removeUser } from '../session/user.session.js';
import CustomError from '../utils/error/customError.js';
import { handleError } from '../utils/error/errorHandler.js';

export const onError = (socket) => (err) => {
  try {
    console.error('소켓 오류:', err);
    const user = getUserBySocket(socket);
    const gameInstance = getGameSession();
    gameInstance.removeUser(user.id);
    // 세션에서 유저 삭제
    removeUser(socket);
  } catch (error) {
    handleError(socket, new CustomError(500, `소켓 오류: ${err.message}`));
  }
};
