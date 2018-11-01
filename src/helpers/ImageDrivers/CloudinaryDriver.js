import BaseImageDriver from './BaseImageDriver'
import cloudinary from 'cloudinary-core'

export default class extends BaseImageDriver {
    constructor(image, params) {
        super(image, params)

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

        let recipe = {
            crop: 'fill'
        }

        if( this.paramsContain('height') ) {
            recipe.height = this.params.height
        }

        if( this.paramsContain('width') ) {
            recipe.width = this.params.width
        }

        return cl.url(this.image.rel_path, recipe)
    }
}