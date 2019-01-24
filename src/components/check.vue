<template>
	<v-container>
		<div class="title">Check address</div>
		Search certificate by address
		<v-text-field
		v-model="check.target"
		label="Address"
		append-icon="search"
		@click:append="checkCert"
		@keyup.enter="checkCert"
		>
	</v-text-field>
	<template v-if="check.result">
		<v-list two-line>
			<v-list-tile>
				<v-list-tile-content>
					<v-list-tile-title>
						{{ check.data.status ? "Active" : "Withdrawn" }}
					</v-list-tile-title>
					<v-list-tile-sub-title>
						Status
					</v-list-tile-sub-title>
				</v-list-tile-content>
			</v-list-tile>
			<v-list-tile>
				<v-list-tile-content>
					<v-list-tile-title>
						{{ check.data.name }}
					</v-list-tile-title>
					<v-list-tile-sub-title>
						Name
					</v-list-tile-sub-title>
				</v-list-tile-content>
			</v-list-tile>
			<v-list-tile>
				<v-list-tile-content>
					<v-list-tile-title>
						{{ check.data.note }}
					</v-list-tile-title>
					<v-list-tile-sub-title>
						Note
					</v-list-tile-sub-title>
				</v-list-tile-content>
			</v-list-tile>
		</v-list>
		<!-- 			<v-img
		:src="`data:image/png;${check.data.pic.replace(':', ',')}`"
		aspect-ratio="1"
		class="grey lighten-5"
		width="100px"
		>
	</v-img> -->
	<v-btn
	class="ml-0 mt-3"
	color="primary"
	dark
	download="certificate.pdf"
	:href="`data:application/pdf;${check.data.cert.replace(':', ',')}`"
	target="_blank"
	>
	Open certificate<v-icon right>picture_as_pdf</v-icon>
</v-btn>
</template>
<template v-else>
	Not found
</template>
</v-container>
</template>

<script>
import api from '../api'
import utils from '../utils'
import store from '../store.js'
import config from '../config.js'
export default {
	name: 'check',
	store,
	data: () => {
		return {
			tile: true,
			check: {
				target: '',
				data: {
					status: false,
					cert: '',
					note: '',
					pic: '',
					name: ''
				},
				result: false
			},
		}
	},
	mounted: function() {
		if (this.$route.params.address){
			this.check.target = this.$route.params.address
			this.checkCert()
		}
	},
	beforeRouteUpdate: function(to, from, next) {
		if (to.params.address) {
			this.check.target = to.params.address
			this.checkCert()
		}
		next()
	},
	methods: {
		checkCert: async function() {
			this.check.result = false
			let data = await api.getData();

			for (let i in data) {
				let addr = data[i].key.split('.')[0]
				let field = data[i].key.split('.')[1]
				let value = data[i].value
				if (addr == this.check.target.replace(' ', '')) {
					this.check.result = true
					this.check.data[field] = value
				}
			}
		}
	}
}
</script>
