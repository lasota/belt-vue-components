import Vue from 'vue';
import BeltClip from './BeltClip.vue';

const Components = {
    BeltClip
}

Object.keys(Components).forEach(name => {
    Vue.component(name, Components[name]);
});

export default Components;