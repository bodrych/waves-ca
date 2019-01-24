<template>
	<v-container fluid>
		<div class="title">Certificate edit</div>
		Modifying an existing certificate or adding a new one
		<v-text-field
		v-model="cert.addr"
		label="Address"
		append-icon="search"
		@click:append="loadCert"
		@keyup.enter="loadCert"
		>
		</v-text-field>
		<v-switch
		label="Status"
		v-model="cert.status"
		color="primary"
		></v-switch>
		<v-btn
		class="mx-0"
		color="primary"
		dark
		download="certificate.pdf"
		:href="`data:application/pdf;${cert.cert.replace(':', ',')}`"
		target="_blank"
		>Open current certificate file
		<v-icon right>picture_as_pdf</v-icon>
		</v-btn>
		<label
				for="file-upload"
				class=" v-btn theme--dark primary"
				>Select new certificate file
				<v-icon right dark>attach_file</v-icon>
				</label>
				<input
				@change="readCert"
				id="file-upload"
				accept="application/pdf"
				type="file"
				ref="cert">
		<v-text-field
		v-model="cert.note"
		label="Note"
		>
		</v-text-field>
		<v-text-field
		v-model="cert.name"
		label="Name"
		>
		</v-text-field>
		<v-btn
		class="ml-0"
		color="primary"
		dark
		@click="addCert"
		>
		Save changes
		<v-icon right dark>save</v-icon>
		</v-btn>
	</v-container>
</template>

<script>
	import api from '../api'
	import utils from '../utils'
	import store from '../store.js'
	import config from '../config.js'

	export default {
		name: 'edit',
		store,
		data: () => {
			return {
				cert: {
					addr: '',
					status: false,
					cert: '',
					note: '',
					pic: '',
					name: ''
				}
			}
		},
		mounted: function() {
			this.cert.addr = this.$route.params.address
			this.loadCert()
		},
		beforeRouteUpdate: function(to, from, next) {
			this.cert.addr = to.params.address
			this.loadCert()
			next()
		},
		methods: {
			getBase64: function (file) {
				return new Promise((resolve, reject) => {
					const reader = new FileReader();
					reader.readAsDataURL(file);
					reader.onload = () => resolve(reader.result);
					reader.onerror = error => reject(error);
				});
			},
			// readImage: async function() {
			// 	let file = this.$refs.img.files[0];
			// 	let data = await this.getBase64(file);
			// 	console.log(data);
			// },
			readCert: async function() {
				var file = this.$refs.cert.files[0];
				let data = await this.getBase64(file);
				this.cert.cert = data.split(';')[1].replace(',',':');
			},
			loadCert: async function() {
				let data = await api.getData();

				for (let i in data) {
					let addr = data[i].key.split('.')[0]
					let field = data[i].key.split('.')[1]
					let value = data[i].value
					if (addr == this.cert.addr) {
						this.cert[field] = value
					}
				}
			},
			// editCert: function(i) {
			// 	this.cert.id = this.certs[i].id;
			// 	this.cert.owner = this.certs[i].owner;
			// 	this.cert.hash = this.certs[i].hash;
			// 	this.cert.status = this.certs[i].status;
			// },
			addCert: async function() {
				if (!this.cert.addr)
					return
				let data = {
					fee: {
						assetId: 'WAVES',
						tokens: '0.05'
					},
					data: [
					{type: 'boolean', key: `${this.cert.addr}.status`, value: this.cert.status},
					{type: 'binary', key: `${this.cert.addr}.cert`, value: this.cert.cert},
					{type: 'string', key: `${this.cert.addr}.note`, value: this.cert.note},
					// {type: 'binary', key: `${this.cert.addr}.pic`, value: this.cert.pic},
					{type: 'string', key: `${this.cert.addr}.name`, value: this.cert.name}
					],
					senderPublicKey: config.CAPK
				}
				await this.signAndPublishTx(data);
			},
			signAndPublishTx: async function(data) {
				let params = {
					type: 12,
					data: data
				}
				try {
					let res = await Waves.signAndPublishTransaction(params);
					this.result = res;
				} catch (err) {
					alert(err.message);
					console.log(err);
				}
			}
		}
	}
</script>

<style>
	input[type="file"] {
    display: none;
}
</style>
