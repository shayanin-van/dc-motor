import Experience from "../Experience.js";
import BakedMaterial from "./BakedMaterial.js";

export default class RightHands {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.world = this.experience.world;
    this.ui = this.experience.debug.toolsPage;

    // Resource
    this.modelResource = this.resources.items.motorSceneModel;

    // Texture
    this.bakedMaterial = new BakedMaterial();
    this.texture = this.bakedMaterial.texture;

    // Info
    this.leftRotorZPos = 0.1;
    this.rightRotorZPos = -0.1;

    // Parameters
    this.isShowed = false;
    this.addHandRotation = 0; // additional rotation for learning tool

    // UI
    this.ui.addBinding(this, "isShowed", {
      label: "right hands",
    });

    this.setModel();
  }

  setModel() {
    this.modelResource.scene.traverse((child) => {
      if (child.name === "hand1") {
        this.hand1 = child;
        this.hand1.material = this.texture;
      }
      if (child.name === "hand2") {
        this.hand2 = child;
        this.hand2.material = this.texture;
      }
    });

    this.hand1.position.y = 0;
    this.hand2.position.y = 0;

    this.world.rotor.model.add(this.hand1);
    this.world.rotor.model.add(this.hand2);

    this.hide();
  }

  update() {
    this.hand1.rotation.x =
      -this.world.rotor.model.rotation.x + this.addHandRotation;
    this.hand2.rotation.x =
      -this.world.rotor.model.rotation.x + this.addHandRotation;

    if (
      Math.abs(this.world.rotor.model.rotation.x) < Math.PI / 2 ||
      Math.abs(this.world.rotor.model.rotation.x) > (3 * Math.PI) / 2
    ) {
      this.hand1.position.z = this.leftRotorZPos;
      this.hand2.position.z = this.rightRotorZPos;
    } else {
      this.hand1.position.z = this.rightRotorZPos;
      this.hand2.position.z = this.leftRotorZPos;
    }

    if (this.isShowed && this.world.switch.isOn) {
      this.show();
    } else {
      this.hide();
    }
  }

  hide() {
    this.hand1.visible = false;
    this.hand2.visible = false;
  }

  show() {
    this.hand1.visible = true;
    this.hand2.visible = true;
  }
}
