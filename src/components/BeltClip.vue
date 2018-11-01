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
        created() {
            let params = this.params
            params.height = this.params.height
            params.width = this.params.width

            this.AWS = new AWSDriver(this.image, params)
            this.CLOUDINARY = new CloudinaryDriver(this.image, params)
        },
        data() {
            return {
                AWS: null,
                CLOUDINARY: null
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
                return this.attachment
            },
            source() {
                if( _.has(this.image, 'driver') && this.image.driver == 's3' ) {
                    //return this.s3Source();
                    this.AWS.height = this.height
                    this.AWS.width = this.width
                    return this.AWS.source()
                }

                if( _.has(this.image, 'driver') && this.image.driver == 'cloudinary' ) {
                    this.CLOUDINARY.height = this.height
                    this.CLOUDINARY.width = this.width 
                    return this.CLOUDINARY.source()
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
        methods: {
            loaded() {
                this.$emit('belt-clip-load')
            }
        },
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
        }
    }
</script>
