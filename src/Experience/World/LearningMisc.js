import Experience from '../Experience.js'
import * as THREE from 'three'
import { LineSegments2 } from 'three/examples/jsm/lines/LineSegments2.js'
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js'
import { LineSegmentsGeometry } from 'three/examples/jsm/lines/LineSegmentsGeometry.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'

export default class LearningMisc {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.world = this.experience.world
        this.resources = this.experience.resources

        // loader
        this.fontLoader = new FontLoader()

        this.setDirectionModel()
        this.setWidthLine()
        this.setHalfWidthLine()
        this.setAxisLine()
        this.setTheta()
        this.setForceLine()
        this.setMomentArmLine()
        this.setLengthLine()
        this.setArea()
        this.setCurrentLabel()

        this.setZero()
    }

    setDirectionModel() {
        let thickness = 0.012
        let radius = 0.028
        let headSize = 0.016
        let nSection = 12
        this.directionShape = new THREE.Shape()
        this.directionShape.moveTo(-(radius + thickness/2), 0)
        for (let i = 1; i <= nSection; i++) {
            this.directionShape.lineTo(-(radius + thickness/2)*Math.cos(i*Math.PI/nSection), (radius + thickness/2)*Math.sin(i*Math.PI/nSection))
        }
        this.directionShape.lineTo(radius + thickness/2 + headSize/2, 0)
        this.directionShape.lineTo(radius, -headSize)
        this.directionShape.lineTo(radius - thickness/2 - headSize/2, 0)
        this.directionShape.lineTo(radius - thickness/2, 0)
        for (let i = 1; i <= nSection; i++) {
            this.directionShape.lineTo((radius - thickness/2)*Math.cos(i*Math.PI/nSection), (radius - thickness/2)*Math.sin(i*Math.PI/nSection))
        }

        this.directionGeo = new THREE.ShapeGeometry(this.directionShape)
        this.directionMat = new THREE.MeshBasicMaterial({color: 'yellow'})
        this.direction = new THREE.Mesh(this.directionGeo, this.directionMat)

        this.direction.position.set(-0.15, 0.68, 0)
        this.direction.rotation.y = -Math.PI/2
        
        this.scene.add(this.direction)
    }

    setWidthLine() {
        this.widthLineEndPoints = [
            -0, 0, -0.1, 
            -0, 0, 0.1, 
            0.01, 0, -0.1, 
            -0.01, 0, -0.1, 
            0.01, 0, 0.1, 
            -0.01, 0, 0.1, 
        ]
    
        this.widthLineGeo = new LineSegmentsGeometry().setPositions(this.widthLineEndPoints)
        this.widthLineMat = new LineMaterial({color: 'red'})
        this.widthLineMat.linewidth = 3
    
        this.widthLine = new LineSegments2(this.widthLineGeo, this.widthLineMat)
        this.widthLine.position.x = -0.12

        this.world.rotor.model.add(this.widthLine)

        this.widthLabelGeometry = new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(new Float32Array([-0.14, 0.68, 0]), 3))
        this.widthLabelMaterial = new THREE.PointsMaterial({
            size: 0.08,
            sizeAttenuation: true,
            color: 'red',
            alphaMap: this.resources.items.widthLabelTexture,
            transparent: true,
        })
        this.widthLabel = new THREE.Points(this.widthLabelGeometry, this.widthLabelMaterial)
        this.scene.add(this.widthLabel)
    }

    setHalfWidthLine() {
        this.halfWidthLineEndPoints = [
            0, 0, 0, 
            0, 0.1*Math.sin(Math.PI/6),  -0.1*Math.cos(Math.PI/6), 
            -0.01, 0.1*Math.sin(Math.PI/6), -0.1*Math.cos(Math.PI/6), 
            0.01, 0.1*Math.sin(Math.PI/6), -0.1*Math.cos(Math.PI/6), 
            -0.01, 0, 0, 
            0.01, 0, 0, 
        ]
    
        this.halfWidthLineGeo = new LineSegmentsGeometry().setPositions(this.halfWidthLineEndPoints)
        this.halfWidthLineMat = new LineMaterial({color: 'red'})
        this.halfWidthLineMat.linewidth = 3
    
        this.halfWidthLine = new LineSegments2(this.halfWidthLineGeo, this.halfWidthLineMat)
        this.halfWidthLine.position.y = 0.68

        this.scene.add(this.halfWidthLine)

        this.halfWidthLabelGeometry = new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(new Float32Array([0, 0.72, -0.04]), 3))
        this.halfWidthLabelMaterial = new THREE.PointsMaterial({
            size: 0.08,
            sizeAttenuation: true,
            color: 'red',
            alphaMap: this.resources.items.halfWidthLabelTexture,
            transparent: true,
        })
        this.halfWidthLabel = new THREE.Points(this.halfWidthLabelGeometry, this.halfWidthLabelMaterial)
        this.scene.add(this.halfWidthLabel)
    }

    setAxisLine() {
        this.axisLineEndPoints = []
        this.axisLineEndPoints.push(new THREE.Vector3(-0.112, 0, 0))
        this.axisLineEndPoints.push(new THREE.Vector3(0.15, 0, 0))
    
        this.axisLineGeo = new THREE.BufferGeometry().setFromPoints(this.axisLineEndPoints)
        this.axisLineMat = new THREE.LineDashedMaterial({color: 'white', dashSize: 0.02, gapSize: 0.02})
    
        this.axisLine = new THREE.LineSegments(this.axisLineGeo, this.axisLineMat)
        this.axisLine.computeLineDistances()

        this.world.rotor.model.add(this.axisLine)
    }

    setTheta() {
        this.thetaEndPoints = [
            new THREE.Vector3(0, 0, -0.05),
            new THREE.Vector3(0, 0.05*Math.sin(0.25*Math.PI/6), -0.05*Math.cos(0.25*Math.PI/6)),
            new THREE.Vector3(0, 0.05*Math.sin(0.5*Math.PI/6), -0.05*Math.cos(0.5*Math.PI/6)),
            new THREE.Vector3(0, 0.05*Math.sin(0.75*Math.PI/6), -0.05*Math.cos(0.75*Math.PI/6)),
            new THREE.Vector3(0, 0.05*Math.sin(Math.PI/6), -0.05*Math.cos(Math.PI/6)),
        ]
        this.thetaGeo = new THREE.BufferGeometry().setFromPoints(this.thetaEndPoints)
        this.thetaMat = new THREE.LineBasicMaterial({color: 'red'})
        this.theta = new THREE.Line(this.thetaGeo, this.thetaMat)
        this.theta.position.set(0, 0.68, 0)

        this.thetaHorLineEndPoints = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, -0.1*Math.cos(Math.PI/6))]
        this.thetaHorLineGeo = new THREE.BufferGeometry().setFromPoints(this.thetaHorLineEndPoints)
        this.thetaHorLineMat = new THREE.LineBasicMaterial({color: 'white'})
        this.thetaHorLine = new THREE.LineSegments(this.thetaHorLineGeo, this.thetaHorLineMat)

        this.thetaPlaneLineEndPoints = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0 + 0.1*Math.sin(Math.PI/6), -0.1*Math.cos(Math.PI/6))]
        this.thetaPlaneLineGeo = new THREE.BufferGeometry().setFromPoints(this.thetaPlaneLineEndPoints)
        this.thetaPlaneLineMat = new THREE.LineBasicMaterial({color: 'white'})
        this.thetaPlaneLine = new THREE.LineSegments(this.thetaPlaneLineGeo, this.thetaPlaneLineMat)

        this.thetaLabelGeometry = new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(new Float32Array([0, 0.69, -0.038]), 3))
        this.thetaLabelMaterial = new THREE.PointsMaterial({
            size: 0.08,
            sizeAttenuation: true,
            color: 'red',
            alphaMap: this.resources.items.thetaLabelTexture,
            transparent: true,
        })
        this.thetaLabel = new THREE.Points(this.thetaLabelGeometry, this.thetaLabelMaterial)

        this.theta.add(this.thetaHorLine)
        this.theta.add(this.thetaPlaneLine)
        this.scene.add(this.theta)
        this.scene.add(this.thetaLabel)
    }

    setForceLine() {
        this.forceLineEndPoints = []
        this.forceLineEndPoints.push(new THREE.Vector3(0, 0, 0))
        this.forceLineEndPoints.push(new THREE.Vector3(0, -0.1, 0))
    
        this.forceLineGeo = new THREE.BufferGeometry().setFromPoints(this.forceLineEndPoints)
        this.forceLineMat = new THREE.LineDashedMaterial({color: 'blue', dashSize: 0.008, gapSize: 0.008})
    
        this.forceLine = new THREE.LineSegments(this.forceLineGeo, this.forceLineMat)
        this.forceLine.computeLineDistances()

        this.world.forceVect.vect2.add(this.forceLine)
    }

    setMomentArmLine() {
        this.momentArmLineEndPoints = [
            0, 0, 0, 
            0, 0, -0.1*Math.cos(Math.PI/6), 
            0, 0, -0.1*Math.cos(Math.PI/6), 
            0, 0.01, -0.1*Math.cos(Math.PI/6), 
            0, 0.01, -0.1*Math.cos(Math.PI/6), 
            0, 0.01, -0.1*Math.cos(Math.PI/6) + 0.01, 
            0, 0.01, -0.1*Math.cos(Math.PI/6) + 0.01, 
            0, 0, -0.1*Math.cos(Math.PI/6) + 0.01, 
        ]
    
        this.momentArmLineGeo = new LineSegmentsGeometry().setPositions(this.momentArmLineEndPoints)
        this.momentArmLineMat = new LineMaterial({color: 'red'})
        this.momentArmLineMat.linewidth = 3
    
        this.momentArmLine = new LineSegments2(this.momentArmLineGeo, this.momentArmLineMat)
        this.momentArmLine.position.y = 0.68

        this.scene.add(this.momentArmLine)

        this.momentArmLabelGeometry = new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(new Float32Array([0, 0.664, -0.05]), 3))
        this.momentArmLabelMaterial = new THREE.PointsMaterial({
            size: 0.16,
            sizeAttenuation: true,
            color: 'red',
            alphaMap: this.resources.items.momentArmLabelTexture,
            transparent: true,
        })
        this.momentArmLabel = new THREE.Points(this.momentArmLabelGeometry, this.momentArmLabelMaterial)
        this.scene.add(this.momentArmLabel)
    }

    setLengthLine() {
        this.lengthLineEndPoints = [
            -0.1, 0, 0, 
            0.1, 0, 0, 
            -0.1, 0, -0.01, 
            -0.1, 0, 0.01, 
            0.1, 0, -0.01, 
            0.1, 0, 0.01, 
        ]
    
        this.lengthLineGeo = new LineSegmentsGeometry().setPositions(this.lengthLineEndPoints)
        this.lengthLineMat = new LineMaterial({color: 'red'})
        this.lengthLineMat.linewidth = 3
    
        this.lengthLine = new LineSegments2(this.lengthLineGeo, this.lengthLineMat)
        this.lengthLine.position.z = 0.12

        this.world.rotor.model.add(this.lengthLine)

        this.lengthLabelGeometry = new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(new Float32Array([0, 0.68 + 0.14*Math.sin(Math.PI/6), -0.14*Math.cos(Math.PI/6)]), 3))
        this.lengthLabelMaterial = new THREE.PointsMaterial({
            size: 0.08,
            sizeAttenuation: true,
            color: 'red',
            alphaMap: this.resources.items.lengthLabelTexture,
            transparent: true,
        })
        this.lengthLabel = new THREE.Points(this.lengthLabelGeometry, this.lengthLabelMaterial)
        this.scene.add(this.lengthLabel)
    }

    setArea() {
        this.areaPlaneGeo = new THREE.PlaneGeometry(0.2, 0.2, 1, 1)
        this.areaPlaneMat = new THREE.MeshStandardMaterial({color: 'cyan', transparent: true, opacity: 0.4})
        this.areaPlaneMat.side = THREE.DoubleSide
        this.areaPlane = new THREE.Mesh(this.areaPlaneGeo, this.areaPlaneMat)
        this.areaPlane.rotation.x = Math.PI/2

        this.fontLoader.load('fonts/helvetiker_regular.typeface.json',
            (font) => {
                let letterAGeometry = new TextGeometry('A', {
                    font: font,
                    size: 0.1,
                    depth: 0.0004,
                });
                let letterAMaterial = new THREE.MeshBasicMaterial({color: 'cyan'})
                letterAGeometry.computeBoundingBox()
                letterAGeometry.translate(
                    - letterAGeometry.boundingBox.max.x * 0.5,
                    - letterAGeometry.boundingBox.max.y * 0.5,
                    - letterAGeometry.boundingBox.max.z * 0.5
                )
                this.letterA = new THREE.Mesh(letterAGeometry, letterAMaterial)
                this.letterA.rotation.set(0, 0, -Math.PI/2)
                this.areaPlane.add(this.letterA)
            }
        )

        this.world.rotor.model.add(this.areaPlane)
    }

    setCurrentLabel() {
        this.currentLabelGeometry = new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(new Float32Array([0.12, 0.68 + 0.1*Math.sin(Math.PI/6), -0.1*Math.cos(Math.PI/6)]), 3))
        this.currentLabelMaterial = new THREE.PointsMaterial({
            size: 0.08,
            sizeAttenuation: true,
            color: '#58c4f5',
            alphaMap: this.resources.items.currentLabelTexture,
            transparent: true,
        })
        this.currentLabel = new THREE.Points(this.currentLabelGeometry, this.currentLabelMaterial)

        this.scene.add(this.currentLabel)
    }

    setZero() {
        this.direction.scale.set(0, 0, 0)
        this.widthLine.scale.set(0, 0, 0)
        this.widthLabel.material.size = 0
        this.lengthLine.scale.set(0, 0, 0)
        this.lengthLabel.material.size = 0
        this.areaPlane.scale.set(0, 0, 0)
        this.currentLabel.material.size = 0
        this.axisLine.scale.set(0, 0, 0)
        this.theta.scale.set(0, 0, 0)
        this.thetaLabel.material.size = 0
        this.forceLine.scale.set(0, 0, 0)
        this.halfWidthLine.scale.set(0, 0, 0)
        this.halfWidthLabel.material.size = 0
        this.momentArmLine.scale.set(0, 0, 0)
        this.momentArmLabel.material.size = 0

        this.widthLine.position.y = 999
        this.lengthLine.position.x = 999
        this.halfWidthLine.position.x = 999
        this.momentArmLine.position.x = 999
    }
}