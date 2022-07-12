'use strict';
const { ScenesCluster, ZCLDataTypes } = require('zigbee-clusters');

class RobbScenesCluster extends ScenesCluster {
  // Here we override the `COMMANDS` getter from the `ScenesClusters` by
  // extending it with the custom command we'd like to implement `ikeaSceneMove`.
  static get COMMANDS() {
    return {
      ...super.COMMANDS,
      storeScene: {
        id: 0x04,
        args: {
          groupID: ZCLDataTypes.uint16,
          sceneID: ZCLDataTypes.uint8,
        },
      },
      sceneRecall: {
        id: 0x05,
        args: {
          groupID: ZCLDataTypes.uint16,
          sceneID: ZCLDataTypes.uint8,
        },
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

module.exports = RobbScenesCluster;