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
    import { memberExpression } from 'babel-types';

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
                return _.has(this.attachment, 'is_image') && this.attachment.is_image ? this.attachment : {}
            },
            source() {
                if( _.has(this.image, 'driver') && this.image.driver == 's3' ) {
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
        watch: {
            image() {
                this.AWS.setImage(this.image)
                this.CLOUDINARY.setImage(this.image)
            }
        },
        created() {
            let params = this.params
            params.height = this.height
            params.width = this.width

            this.AWS = new AWSDriver(this.image, params)
            this.CLOUDINARY = new CloudinaryDriver(this.image, params)
        },
        methods: {
            loaded() {
                this.$emit('belt-clip-load')
            }
        }
    }
</script>
