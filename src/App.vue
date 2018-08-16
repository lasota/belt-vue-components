<template>
    <div id="app">
        <img alt="Vue logo" src="./assets/logo.png">
        <BeltClip :image="image"></BeltClip>
        <HelloWorld msg="Welcome to Your Vue.js App"/>
    </div>
</template>

<script>
    import BeltClip from './components/BeltClip.vue'
    import HelloWorld from './components/HelloWorld.vue'
    import image from './assets/image.json';
    import lodash from 'lodash';

    window._ = lodash;

    export default {
        name: 'app',
        components: {
            BeltClip,
            HelloWorld
        },
        data() {
            return {
                image: image
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
