import * as THREE from 'three'
import Experience from '../Experience.js'
import BakedMaterial from './BakedMaterial.js'

export default class SceneStatic {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources

        // Resource
        this.modelResource = this.resources.items.motorSceneModel

        // Texture
        this.bakedMaterial = new BakedMaterial()
        this.texture = this.bakedMaterial.texture

        // Material
        this.lampMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff })
        this.logoBGMaterial = new THREE.MeshBasicMaterial({ color: 0xeeeeee })

        this.setModel()
    }

    setModel() {
        this.modelResource.scene.traverse((child) => {
            if (child.name === 'wallLight') {
                this.wallLight = child
                this.wallLight.material = this.lampMaterial
            } else if (child.name === 'logoBG') {
                this.logoBG = child
                this.logoBG.material = this.logoBGMaterial
            } else if (child.name === 'mainBaked') {
                this.staticBakedObject = child
                this.staticBakedObject.material = this.texture
            }
        })

        this.scene.add(this.wallLight)
        this.scene.add(this.logoBG)
        this.scene.add(this.staticBakedObject)
    }
}