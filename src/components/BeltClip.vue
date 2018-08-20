<template>
    <img v-if="source" :src="source" :alt="image.alt" :class="classes">
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

                return default_index !== null ? this.recipe[default_index] : this.default;
            },
            height() {
                return _.has(this.currentRecipe, 'height') ? this.currentRecipe.height : null;
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
            width() {
                return _.has(this.currentRecipe, 'width') ? this.currentRecipe.width : null;
            }
        },
        methods: {
            cloudinarySource() {
                let cl = new cloudinary.Cloudinary({cloud_name: process.env.MIX_CLOUDINARY_NAME, secure: true});

                let config = {
                    crop: 'fill'
                }

                if( this.height ) {
                    config.height = this.height;
                }

                if( this.width ) {
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

                        let height = this.height ? this.height : this.width / (this.image.width/this.image.height);
                        let width = this.width ? this.width : this.height * (this.image.width/this.image.height);
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
        },
        props: {
            classes: {
                type: String,
                default: ''
            },
            attachment: {
                type: Object,
                default: () => {
                    return {
                        alt: '',
                        driver: 'local',
                        src: 'https://placekitten.com/358/200'
                    }
                }
            },
            recipe: {
                type: Array,
                default: () => {
                    return [{
                        screens: 'default',
                        height: null,
                        width: null
                    }]
                }
            }
        }
    }
</script>
