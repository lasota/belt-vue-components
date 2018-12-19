import BeltClip from './BeltClip.vue'

const Components = {
    BeltClip
}

import CloudinaryDriver from '../helpers/ImageDrivers/CloudinaryDriver'
import S3Driver from '../helpers/ImageDrivers/S3Driver'

const Helpers = {
    ImageDrivers: {
        CloudinaryDriver,
        S3Driver
    }
}

export {
    BeltClip,
    Helpers
}

export default Components