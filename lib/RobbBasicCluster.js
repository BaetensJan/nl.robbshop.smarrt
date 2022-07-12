'use strict';
const { BasicCluster, ZCLDataTypes } = require('zigbee-clusters');

class RobbBasicCluster extends BasicCluster {
  // Here we override the `COMMANDS` getter from the `ScenesClusters` by
  // extending it with the custom command we'd like to implement `ikeaSceneMove`.
  static get COMMANDS() {
    return {
      ...super.COMMANDS,
      toggleAwayHome: {
        id: 0x02,
      },
    };
  }

  // It is also possible to implement manufacturer specific attributes, but beware, do not mix
  // these with regular attributes in one command (e.g. `Cluster#readAttributes` should be
  // called with only manufacturer specific attributes or only with regular attributes).
  static get ATTRIBUTES() {
    return {
      ...super.ATTRIBUTES,
    };
  }
}

module.exports = RobbBasicCluster;