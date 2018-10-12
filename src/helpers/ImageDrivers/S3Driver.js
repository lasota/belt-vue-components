import BaseImageDriver from './BaseImageDriver'
let URI = require('uri-js/dist/es5/uri.all.min')

export default class extends BaseImageDriver {
    constructor(params) {
        super(params)

        this.config = this.config()
    }

    config() {
        let object  = {}

        if( process.env.VUE_APP_AWS_BUCKET && process.env.VUE_APP_AWS_REGION ) {
            object.BUCKET = process.env.VUE_APP_AWS_BUCKET
            object.REGION = process.env.VUE_APP_AWS_REGION

            if( process.env.VUE_APP_AWS_CLOUDFRONT ) {
                object.CLOUDFRONT = process.env.VUE_APP_AWS_CLOUDFRONT
            }
        }

        if( process.env.MIX_AWS_BUCKET && process.env.MIX_AWS_REGION ) {
            object.BUCKET = process.env.MIX_AWS_BUCKET
            object.REGION = process.env.MIX_AWS_REGION

            if( process.env.MIX_AWS_CLOUDFRONT ) {
                object.CLOUDFRONT = process.env.MIX_AWS_CLOUDFRONT
            }
        }

        return object
    }

    source() {

        if( this.config ) {
            if (this.height || this.width) {
                let host = `${this.config.BUCKET}.s3-website-${this.config.REGION}.amazonaws.com`

                if (this.config.CLOUDFRONT) {
                    host = this.config.CLOUDFRONT
                }

                let height = this.height
                let width = this.width
                let resizeDir = `${width}x${height}`

                let path = this.image.path ? this.image.path + '/' : ''

                return URI.serialize({
                    // scheme : !_.isEmpty(this.image.secure) ? 'https' : 'http',
                    scheme: '//',
                    host: host,
                    path: resizeDir + '/' + path + this.image.name
                })
            }
        }

        return this.image.src
    }
}