import * as THREE from 'three'
import Experience from '../Experience.js'

export default class RotorGrab {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.time = this.experience.time
        this.world = this.experience.world
        this.canvas = this.experience.canvas
        this.dragControl = this.experience.camera.dragControls

        // Parameters
        this.grip1IsGrabbed = false
        this.grip2IsGrabbed = false
        this.thickness = 0.022
        this.width = 0.08
        this.length = 0.22
        this.radialDist = 0.07
        this.rotorHeight = 0.68
        this.dragOmega = 0
        this.dragOmegaHardLimit = 12
        this.prevTheta = 0

        // Geometry and Material
        this.geometry = new THREE.BoxGeometry(this.length, this.thickness, this.width)
        this.material = new THREE.MeshBasicMaterial({
            color: 'white'
        })

        this.setLocalCoord()
        this.setModel()
        this.setEvent()
    }

    setLocalCoord() {
        this.local = new THREE.Object3D()
        this.local.position.y = this.rotorHeight

        this.scene.add(this.local)
    }

    setModel() {
        this.grip1 = new THREE.Mesh(this.geometry, this.material)
        this.grip1.name = 'grip1'
        this.grip1.visible = false
        this.grip1.position.z = this.radialDist

        this.grip2 = new THREE.Mesh(this.geometry, this.material)
        this.grip2.name = 'grip2'
        this.grip2.visible = false
        this.grip2.position.z = -this.radialDist

        this.dragControl.objects.push(this.grip1)
        this.local.add(this.grip1)

        this.dragControl.objects.push(this.grip2)
        this.local.add(this.grip2)
    }

    setEvent() {
        this.canvas.addEventListener('pointerdown', () => {
            let intersects = this.dragControl.raycaster.intersectObjects([this.grip1, this.grip2])
            if (intersects.length != 0) {
                if (intersects[0].object.name == 'grip1') {
                    this.grip1IsGrabbed = true
                } else {
                    this.grip2IsGrabbed = true
                }
                this.canvas.addEventListener('pointerup', () => {
                    if (Math.abs(this.dragOmega) > 120) { // in case of dragging over -180d and 180d
                        this.dragOmega = 0
                    }
                    if (this.dragOmega > 0) {
                        this.world.rotor.omega = Math.min(this.dragOmega, this.dragOmegaHardLimit)
                    } else {
                        this.world.rotor.omega = Math.max(this.dragOmega, -this.dragOmegaHardLimit)
                    }
                    this.grip1IsGrabbed = false
                    this.grip2IsGrabbed = false
                }, {once: true})
            }
        })
    }

    update() {
        this.grip1.position.x = 0
        this.grip1.rotation.x = -Math.atan2(this.grip1.position.y, this.grip1.position.z)
        this.grip1.position.normalize().multiplyScalar(this.radialDist)

        this.grip2.position.x = 0
        this.grip2.rotation.x = -Math.atan2(this.grip2.position.y, this.grip2.position.z)
        this.grip2.position.normalize().multiplyScalar(this.radialDist)

        if (this.grip1IsGrabbed == false && this.grip2IsGrabbed == false) {
            this.grip1.position.set(0, 0, this.radialDist)
            this.grip1.rotation.x = 0
            this.grip2.position.set(0, 0, -this.radialDist)
            this.grip2.rotation.x = 0
            this.local.rotation.x = this.world.rotor.model.rotation.x
        }

        if (this.grip1IsGrabbed == true) {
            this.dragOmega = (this.world.rotor.model.rotation.x - this.prevTheta)/this.time.delta
            this.prevTheta = this.world.rotor.model.rotation.x
        }

        if (this.grip2IsGrabbed == true) {
            this.dragOmega = (this.world.rotor.model.rotation.x - this.prevTheta)/this.time.delta
            this.prevTheta = this.world.rotor.model.rotation.x
        }
    }
}