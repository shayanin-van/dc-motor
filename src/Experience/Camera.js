import * as THREE from 'three'
import Experience from './Experience.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { DragControls } from 'three/examples/jsm/controls/DragControls.js'

export default class Camera {
    constructor() {
        this.experience = new Experience()
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.canvas = this.experience.canvas

        this.setInstance()
        this.setControls()
        this.setDragControls()
    }

    setInstance() {
        this.instance = new THREE.PerspectiveCamera(35, this.sizes.width / this.sizes.height, 0.1, 100)
        this.instance.position.set(1.4, 1.4, -0.8)
        this.scene.add(this.instance)
    }

    setControls() {
        this.controls = new OrbitControls(this.instance, this.canvas)
        this.controls.target = new THREE.Vector3(0, 0.64, 0)
        this.controls.enableDamping = true
    }

    setDragControls() {
        this.dragControls = new DragControls([], this.instance, this.canvas)
        this.dragControls.recursive = false
        this.dragControls.enabled = true
        this.dragControls.rotateSpeed = 0

        this.dragControls.addEventListener('dragstart', () => {
            this.controls.enabled = false
            this.dragControls.addEventListener('dragend', () => {
                this.controls.enabled = true
            }, {once: true})
        })
    }

    resize() {
        this.instance.aspect = this.sizes.width / this.sizes.height
        this.instance.updateProjectionMatrix()
    }

    update() {
        this.controls.update()
    }
}