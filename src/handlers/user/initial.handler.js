import { addUser, getUserById } from '../../session/user.session.js';
import { HANDLER_IDS, RESPONSE_SUCCESS_CODE } from '../../constants/handlerIds.js';
import { createResponse } from '../../utils/response/createResponse.js';
import { handleError } from '../../utils/error/errorHandler.js';
import { getGameSession } from '../../session/game.session.js';
import CustomError from '../../utils/error/customError.js';
import { createUser, findUserByDeviceID, updateUserLogin } from '../../db/user/user.db.js';

const initialHandler = async ({ socket, userId, payload }) => {
  try {
    let { deviceId, latency } = payload;

    let userDB = await findUserByDeviceID(deviceId);
    if (!userDB) {
      userDB = await createUser(deviceId);
      console.log('새로운 유저가 DB에 등록되었습니다.');
    } else {
      await updateUserLogin(userDB.id);
      console.log('기존 유저 정보를 불러옵니다.');
    }

    // 유저 세션 저장
    addUser(socket, deviceId, userDB.playerId, latency);

    const gameInstance = getGameSession();

    if (!gameInstance) {
      throw new CustomError(ErrorCodes.GAME_NOT_FOUND, '게임 세션을 찾을 수 없습니다.');
    }

    const user = getUserById(deviceId);
    if (!user) {
      throw new CustomError(ErrorCodes.USER_NOT_FOUND, '유저를 찾을 수 없습니다.');
    }

    const existUser = gameInstance.getUser(user.id);
    if (!existUser) {
      gameInstance.addUser(user);
    }

    const x = userDB.lastPositionX;
    const y = userDB.lastPositionY;
    const playerId = userDB.playerId;
    // 유저 정보 응답 생성
    const initialResponse = createResponse(
      HANDLER_IDS.INITIAL,
      RESPONSE_SUCCESS_CODE,
      { x, y, playerId },
      deviceId,
    );

    // 소켓을 통해 클라이언트에게 응답 메시지 전송
    socket.write(initialResponse);
  } catch (error) {
    handleError(socket, error);
  }
};

export default initialHandler;
