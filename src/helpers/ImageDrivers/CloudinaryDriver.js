import BaseImageDriver from './BaseImageDriver'
import cloudinary from 'cloudinary-core'

export default class extends BaseImageDriver {
    constructor(params) {
        super(params)

        this.config = this.config()
    }

    config() {
        let object = {};

            if( process.env.VUE_APP_CLOUDINARY_NAME ) {
                object.NAME = process.env.VUE_APP_CLOUDINARY_NAME
            }

            if( process.env.MIX_CLOUDINARY_NAME ) {
                object.NAME = process.env.MIX_CLOUDINARY_NAME
            }

        return object;
    }

    source() {
        let cl = new cloudinary.Cloudinary({cloud_name: this.config.NAME, secure: true})

        let config = {
            crop: 'fill'
        }

        if( _.has(this.currentRecipe, 'height') ) {
            config.height = this.height
        }

        if( _.has(this.currentRecipe, 'width') ) {
            config.width = this.width
        }

        return cl.url(this.image.rel_path, config)
    }
}