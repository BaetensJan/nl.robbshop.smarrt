const { ZigBeeDevice } = require("homey-zigbeedriver");
const { debug, Cluster, CLUSTER } = require("zigbee-clusters");

const RobbBasicCluster = require("../../lib/RobbBasicCluster");
const RobbScenesCluster = require('../../lib/RobbScenesCluster');

const OnOffBoundCluster = require('../../lib/OnOffBoundCluster');
const RobbBasicBoundCluster = require("../../lib/RobbBasicBoundCluster");
const RobbScenesBoundCluster = require("../../lib/RobbScenesBoundCluster");
const LevelControlBoundCluster = require("../../lib/LevelControlBoundCluster");
const ColorControlBoundCluster = require("../../lib/ColorControlBoundCluster");

// Enable debug logging of all relevant Zigbee communication
debug(true);

Cluster.addCluster(RobbBasicCluster);
Cluster.addCluster(RobbScenesCluster);

class Device extends ZigBeeDevice {
  onNodeInit({ zclNode }) {
    this.enableDebug();
    // this.printNode();


    for (let i=1; i<=3; i++ ) {
      // Bind on/off button commands
      zclNode.endpoints[i].bind(CLUSTER.ON_OFF.NAME, new OnOffBoundCluster({
        onSetOff: this._onOffCommandHandler.bind(this, `power_${i}`),
        onSetOn: this._onOffCommandHandler.bind(this, `power_${i}`),
      }));

      // Bind away home button commands
      zclNode.endpoints[i].bind(CLUSTER.BASIC.NAME, new RobbBasicBoundCluster({
        onToggleAwayHome: this._onToggleAwayHome.bind(this, `toggleAwayHome_${i}`),
      }));
    }
        
    // Bind brightness step button commands
    zclNode.endpoints[1].bind(CLUSTER.COLOR_CONTROL.NAME, new ColorControlBoundCluster({
      onMoveToColor: this._onMoveToColorOne.bind(this),
      onMoveToColorTemperature: this._onMoveToColorTemperatureOne.bind(this),
    }));

    // Bind brightness step button commands
    zclNode.endpoints[2].bind(CLUSTER.COLOR_CONTROL.NAME, new ColorControlBoundCluster({
      onMoveToColor: this._onMoveToColorTwo.bind(this),
      onMoveToColorTemperature: this._onMoveToColorTemperatureTwo.bind(this),
    }));

    // Bind brightness step button commands
    zclNode.endpoints[3].bind(CLUSTER.COLOR_CONTROL.NAME, new ColorControlBoundCluster({
      onMoveToColor: this._onMoveToColorThree.bind(this),
      onMoveToColorTemperature: this._onMoveToColorTemperatureThree.bind(this),
    }));

    // Bind brightness step button commands endpoint 1
    zclNode.endpoints[1].bind(CLUSTER.LEVEL_CONTROL.NAME, new LevelControlBoundCluster({
      onStepWithOnOff: this._onStepWithOnOffOne.bind(this),
      onMoveWithOnOff: this._onMoveWithOnOffOne.bind(this),
    }));

    // Bind brightness step button commands endpoint 2
    zclNode.endpoints[2].bind(CLUSTER.LEVEL_CONTROL.NAME, new LevelControlBoundCluster({
      onStepWithOnOff: this._onStepWithOnOffTwo.bind(this),
      onMoveWithOnOff: this._onMoveWithOnOffTwo.bind(this),
    }));

    // Bind brightness step button commands endpoint 3
    zclNode.endpoints[3].bind(CLUSTER.LEVEL_CONTROL.NAME, new LevelControlBoundCluster({
      onStepWithOnOff: this._onStepWithOnOffThree.bind(this),
      onMoveWithOnOff: this._onMoveWithOnOffThree.bind(this),
    }));

    // Bind scene button commands endpoint 1
    zclNode.endpoints[1].bind(CLUSTER.SCENES.NAME, new RobbScenesBoundCluster({
      onSceneRecall: this._onSceneRecallEndpointOne.bind(this),
      onStoreScene: this._onStoreSceneEndpointOne.bind(this)
    }));

    // Bind scene button commands endpoint 2
    zclNode.endpoints[2].bind(CLUSTER.SCENES.NAME, new RobbScenesBoundCluster({
      onSceneRecall: this._onSceneRecallEndpointTwo.bind(this),
      onStoreScene: this._onStoreSceneEndpointTwo.bind(this)
    }));

    // Bind scene button commands endpoint 3
    zclNode.endpoints[3].bind(CLUSTER.SCENES.NAME, new RobbScenesBoundCluster({
      onSceneRecall: this._onSceneRecallEndpointThree.bind(this),
      onStoreScene: this._onStoreSceneEndpointThree.bind(this)
    }));
  }
  
  /**
   * Trigger a Flow based on the `type` parameter.
   * @param {'power_1 | power_2 | power_3'} type
   * @private
   */
  _onOffCommandHandler(type) {
    if (type !== 'power_1' && type !== 'power_2' && type !== 'power_3') throw new Error('invalid_onoff_type');
    this.triggerFlow({ id: type })
      .then(() => this.log(`flow was triggered: ${type}`))
      .catch(err => this.error(`Error: triggering flow: ${type}`, err));
  }

  /**
   * Trigger a Flow based on the `type` parameter.
   * @param {'toggleAwayHome_1 | toggleAwayHome_2 | toggleAwayHome_3'} type
   * @private
   */
  _onToggleAwayHome(type) {
    if (type !== 'toggleAwayHome_1' && type !== 'toggleAwayHome_2' && type !== 'toggleAwayHome_3') throw new Error('invalid_basic_type');
    this.triggerFlow({ id: type })
      .then(() => this.log(`flow was triggered: ${type}`))
      .catch(err => this.error(`Error: triggering flow: ${type}`, err));
  }

  /**
   * Handles `onStepWithOnOff` commands and triggers a Flow based on the `mode`
   * parameter.
   * @param {'up'|'down'} mode
   * @param {number} stepSize - A change of `currentLevel` in step size units.
   * @param {number} transitionTime - Time in 1/10th seconds specified performing the step
   * should take.
   * @private
   */
  _onStepWithOnOffOne({ mode, stepSize, transitionTime }) {
    if (typeof mode === 'string' && (mode === 'up' || mode === 'down')) {
      let type = `dim_${mode}_1`;
      this.triggerFlow({ id: type })
        .then(() => this.log('flow was triggered', type))
        .catch(err => this.error('Error: triggering flow', type, err));
    } else {
      throw new Error('invalid_current_level_type');
    }
  }

  /**
   * Handles `onMoveWithOnOff` commands and triggers a Flow based on the `mode`
   * parameter.
   * @param {'up'|'down'} moveMode
   * @param {number} rate - A change of `currentLevel` in step size units.
   * @private
   */
  _onMoveWithOnOffOne({ moveMode, rate }) {
    if (typeof moveMode === 'string' && (moveMode === 'up' || moveMode === 'down')) {
      let type = `dim_${moveMode}_1_long_press`;
      this.triggerFlow({ id: type })
        .then(() => this.log('flow was triggered', type))
        .catch(err => this.error('Error: triggering flow', type, err));
    } else {
      throw new Error('invalid_current_level_type');
    }
  }
  
  /**
   * Handles `onStepWithOnOff` commands and triggers a Flow based on the `mode`
   * parameter.
   * @param {'up'|'down'} mode
   * @param {number} stepSize - A change of `currentLevel` in step size units.
   * @param {number} transitionTime - Time in 1/10th seconds specified performing the step
   * should take.
   * @private
   */
   _onStepWithOnOffTwo({ mode, stepSize, transitionTime }) {
    if (typeof mode === 'string' && (mode === 'up' || mode === 'down')) {
      let type = `dim_${mode}_2`;
      this.triggerFlow({ id: type })
        .then(() => this.log('flow was triggered', type))
        .catch(err => this.error('Error: triggering flow', type, err));
    } else {
      throw new Error('invalid_current_level_type');
    }
  }

  /**
   * Handles `onMoveWithOnOff` commands and triggers a Flow based on the `mode`
   * parameter.
   * @param {'up'|'down'} moveMode
   * @param {number} rate - A change of `currentLevel` in step size units.
   * @private
   */
  _onMoveWithOnOffTwo({ moveMode, rate }) {
    if (typeof moveMode === 'string' && (moveMode === 'up' || moveMode === 'down')) {
      let type = `dim_${moveMode}_2_long_press`;
      this.triggerFlow({ id: type })
        .then(() => this.log('flow was triggered', type))
        .catch(err => this.error('Error: triggering flow', type, err));
    } else {
      throw new Error('invalid_current_level_type');
    }
  }
  
  /**
   * Handles `onStepWithOnOff` commands and triggers a Flow based on the `mode`
   * parameter.
   * @param {'up'|'down'} mode
   * @param {number} stepSize - A change of `currentLevel` in step size units.
   * @param {number} transitionTime - Time in 1/10th seconds specified performing the step
   * should take.
   * @private
   */
   _onStepWithOnOffThree({ mode, stepSize, transitionTime }) {
    if (typeof mode === 'string' && (mode === 'up' || mode === 'down')) {
      let type = `dim_${mode}_3`;
      this.triggerFlow({ id: type })
        .then(() => this.log('flow was triggered', type))
        .catch(err => this.error('Error: triggering flow', type, err));
    } else {
      throw new Error('invalid_current_level_type');
    }
  }

  /**
   * Handles `onMoveWithOnOff` commands and triggers a Flow based on the `mode`
   * parameter.
   * @param {'up'|'down'} moveMode
   * @param {number} rate - A change of `currentLevel` in step size units.
   * @private
   */
  _onMoveWithOnOffThree({ moveMode, rate }) {
    if (typeof moveMode === 'string' && (moveMode === 'up' || moveMode === 'down')) {
      let type = `dim_${moveMode}_3_long_press`;
      this.triggerFlow({ id: type })
        .then(() => this.log('flow was triggered', type))
        .catch(err => this.error('Error: triggering flow', type, err));
    } else {
      throw new Error('invalid_current_level_type');
    }
  }

  /**
   * Handles `_onMoveToColor` commands and triggers a Flow based on the `colorX`, `colorY`
   * parameters.
   * @param {number} colorX
   * @param {number} colorY
   * @param {number} transitionTime
   * @private
   */
  _onMoveToColorOne({ colorX, colorY, transitionTime }) {
    if (typeof colorX === 'number' && typeof colorY === 'number') {
      let type = `color_1`;
      this.triggerFlow({
        id: type,
        tokens: {
          colorX,
          colorY
        },
        state: null
      })
        .then(() => this.log('flow was triggered', type))
        .catch(err => this.error('Error: triggering flow', type, err));
    } else {
      throw new Error('invalid_color_level_type');
    }
  }
  
  /**
   * Handles `_onMoveToColor` commands and triggers a Flow based on the `colorTemperature`
   * parameters.
   * @param {number} colorTemperature
   * @param {number} transitionTime
   * @private
   */
  _onMoveToColorTemperatureOne({ colorTemperature, transitionTime }) {
    if (typeof colorTemperature === 'number') {
      let type = `colorTemperature_1`;
      this.triggerFlow({
        id: type,
        tokens: {
          colorTemperature: (colorTemperature - 150)/350,
        },
        state: null
      })
        .then(() => this.log('flow was triggered', type))
        .catch(err => this.error('Error: triggering flow', type, err));
    } else {
      throw new Error('invalid_color_level_type');
    }
  }
  
  /**
   * Handles `_onMoveToColor` commands and triggers a Flow based on the `colorX`, `colorY`
   * parameters.
   * @param {number} colorX
   * @param {number} colorY
   * @param {number} transitionTime
   * @private
   */
   _onMoveToColorTwo({ colorX, colorY, transitionTime }) {
    if (typeof colorX === 'number' && typeof colorY === 'number') {
      let type = `color_2`;
      this.triggerFlow({
        id: type,
        tokens: {
          colorX,
          colorY
        },
        state: null
      })
        .then(() => this.log('flow was triggered', type))
        .catch(err => this.error('Error: triggering flow', type, err));
    } else {
      throw new Error('invalid_color_level_type');
    }
  }
  
  /**
   * Handles `_onMoveToColor` commands and triggers a Flow based on the `colorTemperature`
   * parameters.
   * @param {number} colorTemperature
   * @param {number} transitionTime
   * @private
   */
  _onMoveToColorTemperatureTwo({ colorTemperature, transitionTime }) {
    if (typeof colorTemperature === 'number') {
      let type = `colorTemperature_2`;
      this.triggerFlow({
        id: type,
        tokens: {
          colorTemperature: (colorTemperature - 150)/350,
        },
        state: null
      })
        .then(() => this.log('flow was triggered', type))
        .catch(err => this.error('Error: triggering flow', type, err));
    } else {
      throw new Error('invalid_color_level_type');
    }
  }
  
  /**
   * Handles `_onMoveToColor` commands and triggers a Flow based on the `colorX`, `colorY`
   * parameters.
   * @param {number} colorX
   * @param {number} colorY
   * @param {number} transitionTime
   * @private
   */
   _onMoveToColorThree({ colorX, colorY, transitionTime }) {
    if (typeof colorX === 'number' && typeof colorY === 'number') {
      let type = `color_3`;
      this.triggerFlow({
        id: type,
        tokens: {
          colorX,
          colorY
        },
        state: null
      })
        .then(() => this.log('flow was triggered', type))
        .catch(err => this.error('Error: triggering flow', type, err));
    } else {
      throw new Error('invalid_color_level_type');
    }
  }
  
  /**
   * Handles `_onMoveToColor` commands and triggers a Flow based on the `colorTemperature`
   * parameters.
   * @param {number} colorTemperature
   * @param {number} transitionTime
   * @private
   */
  _onMoveToColorTemperatureThree({ colorTemperature, transitionTime }) {
    if (typeof colorTemperature === 'number') {
      let type = `colorTemperature_3`;
      this.triggerFlow({
        id: type,
        tokens: {
          colorTemperature: (colorTemperature - 150)/350,
        },
        state: null
      })
        .then(() => this.log('flow was triggered', type))
        .catch(err => this.error('Error: triggering flow', type, err));
    } else {
      throw new Error('invalid_color_level_type');
    }
  }

  /**
   * Trigger a Flow based on the `type` parameter.
   * @param {'args'} {groupID, sceneID}}
   * @private
   */
  _onSceneRecallEndpointOne({groupID, sceneID}) {
    if (sceneID === undefined || 1 <= sceneID >= 5) throw new Error('invalid_scene_type');
    let type = `scene_1_${sceneID}`
    this.triggerFlow({ id: type })
      .then(() => this.log(`flow was triggered: ${type}`))
      .catch(err => this.error(`Error: triggering flow: ${type}`, err));
  }

  /**
   * Trigger a Flow based on the `type` parameter.
   * @param {'args'} {groupID, sceneID}}
   * @private
   */
  _onSceneRecallEndpointTwo({groupID, sceneID}) {
    if (sceneID === undefined || 1 <= sceneID >= 5) throw new Error('invalid_scene_type');
    let type = `scene_2_${sceneID}`
    this.triggerFlow({ id: type })
      .then(() => this.log(`flow was triggered: ${type}`))
      .catch(err => this.error(`Error: triggering flow: ${type}`, err));
  }  
  
  /**
   * Trigger a Flow based on the `type` parameter.
   * @param {'args'} {groupID, sceneID}}
   * @private
   */
  _onSceneRecallEndpointThree({groupID, sceneID}) {
    if (sceneID === undefined || 1 <= sceneID >= 5) throw new Error('invalid_scene_type');
    let type = `scene_3_${sceneID}`
    this.triggerFlow({ id: type })
      .then(() => this.log(`flow was triggered: ${type}`))
      .catch(err => this.error(`Error: triggering flow: ${type}`, err));
  }

  /**
   * Trigger a Flow based on the `type` parameter.
   * @param {'args'} {groupID, sceneID}}
   * @private
   */
   _onStoreSceneEndpointOne({groupID, sceneID}) {
    if (sceneID === undefined || 1 <= sceneID >= 5) throw new Error('invalid_scene_type');
    let type = `scene_1_${sceneID}_long_press`
    this.triggerFlow({ id: type })
      .then(() => this.log(`flow was triggered: ${type}`))
      .catch(err => this.error(`Error: triggering flow: ${type}`, err));
  }

  /**
   * Trigger a Flow based on the `type` parameter.
   * @param {'args'} {groupID, sceneID}}
   * @private
   */
  _onStoreSceneEndpointTwo({groupID, sceneID}) {
    if (sceneID === undefined || 1 <= sceneID >= 5) throw new Error('invalid_scene_type');
    let type = `scene_2_${sceneID}_long_press`
    this.triggerFlow({ id: type })
      .then(() => this.log(`flow was triggered: ${type}`))
      .catch(err => this.error(`Error: triggering flow: ${type}`, err));
  }  
  
  /**
   * Trigger a Flow based on the `type` parameter.
   * @param {'args'} {groupID, sceneID}}
   * @private
   */
  _onStoreSceneEndpointThree({groupID, sceneID}) {
    if (sceneID === undefined || 1 <= sceneID >= 5) throw new Error('invalid_scene_type');
    let type = `scene_3_${sceneID}_long_press`
    this.triggerFlow({ id: type })
      .then(() => this.log(`flow was triggered: ${type}`))
      .catch(err => this.error(`Error: triggering flow: ${type}`, err));
  }
}
module.exports = Device;