let URI = require('uri-js/dist/es5/uri.all.min');

export default class BeltClipDriverHelper {
    constructor(width = 0, height =  0) {
        this.width = width
        this.height = height

        this.AWS = this.AWS()
        this.CLOUDINARY = this.CLOUDFRONT()
    }

    AWS() {
        let object  = {};

        if( process.env.VUE_APP_AWS_BUCKET && process.env.VUE_APP_AWS_REGION ) {
            object.BUCKET = process.env.VUE_APP_AWS_BUCKET;
            object.REGION = process.env.VUE_APP_AWS_REGION;

            if( process.env.VUE_APP_AWS_CLOUDFRONT ) {
                object.CLOUDFRONT = process.env.VUE_APP_AWS_CLOUDFRONT;
            }
        }

        if( process.env.MIX_AWS_BUCKET && process.env.MIX_AWS_REGION ) {
            object.BUCKET = process.env.MIX_AWS_BUCKET;
            object.REGION = process.env.MIX_AWS_REGION;

            if( process.env.MIX_AWS_CLOUDFRONT ) {
                object.CLOUDFRONT = process.env.MIX_AWS_CLOUDFRONT;
            }
        }

        return object;
    }

    CLOUDFRONT() {
        let object = {};

            if( process.env.VUE_APP_CLOUDINARY_NAME ) {
                object.NAME = process.env.VUE_APP_CLOUDINARY_NAME;
            }

            if( process.env.MIX_CLOUDINARY_NAME ) {
                object.NAME = process.env.MIX_CLOUDINARY_NAME;
            }

        return object;
    }

    cloudinarySource() {
        let cl = new cloudinary.Cloudinary({cloud_name: process.env.MIX_CLOUDINARY_NAME, secure: true});

        let config = {
            crop: 'fill'
        }

        if( _.has(this.currentRecipe, 'height') ) {
            config.height = this.height;
        }

        if( _.has(this.currentRecipe, 'width') ) {
            config.width = this.width;
        }

        return cl.url(this.image.rel_path, config);
    }

    s3Source() {
        if( this.AWS ) {
            if (this.height || this.width) {
                let host = `${this.AWS.BUCKET}.s3-website-${this.AWS.REGION}.amazonaws.com`

                if (this.AWS.CLOUDFRONT) {
                    host = this.AWS.CLOUDFRONT;
                }

                let height = this.height;
                let width = this.width;
                let resizeDir = `${width}x${height}`;

                let path = this.image.path ? this.image.path + '/' : '';

                return URI.serialize({
                    // scheme : !_.isEmpty(this.image.secure) ? 'https' : 'http',
                    scheme: '//',
                    host: host,
                    path: resizeDir + '/' + path + this.image.name
                });
            }
        }

        return this.image.src;
    }
}