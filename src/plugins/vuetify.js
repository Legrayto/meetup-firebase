import Vue from 'vue'
import Vuetify from 'vuetify/lib/framework'
import colors from 'vuetify/lib/util/colors'

Vue.use(Vuetify);

export default new Vuetify({
	theme: {
		themes: {
			light: {
				primary: colors.red.darken3,
				accent: colors.green.darken2,
				secondary: colors.indigo.darken2,
				info: colors.blue.lighten1,
				warning: colors.amber.darken2,
				error: colors.red.accent4,
				success: colors.green.lighten2
			}
			
		}
	}
});
