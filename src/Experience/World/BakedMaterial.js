import * as THREE from 'three'
import Experience from '../Experience.js'

let instance = null

export default class BakedMaterial {
    constructor() {
        // Singleton
        if (instance) {
            return instance
        }
        instance = this

        this.experience = new Experience()
        this.resources = this.experience.resources

        // Resource
        this.textureResource = this.resources.items.motorSceneTexture
        this.textureResource.colorSpace = THREE.SRGBColorSpace
        this.textureResource.flipY = false

        this.texture = new THREE.MeshBasicMaterial({map: this.textureResource})
    }
}