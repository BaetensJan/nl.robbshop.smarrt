
const { BoundCluster } = require('zigbee-clusters');

class RobbScenesBoundCluster extends BoundCluster {

  constructor({
    onSceneRecall,
    onStoreScene
  }) {
    super();
    this._onSceneRecall = onSceneRecall;
    this._onStoreScene = onStoreScene;
  }

  async sceneRecall(payload) {
    if (typeof this._onSceneRecall === 'function') {
      this._onSceneRecall(payload);
    }
  }

  async storeScene(payload) {
    if (typeof this._onStoreScene === 'function') {
      this._onStoreScene(payload);
    }
  }
}

module.exports = RobbScenesBoundCluster;