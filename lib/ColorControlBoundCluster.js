'use strict';
const { BoundCluster } = require('zigbee-clusters');

class ColorControlBoundCluster extends BoundCluster {
//moveToColor
//moveToColorTemperature
  constructor({
    onMoveToColor,
    onMoveToColorTemperature,
  }) {
    super();
    this._onMoveToColor = onMoveToColor;
    this._onMoveToColorTemperature = onMoveToColorTemperature;
  }

  moveToColor(payload) {
    if (typeof this._onMoveToColor === 'function') {
      this._onMoveToColor(payload);
    }
  }

  moveToColorTemperature(payload) {
    if (typeof this._onMoveToColorTemperature === 'function') {
      this._onMoveToColorTemperature(payload);
    }
  }

}

module.exports = ColorControlBoundCluster;