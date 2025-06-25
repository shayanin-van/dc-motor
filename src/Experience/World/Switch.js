import Experience from '../Experience.js'
import BakedMaterial from './BakedMaterial.js'
import gsap from 'gsap'

export default class Switch {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.dragControl = this.experience.camera.dragControls
        this.canvas = this.experience.canvas
        this.world = this.experience.world

        // Resource
        this.modelResource = this.resources.items.motorSceneModel

        // Texture
        this.bakedMaterial = new BakedMaterial()
        this.texture = this.bakedMaterial.texture

        // State
        this.isOn = false

        this.setModel()
        this.setEvent()
    }

    setModel() {
        this.modelResource.scene.traverse((child) => {
            if (child.name === 'switch') {
                this.model = child
                this.model.material = this.texture
            }
        })

        this.model.position.y = 0.6188
        this.model.position.x = 0.323
        this.model.rotation.z = 16*Math.PI/180

        this.scene.add(this.model)
    }

    setEvent() {
        this.canvas.addEventListener('click', () => {
            if (this.dragControl.raycaster.intersectObject(this.model).length != 0) {
                this.flip()
            }
        })
    }

    flip() {
        if (this.isOn) {
            gsap.to(this.model.position, {duration: 0.2, delay: 0, x: 0.323})
        } else {
            gsap.to(this.model.position, {duration: 0.2, delay: 0, x: 0.321})
        }
        gsap.to(this.model.rotation, {duration: 0.2, delay: 0, z: -this.model.rotation.z})
    }

    update() {
        if (this.model.rotation.z > 0) {
            this.isOn = false
            this.world.current.hide()
        } else {
            this.isOn = true
            this.world.current.show()
        }
    }
}