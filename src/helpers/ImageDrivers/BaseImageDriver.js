export default class BaseImageDriver {
    constructor(image, params) {
        this.setImage(image)
        this.setParams(params)
    }

    paramsContain(field) {
        return _.has(this.params, field) && this.params[field]
    }

    setImage(image) {
        this.image = image ? image : null
    }

    setParams(params) {
        this.height = params.height ? params.height : 0
        this.width = params.width ? params.width : 0
        this.params =  params
    }

    updateHeight(height) {
        this.height = height ? height : 0
        this.params.height = this.height
    }

    updateWidth(width) {
        this.width = width ? width : 0
        this.params.width = this.width
    }
}