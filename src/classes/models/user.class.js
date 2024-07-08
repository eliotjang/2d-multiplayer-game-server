import { createPingPacket } from '../../utils/notification/game.notification.js';

class User {
  constructor(id, socket, playerId, latency) {
    this.id = id;
    this.socket = socket;
    this.playerId = playerId;
    this.latency = latency;
    this.x = 0;
    this.y = 0;
    this.inputX = 0;
    this.inputY = 0;
    this.speed = 3;
    this.lastUpdateTime = Date.now();
  }

  updatePosition(x, y, inputX, inputY, speed) {
    this.x = x;
    this.y = y;
    this.inputX = inputX;
    this.inputY = inputY;
    this.speed = speed;
    this.lastUpdateTime = Date.now();
  }

  ping() {
    const now = Date.now();

    // console.log(`${this.id}: ping`);
    this.socket.write(createPingPacket(now));
  }

  handlePong(data) {
    const now = Date.now();
    this.latency = (now - data.timestamp) / 2;
    // console.log(`Received pong from user ${this.id} at ${now} with latency ${this.latency}ms`);
  }

  // 추측항법을 사용하여 위치를 추정하는 메서드
  calculatePosition(latency) {
    if (this.inputX === 0 && this.inputY === 0) {
      return { x: this.x, y: this.y };
    }

    const timeDiff = latency / 1000;
    const angle = Math.atan2(this.inputY, this.inputX);
    const distance = this.speed * timeDiff;

    // x, y 축에서 이동한 거리 계산
    return {
      x: this.x + Math.cos(angle) * distance,
      y: this.y + Math.sin(angle) * distance,
    };
  }
}

export default User;
