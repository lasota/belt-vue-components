<template>
    <div id="app">
        <div class="belt-clip">
            <BeltClip :attachment="image" :recipe="imageRecipe" v-if="image"></BeltClip>
        </div>
        <div class="belt-clip">
            <BeltClip :attachment="image" :max-width="100" v-if="image"></BeltClip>
        </div>

        <img alt="Vue logo" src="./assets/logo.png">

        <HelloWorld msg="Welcome to Your Vue.js App"/>
    </div>
</template>

<script>
    import HelloWorld from './components/HelloWorld.vue'
    import image from './assets/image.json';

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
                imageRecipe: [
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
                    }
                ],
                imageToTest: 's3' //s3,cloudinary,local
            }
        },
        methods: {
            setImage() {

                if( this.imageToTest == 'cloudinary' ) {}

                if( this.imageToTest == 'local' ) {
                    this.image = image;
                }

                if( this.imageToTest == 's3' ) {
                    this.image = image;
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
