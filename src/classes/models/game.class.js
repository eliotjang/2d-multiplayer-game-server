import { createLocationUpdatePacket } from '../../utils/notification/game.notification.js';
import IntervalManager from '../managers/interval.manager.js';

const MAX_PLAYERS = 30;

class Game {
  constructor(id) {
    this.id = id;
    this.users = [];
    this.intervalManager = new IntervalManager();
    this.state = 'waiting'; // 'waiting', 'inProgress'
  }

  addUser(user) {
    if (this.users.length > MAX_PLAYERS) {
      throw new Error('Game session is full');
    }
    this.users.push(user);

    this.intervalManager.addPlayer(user.id, user.ping.bind(user), 10000);
  }

  getUser(userId) {
    return this.users.find((user) => user.id === userId);
  }

  getAllUserIds() {
    return this.users.map((user) => user.id);
  }

  removeUser(userId) {
    this.users = this.users.filter((user) => user.id !== userId);
    console.log(this.getAllUserIds());
    this.intervalManager.removePlayer(userId);
  }

  startGame() {
    this.state = 'inProgress';
    // 게임 시작 시 모든 유저에게 패킷 전송 필요한지 확인 필요
  }

  // Legacy code
  getAllLocation() {
    const locationData = this.users.map((user) => {
      return { id: user.id, playerId: user.playerId, x: user.x, y: user.y };
    });
    return createLocationUpdatePacket(locationData);
  }

  getOthersLocation(userId) {
    let locationData = [];
    const maxLatency = this.getMaxLatency();
    this.users.forEach((user) => {
      if (user.id !== userId) {
        const { x, y } = user.calculatePosition(maxLatency);
        // const x = user.x;
        // const y = user.y;
        locationData.push({ id: user.id, playerId: user.playerId, x, y });
      }
    });

    return createLocationUpdatePacket(locationData, maxLatency);
  }

  getMaxLatency() {
    let maxLatency = 0;
    this.users.forEach((user) => {
      maxLatency = Math.max(maxLatency, user.latency);
    });
    return maxLatency;
  }
}

export default Game;
