<template>
	<v-container fluid>
		<v-layout row align-center justify-space-between>
			<v-flex>
		<div class="title">Certificates list</div>
		</v-flex>
		<v-flex text-xs-right>
		<v-btn
		class="mr-0"
		dark
		color="primary"
		@click="getCerts"
		>
		Update
		<v-icon right>update</v-icon>
		</v-btn>
	</v-flex>
</v-layout>
		<v-data-table
		:headers="headers"
		:items="displayCerts"
		class="elevation-1"
		>
			<template slot="items" slot-scope="props">
				<td>
					<a
					:href="`/#/check/${props.item.addr}`"
					>
					{{ props.item.addr }}
				</a></td>
				<td>{{ props.item.status }}</td>
				<td>{{ props.item.name }}</td>
				<td>
					<a
				download="certificate.pdf"
				:href="`data:application/pdf;${props.item.cert.replace(':', ',')}`"
				target="_blank"
				><v-icon class="mr-2">picture_as_pdf</v-icon>
			</a>

			<a
		:href="`/#/edit/${props.item.addr}`"
		><v-icon>edit</v-icon>
	</a>
		</td>
			</template>
		</v-data-table>
	</v-container>
</template>
<script>
	import api from '../api'
	import utils from '../utils'
	import store from '../store.js'
	import config from '../config.js'
	export default {
		name: 'list',
		store,
		data: () => {
			return {
				certs: [],
				headers: [
					{ text: 'Address', value: 'addr' },
					{ text: 'Status', value: 'status' },
					{ text: 'Name', value: 'name' },
					{ text: 'Actions', value: '', sortable: false  }
				]
			}
		},
		created: function() {
			if (store.state.certs.length == 0)
				this.getCerts()
		},
		// beforeRouteUpdate: function(to, from, next) {
		// 	this.getCerts()
		// 	next()
		// },
		computed: {
			displayCerts() {
				return store.state.certs
			}
		},
		methods: {
			getCerts: async function() {
				let data = await api.getData();

				for (let i in data) {
					let addr = data[i].key.split('.')[0]
					let field = data[i].key.split('.')[1]
					let value = data[i].value
					let exist = utils.findByKey(this.certs, addr)
					// console.log(exist)
					if (exist) {
						this.certs[exist][field] = value
						// this.$set(this.certs[addr], field, value)
					} else {
						this.certs.push({
							addr: addr,
							status: false,
							cert: '',
							note: '',
							pic: '',
							name: ''
						})
						this.certs[this.certs.length - 1][field] = value
					}
				}
				store.commit('loadCerts', this.certs)
			},
		}
	}
</script>
