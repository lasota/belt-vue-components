export default class BaseImageDriver {
    constructor(image, params) {
        this.height = params.height ? params.height : 0
        this.width = params.width ? params.width : 0
        this.image = image ? image : ''
        this.params =  params
    }

    paramsContain(field) {
        return _.has(this.params, field) && this.params[field]
    }
}