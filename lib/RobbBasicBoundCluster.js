'use strict';
const { BoundCluster } = require('zigbee-clusters');

class BasicBoundCluster extends BoundCluster {

  constructor({
    onToggleAwayHome,
  }) {
    super();
    this._onToggleAwayHome = onToggleAwayHome;
  }

  toggleAwayHome() {
    if (typeof this._onToggleAwayHome === 'function') {
      this._onToggleAwayHome();
    }
  }
}

module.exports = BasicBoundCluster;