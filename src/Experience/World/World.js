import Experience from '../Experience.js'
import Environment from './Environment.js'
import Rotor from './Rotor.js'
import Switch from './Switch.js'
import Slider from './Slider.js'
import SceneStatic from './SceneStatic.js'
import Field from './Field.js'
import Current from './Current.js'
import RightHands from './RightHands.js'
import ForceVect from './ForceVect.js'
import FieldVect from './FieldVect.js'
import RotorGrab from './RotorGrab.js'
import Learning from './Learning.js'
import LearningMisc from './LearningMisc.js'

export default class World {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources

        // Wait for resources
        this.resources.on('ready', () => {
            // Setup
            this.sceneStatic = new SceneStatic()
            this.rotor = new Rotor()
            this.switch = new Switch()
            this.slider = new Slider()
            this.field = new Field()
            this.current = new Current()
            this.rightHands = new RightHands()
            this.forceVect = new ForceVect()
            this.fieldVect = new FieldVect()
            this.rotorGrab = new RotorGrab()
            this.environment = new Environment()
            // #bett drops the guided chapters for booth demos. LearningMisc
            // only exists to be animated by Learning, so it goes too.
            if (location.hash !== '#bett') {
                this.learningMisc = new LearningMisc()
                this.learning = new Learning()
            }
        })
    }

    update() {
        if (this.slider) {
            this.slider.update()
        }
        if (this.switch) {
            this.switch.update()
        }
        if (this.rotorGrab) {
            this.rotorGrab.update()
        }
        if (this.rotor) {
            this.rotor.update()
        }
        if (this.field) {
            this.field.update()
        }
        if (this.current) {
            this.current.update()
        }
        if (this.rightHands) {
            this.rightHands.update()
        }
        if (this.forceVect) {
            this.forceVect.update()
        }
        if (this.fieldVect) {
            this.fieldVect.update()
        }
        if (this.learning) {
            this.learning.update()
        }
    }
}