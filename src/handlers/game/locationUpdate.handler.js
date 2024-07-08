import { getGameSession } from '../../session/game.session.js';
import { handleError } from '../../utils/error/errorHandler.js';
import CustomError from '../../utils/error/customError.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';

const locationUpdateHandler = async ({ socket, userId, payload }) => {
  try {
    const { x, y, inputX, inputY, speed } = payload;
    const gameInstance = getGameSession();

    if (!gameInstance) {
      throw new CustomError(ErrorCodes.GAME_NOT_FOUND, '게임 세션을 찾을 수 없습니다.');
    }

    const user = gameInstance.getUser(userId);

    user.updatePosition(x, y, inputX, inputY, speed);
    const packet = gameInstance.getOthersLocation(userId);

    // console.log(gameInstance.getAllUserIds());

    socket.write(packet);
  } catch (error) {
    handleError(socket, error);
  }
};

export default locationUpdateHandler;
