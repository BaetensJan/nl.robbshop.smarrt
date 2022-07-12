'use strict';
const { BoundCluster } = require('zigbee-clusters');

class LevelControlBoundCluster extends BoundCluster {

  constructor({
    onStepWithOnOff,
    onStopWithOnOff,
    onMoveWithOnOff,
  }) {
    super();
    this._onStepWithOnOff = onStepWithOnOff;
    this._onStopWithOnOff = onStopWithOnOff;
    this._onMoveWithOnOff = onMoveWithOnOff;
  }

  stepWithOnOff(payload) {
    if (typeof this._onStepWithOnOff === 'function') {
      this._onStepWithOnOff(payload);
    }
  }

  stopWithOnOff() {
    if (typeof this._onStopWithOnOff === 'function') {
      this._onStopWithOnOff();
    }
  }

  moveWithOnOff(payload) {
    if (typeof this._onMoveWithOnOff === 'function') {
      this._onMoveWithOnOff(payload);
    }
  }

}

module.exports = LevelControlBoundCluster;