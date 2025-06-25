import Experience from '../Experience.js'
import * as THREE from 'three'

export default class Field {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.time = this.experience.time

        // Parameters
        this.nRows = 3
        this.nCols = 4
        this.zStart = 0.2
        this.zEnd = -0.2
        this.xMin = -0.09
        this.xMax = 0.09
        this.yMin = 0.58
        this.yMax = 0.77
        this.xRange = this.xMax - this.xMin
        this.yRange = this.yMax - this.yMin

        // Shader Variable
        this.timeUniform = {
            uTime: {value: 0}
        }

        // Material
        this.material = new THREE.LineDashedMaterial({
            color: 'green',
            dashSize: 0.02,
            gapSize: 0.02
        })
        this.material.onBeforeCompile = (shader) => {
            shader.uniforms.uTime = this.timeUniform.uTime
            shader.fragmentShader = shader.fragmentShader.replace(
                'uniform float totalSize;', 'uniform float totalSize; uniform float uTime;'
            )
            shader.fragmentShader = shader.fragmentShader.replace(
                'mod( vLineDistance, totalSize ) > dashSize', 'mod( vLineDistance + uTime, totalSize ) > dashSize'
            )
        }

        this.setModel()
    }

    setModel() {
        this.endPoints = [];
        for (let j = 0; j < this.nCols; j++) {
            for (let i = 0; i < this.nRows; i++) {
                this.endPoints.push(new THREE.Vector3(this.xMin + i*this.xRange/(this.nRows - 1), this.yMin + j*this.yRange/(this.nCols - 1), this.zStart))
                this.endPoints.push(new THREE.Vector3(this.xMin + i*this.xRange/(this.nRows - 1), this.yMin + j*this.yRange/(this.nCols - 1), this.zEnd))
            }
        }
    
        this.geometry = new THREE.BufferGeometry().setFromPoints(this.endPoints)
    
        this.model = new THREE.LineSegments(this.geometry, this.material)
        this.model.computeLineDistances()

        this.scene.add(this.model)
    }

    update() {
        this.timeUniform.uTime.value += -this.time.delta/10
    }
}