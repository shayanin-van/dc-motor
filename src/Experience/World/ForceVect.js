import Experience from '../Experience.js'
import * as THREE from 'three'

export default class ForceVect {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.world = this.experience.world
        this.resources = this.experience.resources
        this.ui = this.experience.debug.tab.pages[1]

        // Parameters
        this.isShowed = false
        this.minLength = 0.038
        this.color = 'blue'
        this.headLength = 0.01
        this.headWidth = 0.008

        // UI
        this.ui.addBinding(this, 'isShowed', {
            label: 'เวกเตอร์แรง'
        })

        // Label
        this.labelGeometry = new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(new Float32Array([0, 1, 0]), 3))
        this.labelMaterial = new THREE.PointsMaterial({
            size: 0.08,
            sizeAttenuation: true,
            color: this.color,
            alphaMap: this.resources.items.forceLabelTexture,
            transparent: true,
        })

        this.setModel()
    }

    setModel() {
        this.vect1 = new THREE.ArrowHelper(
            new THREE.Vector3(0, -1, 0),
            new THREE.Vector3(0, 0, 0),
            this.minLength,
            this.color,
            this.headLength,
            this.headWidth
        )
        this.vect2 = new THREE.ArrowHelper(
            new THREE.Vector3(0, 1, 0),
            new THREE.Vector3(0, 0, 0),
            this.minLength,
            this.color,
            this.headLength,
            this.headWidth
        )

        this.vect1Label = new THREE.Points(this.labelGeometry, this.labelMaterial)
        this.vect2Label = new THREE.Points(this.labelGeometry, this.labelMaterial)

        this.vect1.cone.add(this.vect1Label)
        this.vect2.cone.add(this.vect2Label)

        this.scene.add(this.vect1)
        this.scene.add(this.vect2)

        this.hide()
    }

    update() {
        // position
        this.vect1.position.copy(this.world.rightHands.hand1.getWorldPosition(new THREE.Vector3(0, 0, 0)))
        this.vect2.position.copy(this.world.rightHands.hand2.getWorldPosition(new THREE.Vector3(0, 0, 0)))

        // Length
        this.vect1.setLength((this.world.rotor.current/this.world.rotor.minCurrent)*this.minLength, this.headLength, this.headWidth)
        this.vect2.setLength((this.world.rotor.current/this.world.rotor.minCurrent)*this.minLength, this.headLength, this.headWidth)

        // Visibility
        if (this.isShowed && this.world.switch.isOn) {
            this.show()
        } else {
            this.hide()
        }
    }

    hide() {
        this.vect1.visible = false
        this.vect2.visible = false
    }

    show() {
        this.vect1.visible = true
        this.vect2.visible = true
    }
}