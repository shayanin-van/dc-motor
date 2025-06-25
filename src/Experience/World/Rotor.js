import * as THREE from "three";
import Experience from "../Experience.js";

export default class Rotor {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.time = this.experience.time;
    this.world = this.experience.world;
    this.ui = this.experience.debug.tab.pages[1];

    // Misc
    this.isPaused = false;

    // UI
    this.pauseButton = this.ui.addButton({
      title: "pause/play",
    });
    this.pauseButton.on("click", () => {
      this.isPaused = !this.isPaused;
    });

    // Resource
    this.modelResource = this.resources.items.motorSceneModel;

    // Material
    this.rotorMaterial = new THREE.MeshStandardMaterial({
      color: "#b86633",
      roughness: 0,
      metalness: 1,
      transparent: false,
    });

    // Physics
    this.momentOfInertia = 1;
    this.omega = 0;
    this.BNA = 1; // product of magnetic field, number of loops and loop's area
    this.minCurrent = 1;
    this.maxCurrent = 4;
    this.currentRange = this.maxCurrent - this.minCurrent;
    this.current = 0;
    this.staticFricTorque = 0.4;
    this.dragTorqueCoeff = 0.4;

    this.setModel();
  }

  setModel() {
    this.modelResource.scene.traverse((child) => {
      if (child.name === "rotor") {
        this.model = child;
        this.model.material = this.rotorMaterial;
      }
    });

    this.scene.add(this.model);
  }

  update() {
    // update current
    if (this.world.switch.isOn == false) {
      this.current = 0;
    } else {
      let sliderRatio =
        (this.world.slider.model.position.x - this.world.slider.maxXpos) /
        (this.world.slider.minXpos - this.world.slider.maxXpos);
      this.current = this.minCurrent + sliderRatio * this.currentRange;
    }

    // update rotor's state
    if (this.isPaused == false) {
      this.omega +=
        (this.calcTotalTorque() / this.momentOfInertia) * this.time.delta;
      this.model.rotation.x += this.omega * this.time.delta;
      this.model.rotation.x = this.model.rotation.x % (2 * Math.PI);
    }

    // update when grabbed
    if (this.world.rotorGrab.grip1IsGrabbed) {
      this.model.setRotationFromQuaternion(
        this.world.rotorGrab.grip1.getWorldQuaternion(new THREE.Quaternion())
      );
    }
    if (this.world.rotorGrab.grip2IsGrabbed) {
      this.model.setRotationFromQuaternion(
        this.world.rotorGrab.grip2.getWorldQuaternion(new THREE.Quaternion())
      );
    }
  }

  calcMagTorque() {
    return this.BNA * this.current * Math.abs(Math.cos(this.model.rotation.x));
  }

  calcFricTorque() {
    let dragTorque = -this.omega * this.dragTorqueCoeff;

    if (Math.abs(this.omega) < 0.01) {
      return 0 + dragTorque;
    } else {
      return (
        -(this.omega / Math.abs(this.omega)) * this.staticFricTorque +
        dragTorque
      );
    }
  }

  calcTotalTorque() {
    return this.calcMagTorque() + this.calcFricTorque();
  }
}
