import Vue from 'vue';
import Vuetify, {
    VTextField
} from 'vuetify/lib'

Vue.use(Vuetify, {
    components: {
        VTextField
    }
});

export default new Vuetify({
    theme: {
        themes: {
            light: {
                primary: '#1976D2',
                secondary: '#424242',
                accent: '#82B1FF',
                error: '#FF5252',
                info: '#2196F3',
                success: '#4CAF50',
                warning: '#FFC107'
            },
        },
    },
    icons: {
        iconfont: 'mdi',
    },
});
