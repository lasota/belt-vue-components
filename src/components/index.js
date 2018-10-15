import Vue from 'vue'
import BeltClip from './BeltClip.vue'

const Components = {
    BeltClip
}

Object.keys(Components).forEach(name => {
    Vue.component(name, Components[name])
})


import CloudinaryDriver from '../helpers/ImageDrivers/CloudinaryDriver'
import S3Driver from '../helpers/ImageDrivers/S3Driver'

const Helpers = {
    ImageDrivers: {
        CloudinaryDriver,
        S3Driver
    }
}

export { Helpers }

export default Components