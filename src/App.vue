<template>
    <div id="app">
        <div class="belt-clip">
            <belt-clip :attachment="image" :recipe="recipes.header" v-if="image"></belt-clip>
        </div>
        <div class="belt-clip">
            <belt-clip :attachment="image" :recipe="recipes.hero" v-if="image" :params="{grayscale: true}"></belt-clip>
        </div>
        <div class="belt-clip">
            <belt-clip :attachment="image" :recipe="recipes.thumb" v-if="image"></belt-clip>
        </div>
        <div class="belt-clip">
            <belt-clip :attachment="image" :max-width="100" v-if="image"></belt-clip>
        </div>

        <img alt="Vue logo" src="./assets/logo.png">

        <HelloWorld msg="Welcome to Your Vue.js App"/>
    </div>
</template>

<script>
    import HelloWorld from './components/HelloWorld.vue'
    // import image from './assets/image-bradenton.js'; //aws
    // import image from './assets/image-dominica.json'; //aws
    import image from './assets/image-rozy.js';  //cloudinary

    export default {
        name: 'app',
        created() {
            this.setImage();
        },
        components: {
            HelloWorld
        },
        data() {
            return {
                image: null,
                recipes: {
                    header: [
                        {
                            screens: 'default',
                            width: 1200
                        },
                        {
                            screens: 'xs,sm',
                            height: 213,
                            width: 440
                        }
                    ],
                    hero: [
                    {
                        screens: 'xs',
                        height: 660,
                        width: 440
                    },
                    {
                        screens: 'sm,md',
                        height: 600,
                        width: 992
                    },
                    {
                        screens: 'default',
                        width: 1440
                    }],
                    thumb: [{screens: 'default', height: 415, width: 370}, {screens: 'xs,sm', height: 200, width: 320}]
                },
                imageToTest: 's3' //s3,cloudinary,local
            }
        },
        methods: {
            setImage() {

                if( this.imageToTest == 'cloudinary' ) {
                    this.image = image
                }

                if( this.imageToTest == 'local' ) {
                    this.image = image
                }

                if( this.imageToTest == 's3' ) {
                    this.image = image
                    // axios.get(process.env.VUE_APP_S3_TEST_ROUTE).then(response => {
                    //     console.log(response);
                    // })
                }
            }
        }
    }
</script>

<style>
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        margin-top: 60px;
    }
</style>
