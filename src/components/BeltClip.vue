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
    import cloudinary from 'cloudinary-core';
    let URI = require('uri-js/dist/es5/uri.all.min');

    export default {
        computed: {
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
            },
            CLOUDFRONT() {
                let object = {};

                    if( process.env.VUE_APP_CLOUDINARY_NAME ) {
                        object.NAME = process.env.VUE_APP_CLOUDINARY_NAME;
                    }

                    if( process.env.MIX_CLOUDINARY_NAME ) {
                        object.NAME = process.env.MIX_CLOUDINARY_NAME;
                    }

                return object;
            },
            currentRecipe() {
                let matching_index = null;

                _.each(this.recipe, (size, index) => {
                    let screens = size.screens.split(',');
                    if( _.indexOf(screens, this.$mq) > -1 ) {
                        matching_index = index;
                    }
                });

                return matching_index !== null ? this.recipe[matching_index] : this.defaultRecipe;
            },
            defaultRecipe() {
                let default_index = null;

                _.each(this.recipe, (size,index) => {
                    let screens = size.screens.split(',');
                    if( _.indexOf(screens, 'default') > -1 ) {
                        default_index = index;
                        return;
                    }
                });

                return default_index !== null ? this.recipe[default_index] : {};
            },
            height() {

                if(_.has(this.currentRecipe, 'height')) {
                    return this.currentRecipe.height;
                }

                if(_.has(this.currentRecipe, 'width')) {
                    return Math.floor( this.width / (this.image.width/this.image.height) );
                }

                return  this.image.height;

            },
            image() {
                return this.attachment;
            },
            source() {
                if( _.has(this.image, 'driver') && this.image.driver == 's3' ) {
                    return this.s3Source();
                }

                if( _.has(this.image, 'driver') && this.image.driver == 'cloudinary' ) {
                    return this.cloudinarySource();
                }

                if( this.image ) {
                    return this.image.src;
                }

                return false;
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
                    return Math.floor( this.height * (this.image.width/this.image.height) );
                }

                return  this.image.width;

            }
        },
        methods: {
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
            },
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
            },
            loaded() {
                this.$emit('belt-clip-load');
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
