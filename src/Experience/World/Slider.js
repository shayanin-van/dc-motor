import Experience from '../Experience.js'
import BakedMaterial from './BakedMaterial.js'

export default class Slider {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.dragControl = this.experience.camera.dragControls

        // Resource
        this.modelResource = this.resources.items.motorSceneModel

        // Texture
        this.bakedMaterial = new BakedMaterial()
        this.texture = this.bakedMaterial.texture

        // Parameters
        this.maxXpos = 0.3778491592306264
        this.minXpos = 0.265230962973874
        this.Ypos = 0.6229564547538757
        this.Zpos = -0.398499995470047

        this.setModel()
    }

    setModel() {
        this.modelResource.scene.traverse((child) => {
            if (child.name === 'slider') {
                this.model = child
                this.model.material = this.texture
            }
        })

        this.scene.add(this.model)
        this.dragControl.objects.push(this.model)
    }

    update() {
        if (this.model.position.x > this.maxXpos) {
            this.model.position.x = this.maxXpos
        }
        if (this.model.position.x < this.minXpos) {
            this.model.position.x = this.minXpos
        }
        this.model.position.y = this.Ypos
        this.model.position.z = this.Zpos
    }
}