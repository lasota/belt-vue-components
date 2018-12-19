import BaseImageDriver from './BaseImageDriver'

export default class extends BaseImageDriver {
    constructor(image, params) {
        super(image, params)

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

                let scheme = (!_.isEmpty(this.image.secure) ? 'https' : 'http') + '://'

                let host = `${this.config.BUCKET}.s3-website-${this.config.REGION}.amazonaws.com`

                if (this.config.CLOUDFRONT) {
                    host = this.config.CLOUDFRONT
                }
                
                let image_path = this.image.path ? `${this.image.path}/` : ''
                let path = this.security_key() + this.fit_in() + '/' + this.dimensions() + this.smart_crop() + this.filter() + '/' + image_path + this.image.name

                return scheme + host + path
            }
        }

        return this.image.src
    }

    dimensions() {
        //todo test and require at least one?
        return `${this.width}x${this.height}`
    }

    security_key() {
        return this.paramsContain('safeurl') ? `/${this.params.safeurl}` : ''
    }

    fit_in() {
        return this.paramsContain('fit_in') ? `/${this.params.fit_in}` : ''
    }

    smart_crop() {
        return this.paramsContain('smart_crop') ? '/smart' : ''
    }

    filter() {
        let filter = ''

        filter += this.paramsContain('brightness') ? ':brightness(' + this.params.brightness + ')' : ''
        filter += this.paramsContain('contrast') ? ':contrast(' + this.params.contrast + ')' : ''
        filter += this.paramsContain('blur') ? ':blur(' + this.params.blur + ')' : ''
        filter += this.paramsContain('sharpen') ? ':sharpen(' + this.params.sharpen + ')' : ''
        filter += this.paramsContain('fill') ? ':fill(' + this.params.fill + ')' : ''
        
        filter += this.paramsContain('background_color') ? ':background_color(' + this.params.background_color + ')' : ''
        filter += this.paramsContain('format') ? ':format(' + this.params.format + ')' : ''
        filter += this.paramsContain('convolution') ? ':convolution(' + this.params.convolution + ')' : ''
        filter += this.paramsContain('rotate') ? ':rotate(' + this.params.rotate + ')' : ''
        filter += this.paramsContain('max_bytes') ? ':max_bytes(' + this.params.max_bytes + ')' : ''

        filter += this.paramsContain('quality') ? ':quality(' + this.params.quality + ')' : ''
        filter += this.paramsContain('noise') ? ':noise(' + this.params.noise + ')' : ''
        filter += this.paramsContain('rgb') ? ':rgb(' + this.params.rgb + ')' : ''
        filter += this.paramsContain('round_corner') ? ':round_corner(' + this.params.round_corner + ')' : ''
        filter += this.paramsContain('grayscale') ? ':grayscale()' : ''

        filter += this.paramsContain('equalize') ? ':equalize()' : ''
        filter += this.paramsContain('strip_icc') ? ':strip_icc()' : ''
        filter += this.paramsContain('watermark') ? ':watermark(' + this.params.watermark + ')' : ''

        if (filter) {
            filter = '/filters' + filter
        }

        return filter
    }
}

/*  
    param options
    {
        //dimensions
        height: 0,
        width: 0,

        //options
        safeurl: '',  //security_key
        fit_in: '', //adaptive-fit-in, full-fit-in, fit-in
        smart_crop: false, //boolean

        //filters
        brightness: ''//integer -100 to 100
        contrast: , ''//integer -100 to 100
        blur: '', //integer 1 to 150
        sharpen: '', //
        fill: '', //hex value
        background_color: '', //hex value
        format: , //jpeg, png, webp, gif
        convolution: '', //
        rotate: '', //0, 90, 180, 270
        max_bytes: '', //integer
        quality: '', //integer 0 to 100
        noise: '', //integer 0 to 100
        rgb: '', //
        round_corner: '', //a|b,r,g,b
        grayscale: false, //boolean for black & white
        equalize: false, //boolean
        strip_icc: false, //boolean
        watermark: '', //https://path-to-watermark,75,0,0 path with coordinates

    }
*/