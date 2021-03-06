<template>

    <img v-if="source" 
        :src="source"
        :alt="image.alt"
        :style="styles"
        :class="classes"
        @load="loaded"
    >

</template>

<script>
    import AWSDriver from '../helpers/ImageDrivers/S3Driver'
    import CloudinaryDriver from '../helpers/ImageDrivers/CloudinaryDriver'

    export default {
        props: {
            classes: {
                type: String,
                default: ''
            },
            cloudinaryConfig: {
                default: () => {
                    return { crop: 'fit' }
                }
            },
            attachment: {
                type: Object,
                required: true,
                default: () => {
                    return {
                        alt: '',
                        driver: 'local',
                        is_image: true,
                        src: 'https://placekitten.com/358/200',
                        height: 200,
                        width: 300
                    }
                }
            },
            maxHeight: {
                type: Number,
                default: null
            },
            maxWidth: {
                type: Number,
                default: null
            },
            params: {
                type: Object,
                default: () => { return {} }
            },
            recipe: {
                type: Array,
                default: () => {
                    return []
                }
            }
        },
        data() {
            return {
                image_driver: null
            }
        },
        computed: {
            hasWidth() {
                return _.has(this.currentRecipe, 'width')
            },
            hasHeight() {
                return _.has(this.currentRecipe, 'height')
            },
            currentRecipe() {
                let matching_index = null;

                _.each(this.recipe, (size, index) => {
                    let screens = size.screens.split(',')

                    if( _.indexOf(screens, this.$mq) > -1 ) {
                        matching_index = index
                    }
                });

                return matching_index !== null ? this.recipe[matching_index] : this.defaultRecipe
            },
            defaultRecipe() {
                let default_index = null;

                _.each(this.recipe, (size,index) => {
                    let screens = size.screens.split(',')

                    if( _.indexOf(screens, 'default') > -1 ) {
                        default_index = index
                        return
                    }
                });

                return default_index !== null ? this.recipe[default_index] : {}
            },
            image() {
                return _.has(this.attachment, 'is_image') && this.attachment.is_image ? this.attachment : {}
            },
            source() {

                if(this.image_driver) {
                    this.image_driver.setImage(this.image)
                    this.image_driver.updateHeight(this.height)
                    this.image_driver.updateWidth(this.width)
                    return this.image_driver.source()
                }

                return this.image.src
            },
            styles() {
                let styles = {};

                if( this.maxHeight ) {
                    styles.maxHeight = this.maxHeight + 'px'
                }

                if( this.maxWidth ) {
                    styles.maxWidth = this.maxWidth + 'px'
                }

                return styles;
            },
            height() {
                return this.hasHeight ? this.currentRecipe.height : ''
            },
            width() {
                return this.hasWidth ? this.currentRecipe.width : ''
            }
        },
        created() {
            let params = this.params
            params.height = this.height
            params.width = this.width

            if( _.get(this.image, 'driver') == 's3' ) {
                this.image_driver = new AWSDriver(this.image, params)
            }

            if( _.get(this.image, 'driver') == 'cloudinary' ) {
                this.image_driver = new CloudinaryDriver(this.image, params)
            }
        },
        methods: {
            loaded() {
                this.$emit('belt-clip-load')
            }
        }
    }
</script>
