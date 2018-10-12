export default class BaseImageDriver {
    constructor(params) {
        this.height = params.height ? params.height : 0
        this.width = params.width ? params.width : 0
        this.image = params.image ? params.image : ''
    }
}