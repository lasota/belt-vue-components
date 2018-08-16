<template>
    <img v-if="source" :src="source" :alt="image.alt">
</template>
<script>
    import cloudinary from 'cloudinary-core';
    let URI = require('uri-js/dist/es5/uri.all.min');

    export default {
        computed: {
            height() {
                if( _.has(this.mobileRecipe, 'height')  && !this.isDesktop ) {
                    return this.mobileRecipe.height;
                }
                return _.has(this.recipe, 'height') ? this.recipe.height : null;
            },
            isDesktop() {
                return _.includes(['lg', 'xl'], this.$mq);
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
                if( _.has(this.mobileRecipe, 'width')  && !this.isDesktop ) {
                    return this.mobileRecipe.width;
                }

                return _.has(this.recipe, 'width') ? this.recipe.width : null
            },
            image() {
                return this.attachment;
            },

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

                if( this.recipe.height || this.recipe.width ) {
                    let host = `${process.env.MIX_AWS_BUCKET}.s3-website-${process.env.MIX_AWS_REGION}.amazonaws.com`

                    if( process.env.MIX_AWS_CLOUDFRONT  ) {
                        host = process.env.MIX_AWS_CLOUDFRONT;
                    }

                    let height = this.height;
                    let width = this.width;
                    let resizeDir = `${width}x${height}`;

                    let path = this.image.path ? this.image.path + '/' : '';

                    return URI.serialize({
                        // scheme : !_.isEmpty(this.image.secure) ? 'https' : 'http',
                        scheme : '//',
                        host : host,
                        path: resizeDir + '/' + path +  this.image.name
                    });
                }

                return this.image.src;
            },
        },
        props: {
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
            mobileRecipe: {
                type: Object,
                default: null
            },
            recipe: {
                type: Object,
                default: () => {
                    return {
                        height: null,
                        width: null
                    }
                }
            }
        }
    }
</script>
