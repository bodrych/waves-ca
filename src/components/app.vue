<template>
	<v-app>
	<v-toolbar color="primary" dark fixed app>
		<v-icon medium>verified_user</v-icon>
		<v-toolbar-title>Waves Ambassadors Certificate Authority</v-toolbar-title>
		<v-spacer></v-spacer>
		<v-toolbar-items>
      <v-btn to="/" flat>Home</v-btn>
      <v-btn to="/edit" flat>Edit</v-btn>
      <v-btn to="/check" flat>Check</v-btn>
    </v-toolbar-items>
	</v-toolbar>

	<v-content>
		<v-container>
			<router-view></router-view>
		</v-container>
	</v-content>
	<v-footer color="primary" dark fixed app>
		<v-layout
      justify-center
      row
      wrap
    >
      <v-btn
      	href="https://github.com/bodrych/waves-ca"
        dark
        flat
      >
        GitHub
      </v-btn>
      <v-btn
      	:href="'https://testnet.wavesexplorer.com/address/' + CA"
        dark
        flat
      >
        WavesExplorer
      </v-btn>
      <v-btn
      	href="https://forum.wavesplatform.com/t/the-waves-ca/3766"
        dark
        flat
      >
        Forum
      </v-btn>
    </v-layout>
	</v-footer>
</v-app>
</template>

<script>
	import utils from '../utils'
	import store from '../store.js'
	import config from '../config.js'
	export default {
		name: 'app',
		store,
		data: () => {
			return {
				CA: config.CA
			}
		},
		methods: {
			checkKeeper: function() {
				return typeof window.Waves !== 'undefined';
			},
		}
	}
</script>
