import Experience from "../Experience.js";
import gsap from "gsap";
import { Howl, Howler } from "howler";

export default class Learning {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.world = this.experience.world;
    this.time = this.experience.time;
    this.ui = this.experience.debug.tab.pages[0];
    this.uiVect = this.experience.debug.tab.pages[1];
    this.camera = this.experience.camera.instance;
    this.dragControl = this.experience.camera.dragControls;
    this.orbitControl = this.experience.camera.controls;
    this.playHeadBar = document.getElementById("playHeadBar");
    this.playHead = document.getElementById("playHead");
    this.closeButton = document.getElementById("closeButton");
    this.eqBox = document.getElementById("equationBox");
    this.M = document.getElementById("M");
    this.cosTheta = document.getElementById("cosTheta");
    this.N = document.getElementById("N");
    this.I = document.getElementById("I");
    this.A = document.getElementById("A");
    this.B = document.getElementById("B");
    this.F = document.getElementById("F");
    this.over2 = document.getElementById("over2");
    this.x2 = document.getElementById("x2");
    this.x = document.getElementById("x");
    this.a = document.getElementById("a");
    this.L = document.getElementById("L");

    // UI
    this.chapter1 = this.ui.addButton({
      title: "What is motor?",
      label: "Chapter 1",
      disabled: true,
    });
    this.chapter2 = this.ui.addButton({
      title: "How it works?",
      label: "Chapter 2",
      disabled: true,
    });
    this.chapter3 = this.ui.addButton({
      title: "Let's do the math.",
      label: "Chapter 3",
      disabled: true,
    });

    // ------------ for Dev -----------------
    // this.camHelper = this.ui.addButton({
    //     title: 'camHelper',
    //     label: 'help'
    // })
    // this.camHelper.on('click', () => {
    //     console.log(this.camera.position)
    //     console.log(this.orbitControl.target)
    // })
    //////////////////////////////////////

    // Misc
    this.chap1IsPlaying = false;
    this.chap2IsPlaying = false;
    this.chap3IsPlaying = false;

    this.setBar();
    this.setUI();
    this.setAudio();
    this.setTimeline();
  }

  disableInteraction() {
    this.dragControl.enabled = false;
    this.orbitControl.enabled = false;
    this.experience.debug.tab.pages[1].disabled = true;
    this.experience.debug.tab.pages[0].disabled = true;

    this.world.rotor.isPaused = false;
  }

  enableInteraction() {
    this.dragControl.enabled = true;
    this.orbitControl.enabled = true;
    this.experience.debug.tab.pages[1].disabled = false;
    this.experience.debug.tab.pages[0].disabled = false;
  }

  closeLearning() {
    this.playHeadBar.style.display = "none";
    this.enableInteraction();
    Howler.stop();
    if (this.chap1IsPlaying) {
      this.chap1tl.pause().invalidate();
      this.world.learningMisc.direction.scale.set(0, 0, 0);
      this.chap1IsPlaying = false;
    } else if (this.chap2IsPlaying) {
      this.chap2tl.pause().invalidate();
      this.chap2IsPlaying = false;
      this.world.rightHands.hand1.position.x = 0;
      this.world.rightHands.hand2.position.x = 0;
      this.world.fieldVect.vect1.scale.set(1, 1, 1);
      this.world.fieldVect.vect2.scale.set(1, 1, 1);
      this.world.forceVect.vect1.scale.set(1, 1, 1);
      this.world.forceVect.vect2.scale.set(1, 1, 1);
      this.world.rightHands.addHandRotation = 0;
      this.world.learningMisc.direction.scale.set(0, 0, 0);
    } else if (this.chap3IsPlaying) {
      this.chap3tl.pause().invalidate();
      this.eqBox.style.display = "none";
      this.world.learningMisc.setZero();
      this.world.fieldVect.vect1.scale.set(1, 1, 1);
      this.world.fieldVect.vect1Label.material.size = 0.08;
      this.world.fieldVect.vect2.scale.set(1, 1, 1);
      this.world.fieldVect.vect2Label.material.size = 0.08;
      this.world.forceVect.vect1.scale.set(1, 1, 1);
      this.world.forceVect.vect1Label.material.size = 0.08;
      this.world.forceVect.vect2.scale.set(1, 1, 1);
      this.world.forceVect.vect2Label.material.size = 0.08;
      this.world.field.model.position.set(0, 0, 0);
      this.world.rotor.model.material.opacity = 1;
      this.chap3IsPlaying = false;
    }
  }

  setBar() {
    this.closeButton.addEventListener("click", () => {
      this.closeLearning();
    });
    this.playHead.addEventListener("pointerdown", () => {
      this.playheadIsClicked = true;
      this.playHead.addEventListener(
        "pointerup",
        () => {
          this.playheadIsClicked = false;

          if (this.chap1IsPlaying) {
            this.chap1Voice.seek(
              (this.playHead.value * this.chap1Voice.duration()) / 100
            );
            this.chap1tl
              .invalidate()
              .seek((this.playHead.value * this.chap1Voice.duration()) / 100);
          } else if (this.chap2IsPlaying) {
            this.chap2Voice.seek(
              (this.playHead.value * this.chap2Voice.duration()) / 100
            );
            this.chap2tl
              .invalidate()
              .seek((this.playHead.value * this.chap2Voice.duration()) / 100);
          } else if (this.chap3IsPlaying) {
            this.chap3Voice.seek(
              (this.playHead.value * this.chap3Voice.duration()) / 100
            );
            this.chap3tl
              .invalidate()
              .seek((this.playHead.value * this.chap3Voice.duration()) / 100);
          }
        },
        { once: true }
      );
    });
  }

  setUI() {
    this.chapter1.on("click", () => {
      this.playHeadBar.style.display = "block";
      this.disableInteraction();

      this.chap1Voice.play();
      this.world.rightHands.isShowed = false;
      this.world.fieldVect.isShowed = false;
      this.world.forceVect.isShowed = false;
      this.uiVect.refresh();
      this.chap1tl.play(0);
      this.chap1IsPlaying = true;
    });
    this.chapter2.on("click", () => {
      this.playHeadBar.style.display = "block";
      this.disableInteraction();

      this.chap2Voice.play();
      this.world.rightHands.isShowed = true;
      this.world.fieldVect.isShowed = true;
      this.world.forceVect.isShowed = true;
      this.uiVect.refresh();
      this.chap2tl.play(0);
      this.chap2IsPlaying = true;
    });
    this.chapter3.on("click", () => {
      this.playHeadBar.style.display = "block";
      this.disableInteraction();

      this.chap3Voice.play();
      this.world.rightHands.isShowed = false;
      this.world.fieldVect.isShowed = true;
      this.world.forceVect.isShowed = true;
      this.uiVect.refresh();
      this.eqBox.style.display = "block";
      this.chap3tl.play(0);
      this.chap3IsPlaying = true;
    });
  }

  setAudio() {
    this.chap1Voice = new Howl({
      src: ["audio/chap1Voice.mp3"],
      onload: () => {
        this.chapter1.disabled = false;
      },
      onend: () => {
        this.closeLearning();
      },
    });

    this.chap2Voice = new Howl({
      src: ["audio/chap2Voice.mp3"],
      onload: () => {
        this.chapter2.disabled = false;
      },
      onend: () => {
        this.closeLearning();
      },
    });

    this.chap3Voice = new Howl({
      src: ["audio/chap3Voice.mp3"],
      onload: () => {
        this.chapter3.disabled = false;
      },
      onend: () => {
        this.closeLearning();
      },
    });
  }

  setTimeline() {
    // chapter 1 ------------------------------------------------------------------------------------------
    this.chap1tl = gsap.timeline();
    // initialize
    this.chap1tl.to(
      this.camera.position,
      { x: 1.56, y: 1.88, z: -0.01, duration: 2.5 },
      0
    );
    this.chap1tl.to(
      this.orbitControl.target,
      { x: 0, y: 0.64, z: 0, duration: 2.5 },
      0
    );
    this.chap1tl.set(this.world.rotor.model.rotation, { x: 0 }, 0);
    this.chap1tl.set(this.world.rotor, { omega: 0 }, 0);
    this.chap1tl.to(
      this.world.switch.model.position,
      { duration: 0.2, delay: 0, x: 0.323 },
      0
    );
    this.chap1tl.to(
      this.world.switch.model.rotation,
      { duration: 0.2, delay: 0, z: (16 * Math.PI) / 180 },
      0
    );
    this.chap1tl.to(this.world.slider.model.position, { x: 0.355 }, 0);
    this.chap1tl.set(
      this.world.learningMisc.direction.scale,
      { x: 0, y: 0, z: 0 },
      0
    );
    // to battery
    this.chap1tl.to(
      this.camera.position,
      { x: 0.71, y: 1.05, z: 0.33, duration: 2 },
      6
    );
    this.chap1tl.to(
      this.orbitControl.target,
      { x: 0.34, y: 0.66, z: -0.34, duration: 2 },
      6
    );
    // to rotor
    this.chap1tl.to(
      this.camera.position,
      { x: 0.88, y: 1.2, z: -0.28, duration: 2.8 },
      9.4
    );
    this.chap1tl.to(
      this.orbitControl.target,
      { x: 0.0, y: 0.68, z: 0.01, duration: 2.8 },
      9.4
    );
    // to switch
    this.chap1tl.to(
      this.camera.position,
      { x: 0.84, y: 1.27, z: -0.77, duration: 2 },
      14.4
    );
    this.chap1tl.to(
      this.orbitControl.target,
      { x: 0.32, y: 0.7, z: -0.35, duration: 2 },
      14.4
    );
    // switch on
    this.chap1tl.to(
      this.world.switch.model.position,
      { duration: 0.2, delay: 0, x: 0.321 },
      16.5
    );
    this.chap1tl.to(
      this.world.switch.model.rotation,
      { duration: 0.2, delay: 0, z: (-16 * Math.PI) / 180 },
      16.5
    );
    // to rotor
    this.chap1tl.to(
      this.camera.position,
      { x: 0.88, y: 1.2, z: -0.28, duration: 2.8 },
      17.4
    );
    this.chap1tl.to(
      this.orbitControl.target,
      { x: 0.0, y: 0.68, z: 0.01, duration: 2.8 },
      17.4
    );
    // to close up
    this.chap1tl.to(
      this.camera.position,
      { x: 0.68, y: 1.29, z: 0.2, duration: 4.8 },
      42.4
    );
    this.chap1tl.to(
      this.orbitControl.target,
      { x: 0.0, y: 0.64, z: -0.01, duration: 4.8 },
      42.4
    );
    // to see direction of rotation
    this.chap1tl.to(
      this.camera.position,
      { x: -0.96, y: 0.68, z: 0.0, duration: 4.2 },
      52.4
    );
    this.chap1tl.to(
      this.orbitControl.target,
      { x: 0.0, y: 0.68, z: 0.0, duration: 4.2 },
      52.4
    );
    this.chap1tl.to(this.world.learningMisc.direction.scale, {
      x: 1,
      y: 1,
      z: 1,
      duration: 1,
    });
    // grab and swing
    this.chap1tl.to(
      this.world.rotor.model.rotation,
      { x: (330 * Math.PI) / 180, duration: 1.4 },
      59.8
    );
    this.chap1tl.to(this.world.rotor.model.rotation, {
      x: (270 * Math.PI) / 180,
      duration: 0.2,
      ease: "power1.in",
    });
    this.chap1tl.set(this.world.rotor, { omega: -3 * Math.PI });
    // to see current
    this.chap1tl.to(
      this.world.learningMisc.direction.scale,
      { x: 0, y: 0, z: 0, duration: 1 },
      78
    );
    this.chap1tl.to(
      this.camera.position,
      { x: 0.68, y: 1.29, z: 0.2, duration: 6 },
      78
    );
    this.chap1tl.to(
      this.orbitControl.target,
      { x: 0.0, y: 0.64, z: -0.01, duration: 6 },
      78
    );
    // to end
    this.chap1tl.to(
      this.camera.position,
      { x: 1.49, y: 1.87, z: -1.1, duration: 6 },
      89
    );
    this.chap1tl.to(
      this.orbitControl.target,
      { x: 0, y: 0.64, z: 0, duration: 6 },
      89
    );
    // set to pause
    this.chap1tl.pause();

    // chapter 2 ------------------------------------------------------------------------------------------
    this.chap2tl = gsap.timeline();
    // initialize
    this.chap2tl.to(
      this.camera.position,
      { x: 1.1, y: 1.13, z: -0.33, duration: 3.5 },
      0
    );
    this.chap2tl.to(
      this.orbitControl.target,
      { x: 0, y: 0.64, z: 0, duration: 3.5 },
      0
    );
    this.chap2tl.to(
      this.world.switch.model.position,
      { duration: 0.2, delay: 0, x: 0.321 },
      0
    );
    this.chap2tl.to(
      this.world.switch.model.rotation,
      { duration: 0.2, delay: 0, z: (-16 * Math.PI) / 180 },
      0
    );
    this.chap2tl.set(this.world.rightHands.hand1.position, { x: 999 }, 0);
    this.chap2tl.set(this.world.rightHands.hand2.position, { x: 999 }, 0);
    this.chap2tl.set(this.world.fieldVect.vect1.scale, { x: 0, y: 0, z: 0 }, 0);
    this.chap2tl.set(this.world.fieldVect.vect2.scale, { x: 0, y: 0, z: 0 }, 0);
    this.chap2tl.set(this.world.forceVect.vect1.scale, { x: 0, y: 0, z: 0 }, 0);
    this.chap2tl.set(this.world.forceVect.vect2.scale, { x: 0, y: 0, z: 0 }, 0);
    this.chap2tl.set(this.world.rightHands, { addHandRotation: 0 }, 0);
    this.chap2tl.to(this.world.slider.model.position, { x: 0.355 }, 0);
    this.chap2tl.set(
      this.world.learningMisc.direction.scale,
      { x: 0, y: 0, z: 0 },
      0
    );
    // grab
    this.chap2tl.to(
      this.world.rotor.model.rotation,
      { x: (-30 * Math.PI) / 180, duration: 1.8 },
      8
    );
    this.chap2tl.to(this.world.rotor.model.rotation, {
      x: (-30 * Math.PI) / 180,
      duration: 66.8,
    });
    this.chap2tl.set(this.world.rotor, { omega: 0 }, 8);
    this.chap2tl.to(this.world.rotor, { omega: 0, duration: 68.6 }, 8);
    // to left side
    this.chap2tl.to(
      this.camera.position,
      { x: 0.25, y: 0.86, z: -0.11, duration: 2 },
      11
    );
    this.chap2tl.to(
      this.orbitControl.target,
      { x: 0.01, y: 0.71, z: 0.08, duration: 2 },
      11
    );
    // show hand1
    this.chap2tl.set(this.world.rightHands.hand1.position, { x: 0 }, 26);
    this.chap2tl.to(
      this.camera.position,
      { x: -0.22, y: 0.88, z: -0.11, duration: 2 },
      25.6
    );
    this.chap2tl.to(
      this.orbitControl.target,
      { x: -0.01, y: 0.7, z: 0.1, duration: 2 },
      25.6
    );
    // show field vect1
    this.chap2tl.to(
      this.world.fieldVect.vect1.scale,
      { x: 1, y: 1, z: 1, duration: 1 },
      32.2
    );
    this.chap2tl.to(
      this.camera.position,
      { x: -0.36, y: 0.74, z: 0.073, duration: 2 },
      32.2
    );
    this.chap2tl.to(
      this.orbitControl.target,
      { x: -0.01, y: 0.72, z: 0.073, duration: 2 },
      32.2
    );
    // rotate hand
    this.chap2tl.set(this.world.rightHands, { addHandRotation: 0 }, 35);
    this.chap2tl.to(
      this.world.rightHands,
      { addHandRotation: (90 * Math.PI) / 180 },
      35
    );
    this.chap2tl.to(
      this.world.rightHands,
      { addHandRotation: (180 * Math.PI) / 180 },
      36
    );
    this.chap2tl.to(
      this.world.rightHands,
      { addHandRotation: (270 * Math.PI) / 180 },
      37
    );
    this.chap2tl.to(
      this.world.rightHands,
      { addHandRotation: (360 * Math.PI) / 180 },
      38.7
    );
    // show force vect1
    this.chap2tl.to(
      this.world.forceVect.vect1.scale,
      { x: 1, y: 1, z: 1, duration: 1 },
      45
    );
    this.chap2tl.to(
      this.camera.position,
      { x: -0.36, y: 0.72, z: 0.08, duration: 2 },
      43
    );
    this.chap2tl.to(
      this.orbitControl.target,
      { x: -0.01, y: 0.7, z: 0.08, duration: 2 },
      43
    );
    // to right side
    this.chap2tl.to(
      this.camera.position,
      { x: -0.31, y: 0.9, z: 0.07, duration: 3 },
      49.8
    );
    this.chap2tl.to(
      this.orbitControl.target,
      { x: 0.01, y: 0.6, z: -0.08, duration: 3 },
      49.8
    );
    // show hand2
    this.chap2tl.set(this.world.rightHands.hand2.position, { x: 0 }, 58.4);
    this.chap2tl.to(
      this.camera.position,
      { x: 0.31, y: 0.9, z: 0.07, duration: 2 },
      58
    );
    this.chap2tl.to(
      this.orbitControl.target,
      { x: 0.01, y: 0.62, z: -0.09, duration: 2 },
      58
    );
    // show field vect2
    this.chap2tl.to(
      this.world.fieldVect.vect2.scale,
      { x: 1, y: 1, z: 1, duration: 1 },
      62
    );
    this.chap2tl.to(
      this.camera.position,
      { x: 0.45, y: 0.66, z: -0.1, duration: 2 },
      62
    );
    this.chap2tl.to(
      this.orbitControl.target,
      { x: 0.01, y: 0.62, z: -0.1, duration: 2 },
      62
    );
    // show force vect2
    this.chap2tl.to(
      this.world.forceVect.vect2.scale,
      { x: 1, y: 1, z: 1, duration: 1 },
      66.4
    );
    this.chap2tl.to(
      this.camera.position,
      { x: 0.36, y: 0.8, z: -0.12, duration: 2 },
      65.4
    );
    this.chap2tl.to(
      this.orbitControl.target,
      { x: 0.01, y: 0.64, z: -0.09, duration: 2 },
      65.4
    );
    // to see direction of rotation
    this.chap2tl.to(
      this.camera.position,
      { x: -0.96, y: 0.68, z: 0.0, duration: 4.2 },
      70
    );
    this.chap2tl.to(
      this.orbitControl.target,
      { x: 0.0, y: 0.68, z: 0.0, duration: 4.2 },
      70
    );
    this.chap2tl.to(
      this.world.learningMisc.direction.scale,
      { x: 1, y: 1, z: 1, duration: 1 },
      86.65
    );
    this.chap2tl.to(
      this.world.learningMisc.direction.scale,
      { x: 0, y: 0, z: 0, duration: 1 },
      94.8
    );
    // grab to 90d
    this.chap2tl.to(
      this.world.rotor.model.rotation,
      { x: (-90 * Math.PI) / 180, duration: 2 },
      104
    );
    this.chap2tl.to(
      this.world.rotor.model.rotation,
      { x: (-90 * Math.PI) / 180, duration: 1 },
      106
    );
    this.chap2tl.set(this.world.rotor, { omega: 0 }, 104);
    this.chap2tl.to(this.world.rotor, { omega: 0, duration: 1 }, 104);
    // grab to 0d
    this.chap2tl.to(
      this.world.rotor.model.rotation,
      { x: 0, duration: 1.5 },
      111.5
    );
    this.chap2tl.to(
      this.world.rotor.model.rotation,
      { x: 0, duration: 1 },
      113
    );
    this.chap2tl.set(this.world.rotor, { omega: 0 }, 113);
    this.chap2tl.to(this.world.rotor, { omega: 0, duration: 1 }, 113);
    // to end
    this.chap2tl.to(
      this.camera.position,
      { x: 1.49, y: 1.87, z: -1.1, duration: 4 },
      132
    );
    this.chap2tl.to(
      this.orbitControl.target,
      { x: 0, y: 0.64, z: 0, duration: 4 },
      132
    );
    // set to pause
    this.chap2tl.pause();

    // chapter 3 ------------------------------------------------------------------------------------------
    this.chap3tl = gsap.timeline();
    // initialize
    this.chap3tl.to(
      this.camera.position,
      { x: -1.08, y: 1.03, z: 0.36, duration: 3.5 },
      0
    );
    this.chap3tl.to(
      this.orbitControl.target,
      { x: 0, y: 0.64, z: 0, duration: 3.5 },
      0
    );
    this.chap3tl.to(
      this.world.switch.model.position,
      { duration: 0.2, delay: 0, x: 0.321 },
      0
    );
    this.chap3tl.to(
      this.world.switch.model.rotation,
      { duration: 0.2, delay: 0, z: (-16 * Math.PI) / 180 },
      0
    );
    this.chap3tl.set(this.world.fieldVect.vect1.scale, { x: 0, y: 0, z: 0 }, 0);
    this.chap3tl.set(this.world.fieldVect.vect2.scale, { x: 0, y: 0, z: 0 }, 0);
    this.chap3tl.set(this.world.fieldVect.labelMaterial, { size: 0 }, 0);
    this.chap3tl.set(this.world.forceVect.vect1.scale, { x: 1, y: 1, z: 1 }, 0);
    this.chap3tl.set(this.world.forceVect.vect2.scale, { x: 1, y: 1, z: 1 }, 0);
    this.chap3tl.set(this.world.forceVect.labelMaterial, { size: 0.08 }, 0);
    this.chap3tl.to(this.world.slider.model.position, { x: 0.355 }, 0);
    this.chap3tl.set(
      this.world.learningMisc.widthLine.scale,
      { x: 0, y: 0, z: 0 },
      0
    );
    this.chap3tl.set(
      this.world.learningMisc.widthLabel.material,
      { size: 0 },
      0
    );
    this.chap3tl.set(
      this.world.learningMisc.lengthLine.scale,
      { x: 0, y: 0, z: 0 },
      0
    );
    this.chap3tl.set(
      this.world.learningMisc.lengthLabel.material,
      { size: 0 },
      0
    );
    this.chap3tl.set(
      this.world.learningMisc.theta.scale,
      { x: 0, y: 0, z: 0 },
      0
    );
    this.chap3tl.set(
      this.world.learningMisc.thetaLabel.material,
      { size: 0 },
      0
    );
    this.chap3tl.set(
      this.world.learningMisc.halfWidthLine.scale,
      { x: 0, y: 0, z: 0 },
      0
    );
    this.chap3tl.set(
      this.world.learningMisc.halfWidthLabel.material,
      { size: 0 },
      0
    );
    this.chap3tl.set(
      this.world.learningMisc.momentArmLine.scale,
      { x: 0, y: 0, z: 0 },
      0
    );
    this.chap3tl.set(
      this.world.learningMisc.momentArmLabel.material,
      { size: 0 },
      0
    );
    this.chap3tl.set(
      this.world.learningMisc.areaPlane.scale,
      { x: 0, y: 0, z: 0 },
      0
    );
    this.chap3tl.set(
      this.world.learningMisc.axisLine.scale,
      { x: 0, y: 0, z: 0 },
      0
    );
    this.chap3tl.set(
      this.world.learningMisc.forceLine.scale,
      { x: 0, y: 0, z: 0 },
      0
    );
    this.chap3tl.set(
      this.world.learningMisc.currentLabel.material,
      { size: 0 },
      0
    );
    this.chap3tl.set(this.world.field.model.position, { x: 0 }, 0);
    this.chap3tl.set(this.world.rotor.model.material, { opacity: 1 }, 0);
    this.chap3tl.set(this.eqBox, { opacity: 0, top: "50%", scale: 1 }, 0);
    this.chap3tl.set(this.M, { opacity: 0 }, 0);
    this.chap3tl.set(this.cosTheta, { opacity: 0 }, 0);
    this.chap3tl.set(this.N, { opacity: 0 }, 0);
    this.chap3tl.set(this.I, { opacity: 0 }, 0);
    this.chap3tl.set(this.A, { opacity: 0 }, 0);
    this.chap3tl.set(this.B, { opacity: 0 }, 0);
    this.chap3tl.set(this.F, { opacity: 0 }, 0);
    this.chap3tl.set(this.over2, { opacity: 0 }, 0);
    this.chap3tl.set(this.x2, { opacity: 0 }, 0);
    this.chap3tl.set(this.x, { opacity: 0 }, 0);
    this.chap3tl.set(this.a, { opacity: 0 }, 0);
    this.chap3tl.set(this.L, { opacity: 0 }, 0);
    this.chap3tl.set(this.world.learningMisc.widthLine.position, { y: 999 }, 0);
    this.chap3tl.set(
      this.world.learningMisc.lengthLine.position,
      { x: 999 },
      0
    );
    this.chap3tl.set(
      this.world.learningMisc.halfWidthLine.position,
      { x: 999 },
      0
    );
    this.chap3tl.set(
      this.world.learningMisc.momentArmLine.position,
      { x: 999 },
      0
    );
    // grab
    this.chap3tl.to(
      this.world.rotor.model.rotation,
      { x: (-150 * Math.PI) / 180, duration: 2 },
      12
    );
    this.chap3tl.to(this.world.rotor.model.rotation, {
      x: (-150 * Math.PI) / 180,
      duration: 999,
    });
    this.chap3tl.set(this.world.rotor, { omega: 0 }, 12);
    this.chap3tl.to(this.world.rotor, { omega: 0, duration: 999 }, 12);
    // to theta
    this.chap3tl.to(
      this.camera.position,
      { x: -0.47, y: 0.69, z: -0.06, duration: 2 },
      15
    );
    this.chap3tl.to(
      this.orbitControl.target,
      { x: 0.01, y: 0.71, z: -0.05, duration: 2 },
      15
    );
    this.chap3tl.to(
      this.world.learningMisc.theta.scale,
      { x: 1, y: 1, z: 1, duration: 2 },
      15
    );
    this.chap3tl.to(
      this.world.learningMisc.thetaLabel.material,
      { size: 0.08, duration: 2 },
      15
    );
    this.chap3tl.set(this.world.field.model.position, { x: 999 }, 15);
    // to axis
    this.chap3tl.to(
      this.camera.position,
      { x: -0.48, y: 0.79, z: 0.13, duration: 2 },
      19.2
    );
    this.chap3tl.to(
      this.orbitControl.target,
      { x: 0.01, y: 0.71, z: -0.035, duration: 2 },
      19.2
    );
    this.chap3tl.to(
      this.world.learningMisc.axisLine.scale,
      { x: 1, y: 1, z: 1, duration: 2 },
      30.2
    );
    // to width
    this.chap3tl.to(
      this.camera.position,
      { x: -0.745, y: 0.86, z: 0.17, duration: 1.8 },
      34.8
    );
    this.chap3tl.to(
      this.orbitControl.target,
      { x: 0.008, y: 0.69, z: -0.033, duration: 1.8 },
      34.8
    );
    this.chap3tl.set(
      this.world.learningMisc.widthLine.position,
      { y: 0 },
      34.8
    );
    this.chap3tl.to(
      this.world.learningMisc.widthLine.scale,
      { x: 1, y: 1, z: 1, duration: 1.8 },
      34.8
    );
    this.chap3tl.to(
      this.world.learningMisc.widthLabel.material,
      { size: 0.08, duration: 1.8 },
      34.8
    );
    // to half width
    this.chap3tl.to(
      this.camera.position,
      { x: -0.399, y: 0.817, z: 0.034, duration: 1.8 },
      37.8
    );
    this.chap3tl.to(
      this.orbitControl.target,
      { x: 0.009, y: 0.706, z: -0.05, duration: 1.8 },
      37.8
    );
    this.chap3tl.set(
      this.world.learningMisc.halfWidthLine.position,
      { x: 0 },
      37.8
    );
    this.chap3tl.to(
      this.world.learningMisc.halfWidthLine.scale,
      { x: 1, y: 1, z: 1, duration: 1.8 },
      37.8
    );
    this.chap3tl.to(
      this.world.learningMisc.halfWidthLabel.material,
      { size: 0.08, duration: 1.8 },
      37.8
    );
    this.chap3tl.to(
      this.world.rotor.model.material,
      { opacity: 0.4, duration: 1.8 },
      37.8
    );
    // to moment arm
    this.chap3tl.to(
      this.camera.position,
      { x: -0.32, y: 0.83, z: 0.02, duration: 2 },
      43.6
    );
    this.chap3tl.to(
      this.orbitControl.target,
      { x: 0.009, y: 0.706, z: -0.05, duration: 2 },
      43.6
    );
    this.chap3tl.set(
      this.world.learningMisc.momentArmLine.position,
      { x: 0 },
      43.6
    );
    this.chap3tl.to(
      this.world.learningMisc.momentArmLine.scale,
      { x: 1, y: 1, z: 1, duration: 2 },
      43.6
    );
    this.chap3tl.to(
      this.world.learningMisc.forceLine.scale,
      { x: 1, y: 1, z: 1, duration: 2 },
      43.6
    );
    this.chap3tl.to(
      this.world.rotor.model.material,
      { opacity: 1, duration: 2 },
      43.6
    );
    this.chap3tl.to(
      this.camera.position,
      { x: -0.338, y: 0.594, z: -0.12, duration: 1.6 },
      50.8
    );
    this.chap3tl.to(
      this.orbitControl.target,
      { x: 0.001, y: 0.695, z: -0.053, duration: 1.6 },
      50.8
    );
    this.chap3tl.to(
      this.world.learningMisc.widthLine.scale,
      { x: 0, y: 0, z: 0, duration: 0.6 },
      50.8
    );
    this.chap3tl.set(
      this.world.learningMisc.widthLine.position,
      { y: 999 },
      51.4
    );
    this.chap3tl.to(
      this.world.learningMisc.widthLabel.material,
      { size: 0, duration: 0.6 },
      50.8
    );
    this.chap3tl.to(
      this.world.learningMisc.momentArmLabel.material,
      { size: 0.16, duration: 2 },
      53.2
    );
    // to calculate first moment
    this.chap3tl.to(
      this.camera.position,
      { x: -0.341, y: 0.706, z: -0.038, duration: 1.2 },
      57.4
    );
    this.chap3tl.to(
      this.orbitControl.target,
      { x: 0.001, y: 0.712, z: -0.055, duration: 1.2 },
      57.4
    );
    this.chap3tl.to(
      this.world.learningMisc.theta.scale,
      { x: 0, y: 0, z: 0, duration: 1.2 },
      57.4
    );
    this.chap3tl.to(
      this.world.learningMisc.thetaLabel.material,
      { size: 0, duration: 1.2 },
      57.4
    );
    this.chap3tl.to(
      this.world.learningMisc.halfWidthLine.scale,
      { x: 0, y: 0, z: 0, duration: 1.2 },
      57.4
    );
    this.chap3tl.set(
      this.world.learningMisc.halfWidthLine.position,
      { x: 999 },
      58.6
    );
    this.chap3tl.to(
      this.world.learningMisc.halfWidthLabel.material,
      { size: 0, duration: 1.2 },
      57.4
    );
    this.chap3tl.to(this.eqBox, { opacity: 1, duration: 0.8 }, 61.6);
    this.chap3tl.set(this.M, { left: "12%" }, 61.6);
    this.chap3tl.to(this.M, { opacity: 1, duration: 0.8 }, 61.6);
    this.chap3tl.set(this.F, { left: "37.5%" }, 61.6);
    this.chap3tl.to(this.F, { opacity: 1, duration: 0.8 }, 61.6);
    this.chap3tl.set(this.x, { left: "45%" }, 61.6);
    this.chap3tl.to(this.x, { opacity: 1, duration: 0.8 }, 61.6);
    this.chap3tl.set(this.a, { top: "8%", left: "55.5%" }, 61.6);
    this.chap3tl.to(this.a, { opacity: 1, duration: 0.8 }, 61.6);
    this.chap3tl.set(this.over2, { left: "55.5%" }, 61.6);
    this.chap3tl.to(this.over2, { opacity: 1, duration: 0.8 }, 61.6);
    this.chap3tl.set(this.cosTheta, { left: "64%" }, 61.6);
    this.chap3tl.to(this.cosTheta, { opacity: 1, duration: 0.8 }, 61.6);
    // to see both force
    this.chap3tl.to(this.eqBox, { opacity: 0, duration: 0.8 }, 67.4);
    this.chap3tl.to(
      this.camera.position,
      { x: -0.86, y: 0.68, z: 0.0, duration: 2 },
      67.4
    );
    this.chap3tl.to(
      this.orbitControl.target,
      { x: 0.0, y: 0.68, z: 0.0, duration: 2 },
      67.4
    );
    this.chap3tl.to(
      this.world.learningMisc.forceLine.scale,
      { x: 0, y: 0, z: 0, duration: 2 },
      67.4
    );
    this.chap3tl.to(
      this.world.learningMisc.momentArmLine.scale,
      { x: 0, y: 0, z: 0, duration: 2 },
      67.4
    );
    this.chap3tl.set(
      this.world.learningMisc.momentArmLine.position,
      { x: 999 },
      69.4
    );
    this.chap3tl.to(
      this.world.learningMisc.momentArmLabel.material,
      { size: 0.0, duration: 2 },
      67.4
    );
    this.chap3tl.to(this.eqBox, { opacity: 1, duration: 0.8 }, 71.8);
    this.chap3tl.to(this.x2, { opacity: 1, duration: 0.8 }, 72.8);
    this.chap3tl.set(this.x, { opacity: 0 }, 71.8);
    this.chap3tl.set(this.M, { left: "8%" }, 71.8);
    this.chap3tl.set(this.F, { left: "34%" }, 71.8);
    this.chap3tl.set(this.a, { left: "44%" }, 71.8);
    this.chap3tl.set(this.over2, { left: "44%" }, 71.8);
    this.chap3tl.set(this.cosTheta, { left: "52%" }, 71.8);
    this.chap3tl.to(this.x2, { opacity: 0, duration: 0.8 }, 77);
    this.chap3tl.to(this.over2, { opacity: 0, duration: 0.8 }, 77);
    this.chap3tl.to(this.a, { left: "50%", top: "25%", duration: 0.8 }, 77);
    this.chap3tl.to(this.cosTheta, { left: "58%", duration: 0.8 }, 77);
    this.chap3tl.to(this.F, { left: "42%", duration: 0.8 }, 77);
    this.chap3tl.to(this.M, { left: "16%", duration: 0.8 }, 77);
    // to force
    this.chap3tl.to(this.eqBox, { opacity: 0, duration: 0.8 }, 83);
    this.chap3tl.to(
      this.camera.position,
      { x: -0.31, y: 0.843, z: 0.112, duration: 2 },
      83
    );
    this.chap3tl.to(
      this.orbitControl.target,
      { x: 0.003, y: 0.758, z: -0.083, duration: 2 },
      83
    );
    this.chap3tl.to(
      this.world.learningMisc.axisLine.scale,
      { x: 0, y: 0, z: 0, duration: 2 },
      83
    );
    this.chap3tl.set(this.world.field.model.position, { x: 0 }, 83);
    this.chap3tl.to(
      this.camera.position,
      { x: -0.028, y: 0.932, z: 0.229, duration: 1 },
      90.2
    );
    this.chap3tl.to(
      this.orbitControl.target,
      { x: 0.1, y: 0.767, z: -0.086, duration: 1 },
      90.2
    );
    this.chap3tl.to(
      this.world.learningMisc.currentLabel.material,
      { size: 0.08, duration: 1 },
      90.2
    );
    this.chap3tl.to(
      this.camera.position,
      { x: 0.377, y: 0.908, z: 0.072, duration: 1.2 },
      92.3
    );
    this.chap3tl.to(
      this.orbitControl.target,
      { x: 0.022, y: 0.739, z: -0.104, duration: 1.2 },
      92.3
    );
    this.chap3tl.set(
      this.world.learningMisc.lengthLine.position,
      { x: 0 },
      92.3
    );
    this.chap3tl.to(
      this.world.learningMisc.lengthLine.scale,
      { x: 1, y: 1, z: 1, duration: 1.2 },
      92.3
    );
    this.chap3tl.to(
      this.world.learningMisc.lengthLabel.material,
      { size: 0.08, duration: 1.2 },
      92.3
    );
    this.chap3tl.to(
      this.camera.position,
      { x: 0.374, y: 0.736, z: -0.107, duration: 1.4 },
      94.2
    );
    this.chap3tl.to(
      this.orbitControl.target,
      { x: 0.003, y: 0.761, z: -0.094, duration: 1.4 },
      94.2
    );
    this.chap3tl.to(
      this.world.fieldVect.vect1.scale,
      { x: 1, y: 1, z: 1, duration: 1.4 },
      94.2
    );
    this.chap3tl.to(
      this.world.fieldVect.vect2.scale,
      { x: 1, y: 1, z: 1, duration: 1.4 },
      94.2
    );
    this.chap3tl.to(
      this.world.fieldVect.labelMaterial,
      { size: 0.08, duration: 1.4 },
      94.2
    );
    this.chap3tl.to(this.eqBox, { opacity: 1, duration: 0.8 }, 99);
    this.chap3tl.to(this.M, { left: "10%", duration: 0.8 }, 102);
    this.chap3tl.to(this.F, { opacity: 0, duration: 0.8 }, 102);
    this.chap3tl.to(this.a, { left: "58%", duration: 0.8 }, 102);
    this.chap3tl.to(this.cosTheta, { left: "65%", duration: 0.8 }, 102);
    this.chap3tl.set(this.I, { left: "36%", duration: 0.8 }, 102);
    this.chap3tl.to(this.I, { opacity: 1, duration: 0.8 }, 102);
    this.chap3tl.set(this.L, { left: "41%", duration: 0.8 }, 102);
    this.chap3tl.to(this.L, { opacity: 1, duration: 0.8 }, 102);
    this.chap3tl.set(this.B, { left: "48%", duration: 0.8 }, 102);
    this.chap3tl.to(this.B, { opacity: 1, duration: 0.8 }, 102);
    this.chap3tl.to(this.L, { left: "42.6%", duration: 0.8 }, 107);
    this.chap3tl.to(this.a, { left: "49.6%", duration: 0.8 }, 107);
    this.chap3tl.to(this.B, { left: "56.8%", duration: 0.8 }, 107);
    this.chap3tl.to(this.M, { opacity: 0.2, duration: 0.8 }, 107);
    this.chap3tl.to(this.I, { opacity: 0.2, duration: 0.8 }, 107);
    this.chap3tl.to(this.B, { opacity: 0.2, duration: 0.8 }, 107);
    this.chap3tl.to(this.cosTheta, { opacity: 0.2, duration: 0.8 }, 107);
    // to see area
    this.chap3tl.to(this.eqBox, { opacity: 0, duration: 0.8 }, 112);
    this.chap3tl.to(
      this.camera.position,
      { x: -0.34, y: 1.608, z: 0.138, duration: 3.4 },
      112
    );
    this.chap3tl.to(
      this.orbitControl.target,
      { x: -0.002, y: 0.682, z: -0.019, duration: 3.4 },
      112
    );
    this.chap3tl.set(this.world.learningMisc.widthLine.position, { y: 0 }, 112);
    this.chap3tl.to(
      this.world.learningMisc.widthLine.scale,
      { x: 1, y: 1, z: 1, duration: 0.4 },
      112
    );
    this.chap3tl.to(
      this.world.learningMisc.widthLabel.material,
      { size: 0.08, duration: 0.4 },
      112
    );
    this.chap3tl.to(
      this.world.fieldVect.vect1.scale,
      { x: 0, y: 0, z: 0, duration: 0.4 },
      112
    );
    this.chap3tl.to(
      this.world.fieldVect.vect2.scale,
      { x: 0, y: 0, z: 0, duration: 0.4 },
      112
    );
    this.chap3tl.to(
      this.world.fieldVect.labelMaterial,
      { size: 0, duration: 0.4 },
      112
    );
    this.chap3tl.to(
      this.world.forceVect.vect1.scale,
      { x: 0, y: 0, z: 0, duration: 0.4 },
      112
    );
    this.chap3tl.to(
      this.world.forceVect.vect2.scale,
      { x: 0, y: 0, z: 0, duration: 0.4 },
      112
    );
    this.chap3tl.to(
      this.world.forceVect.labelMaterial,
      { size: 0, duration: 0.4 },
      112
    );
    this.chap3tl.to(
      this.world.learningMisc.currentLabel.material,
      { size: 0, duration: 0.4 },
      112
    );
    this.chap3tl.to(
      this.world.learningMisc.areaPlane.scale,
      { x: 1, y: 1, z: 1, duration: 2 },
      120
    );
    this.chap3tl.to(this.eqBox, { opacity: 1, duration: 0.8 }, 123.5);
    this.chap3tl.set(this.M, { opacity: 1 }, 123.5);
    this.chap3tl.set(this.I, { opacity: 1 }, 123.5);
    this.chap3tl.set(this.B, { opacity: 1 }, 123.5);
    this.chap3tl.set(this.cosTheta, { opacity: 1 }, 123.5);
    this.chap3tl.set(this.A, { left: "45.5%", duration: 0.8 }, 126.2);
    this.chap3tl.to(this.A, { opacity: 1, duration: 0.8 }, 126.2);
    this.chap3tl.to(this.L, { opacity: 0, duration: 0.8 }, 126.2);
    this.chap3tl.to(this.a, { opacity: 0, duration: 0.8 }, 126.2);
    this.chap3tl.to(this.I, { left: "39.5%", duration: 0.8 }, 126.2);
    this.chap3tl.to(this.B, { left: "54.5%", duration: 0.8 }, 126.2);
    // to final
    this.chap3tl.to(this.eqBox, { opacity: 0, duration: 0.8 }, 137);
    this.chap3tl.to(
      this.camera.position,
      { x: -0.888, y: 1.081, z: 0.209, duration: 3.4 },
      137
    );
    this.chap3tl.to(
      this.orbitControl.target,
      { x: -0.002, y: 0.682, z: -0.019, duration: 3.4 },
      137
    );
    this.chap3tl.to(
      this.world.learningMisc.widthLine.scale,
      { x: 0, y: 0, z: 0, duration: 1.4 },
      137
    );
    this.chap3tl.set(
      this.world.learningMisc.widthLine.position,
      { y: 999 },
      138.4
    );
    this.chap3tl.to(
      this.world.learningMisc.widthLabel.material,
      { size: 0, duration: 1.4 },
      137
    );
    this.chap3tl.to(
      this.world.learningMisc.lengthLine.scale,
      { x: 0, y: 0, z: 0, duration: 1.4 },
      137
    );
    this.chap3tl.set(
      this.world.learningMisc.lengthLine.position,
      { x: 999 },
      138.4
    );
    this.chap3tl.to(
      this.world.learningMisc.lengthLabel.material,
      { size: 0, duration: 1.4 },
      137
    );
    this.chap3tl.to(
      this.world.learningMisc.areaPlane.scale,
      { x: 0, y: 0, z: 0, duration: 1.4 },
      137
    );
    this.chap3tl.to(this.eqBox, { opacity: 1, duration: 0.8 }, 147.8);
    this.chap3tl.set(this.N, { left: "34%", duration: 0.8 }, 150.5);
    this.chap3tl.to(this.N, { opacity: 1, duration: 0.8 }, 150.5);
    this.chap3tl.to(this.I, { left: "43%", duration: 0.8 }, 150.5);
    this.chap3tl.to(this.A, { left: "48%", duration: 0.8 }, 150.5);
    this.chap3tl.to(this.B, { left: "57%", duration: 0.8 }, 150.5);
    this.chap3tl.to(this.M, { left: "8%", duration: 0.8 }, 150.5);
    this.chap3tl.to(this.cosTheta, { left: "65.6%", duration: 0.8 }, 150.5);
    this.chap3tl.to(this.eqBox, { top: "80%", scale: 0.5, duration: 0.8 }, 156);
    this.chap3tl.to(
      this.camera.position,
      { x: -0.028, y: 0.932, z: 0.229, duration: 1 },
      156
    );
    this.chap3tl.to(
      this.orbitControl.target,
      { x: 0.1, y: 0.767, z: -0.086, duration: 1 },
      156
    );
    this.chap3tl.to(
      this.world.learningMisc.currentLabel.material,
      { size: 0.08, duration: 1 },
      156
    );
    this.chap3tl.to(
      this.world.learningMisc.currentLabel.material,
      { size: 0, duration: 1 },
      158
    );
    this.chap3tl.to(
      this.camera.position,
      { x: -0.34, y: 1.608, z: 0.138, duration: 1 },
      158
    );
    this.chap3tl.to(
      this.orbitControl.target,
      { x: -0.002, y: 0.682, z: -0.019, duration: 1 },
      158
    );
    this.chap3tl.to(
      this.world.learningMisc.areaPlane.scale,
      { x: 1, y: 1, z: 1, duration: 1 },
      158
    );
    this.chap3tl.to(
      this.world.learningMisc.areaPlane.scale,
      { x: 0, y: 0, z: 0, duration: 1 },
      160.2
    );
    this.chap3tl.to(
      this.camera.position,
      { x: 0.374, y: 0.736, z: -0.107, duration: 1 },
      160.2
    );
    this.chap3tl.to(
      this.orbitControl.target,
      { x: 0.003, y: 0.761, z: -0.094, duration: 1 },
      160.2
    );
    this.chap3tl.to(
      this.world.fieldVect.vect1.scale,
      { x: 1, y: 1, z: 1, duration: 1.2 },
      160.4
    );
    this.chap3tl.to(
      this.world.fieldVect.vect2.scale,
      { x: 1, y: 1, z: 1, duration: 1.2 },
      160.4
    );
    this.chap3tl.to(
      this.world.fieldVect.labelMaterial,
      { size: 0.08, duration: 1.2 },
      160.4
    );
    this.chap3tl.to(
      this.world.fieldVect.vect1.scale,
      { x: 0, y: 0, z: 0, duration: 1.2 },
      163
    );
    this.chap3tl.to(
      this.world.fieldVect.vect2.scale,
      { x: 0, y: 0, z: 0, duration: 1.2 },
      163
    );
    this.chap3tl.to(
      this.world.fieldVect.labelMaterial,
      { size: 0, duration: 1.2 },
      163
    );
    this.chap3tl.to(
      this.camera.position,
      { x: 0.47, y: 0.71, z: -0.1, duration: 1.2 },
      163
    );
    this.chap3tl.to(
      this.orbitControl.target,
      { x: 0.01, y: 0.71, z: -0.05, duration: 1.2 },
      163
    );
    this.chap3tl.to(
      this.world.learningMisc.theta.scale,
      { x: 1, y: 1, z: 1, duration: 1.2 },
      163
    );
    this.chap3tl.to(
      this.world.learningMisc.thetaLabel.material,
      { size: 0.08, duration: 1.2 },
      163
    );
    this.chap3tl.to(
      this.world.learningMisc.theta.scale,
      { x: 0, y: 0, z: 0, duration: 1.2 },
      170
    );
    this.chap3tl.to(
      this.world.learningMisc.thetaLabel.material,
      { size: 0, duration: 1.2 },
      170
    );
    this.chap3tl.to(this.eqBox, { top: "50%", scale: 1, duration: 1.2 }, 170);
    this.chap3tl.to(
      this.camera.position,
      { x: 1.49, y: 1.87, z: -1.1, duration: 2 },
      170
    );
    this.chap3tl.to(
      this.orbitControl.target,
      { x: 0, y: 0.64, z: 0, duration: 2 },
      170
    );
    // set to pause
    this.chap3tl.pause();
  }

  update() {
    this.updatePlayhead();
  }

  updatePlayhead() {
    if (this.playheadIsClicked) {
      return;
    } else if (this.chap1IsPlaying) {
      this.playHead.value =
        (this.chap1Voice.seek() / this.chap1Voice.duration()) * 100;
    } else if (this.chap2IsPlaying) {
      this.playHead.value =
        (this.chap2Voice.seek() / this.chap2Voice.duration()) * 100;
    } else if (this.chap3IsPlaying) {
      this.playHead.value =
        (this.chap3Voice.seek() / this.chap3Voice.duration()) * 100;
    }
  }
}
