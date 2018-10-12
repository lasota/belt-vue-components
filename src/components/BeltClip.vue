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
            let params = {
                width: this.width,
                height: this.height,
                image: this.image
            }

            this.AWS = new AWSDriver(params)
            this.CLOUDINARY = new CloudinaryDriver(params)
        },
        data() {
            return {
                AWS: null,
                CLOUDINARY: null
            }
        },
        computed: {
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
            height() {

                if(_.has(this.currentRecipe, 'height')) {
                    return this.currentRecipe.height
                }

                if(_.has(this.currentRecipe, 'width')) {
                    return Math.floor( this.width / (this.image.width/this.image.height) )
                }

                return  this.image.height

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
            width() {

                if(_.has(this.currentRecipe, 'width')) {
                    return this.currentRecipe.width
                }

                if(_.has(this.currentRecipe, 'height')) {
                    return Math.floor( this.height * (this.image.width/this.image.height) )
                }

                return  this.image.width

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
                        src: 'https://placekitten.com/358/200'
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
            recipe: {
                type: Array,
                default: () => {
                    return []
                }
            }
        }
    }
</script>
