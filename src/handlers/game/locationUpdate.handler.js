import { getGameSession } from '../../session/game.session.js';
import { handleError } from '../../utils/error/errorHandler.js';
import CustomError from '../../utils/error/customError.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';

const locationUpdateHandler = ({ socket, userId, payload }) => {
  try {
    const { x, y } = payload;
    const gameInstance = getGameSession();

    if (!gameInstance) {
      throw new CustomError(ErrorCodes.GAME_NOT_FOUND, '게임 세션을 찾을 수 없습니다.');
    }

    // console.log('userId : ', userId);

    // console.log('get All Users Ids : ', gameInstance.getAllUserIds());

    const user = gameInstance.getUser(userId);
    // if (!user) {
    //   throw new CustomError(ErrorCodes.USER_NOT_FOUND, '유저를 찾을 수 없습니다.');
    // }

    user.updatePosition(x, y);
    const packet = gameInstance.getOthersLocation(userId);

    socket.write(packet);
  } catch (error) {
    handleError(socket, error);
  }
};

export default locationUpdateHandler;
