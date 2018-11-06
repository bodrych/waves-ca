var app = new Vue({
	el: '#app',
	data: {
		// node: 'https://nodes.wavesplatform.com',
		node: 'https://testnode1.wavesnodes.com',
		CA: '3NBZsCMvJkSDUtVSdYA8mCMn1bwv7fa7zo2',
		CAPK: '2vet7Phh3JLvc5xRknLoT6YbBsnyU98LywPsER6ixStk',
		result: '',
		mode: 'user',
		cert: {
			id: 0,
			owner: '',
			hash: '',
			status: true
		},
		check: {
			type: 'ID',
			data: '',
			result: false
		},
		certs: []
	},
	created: function() {
		setTimeout(() => {
			if (!this.checkKeeper()) {
				alert('Please, install Waves Keeper');
			}
		}, 1000);
	},
	methods: {
		checkKeeper: function() {
			return typeof window.Waves !== 'undefined';
		},
		editCert: function(i) {
			this.cert.id = this.certs[i].id;
			this.cert.owner = this.certs[i].owner;
			this.cert.hash = this.certs[i].hash;
			this.cert.status = this.certs[i].status;
		},
		getData: async function() {
			let rawData = await fetch(`${this.node}/addresses/data/${this.CA}`);
			let data = await rawData.json();
			return data;
		},
		getCerts: async function() {
			let data = await this.getData();
			let filtered = data.filter(item => {
				if (Number(item.key) > 0) {
					return true;
				} else {
					return false;
				}
			});
			let certs = filtered.map(item => {
				let status = this.findByKey(data, `${item.key}.status`);
				status = status ? status.value : '';
				let hash = this.findByKey(data, `${item.key}.hash`);
				hash = hash ? hash.value : '';
				return {
					id: item.key,
					owner: item.value,
					status: status,
					hash: hash
				};
			});
			this.certs = certs;
			return certs;
		},
		addCert: async function() {
			let data = {
				fee: {
					assetId: 'WAVES',
					tokens: '0.005'
				},
				data: [
					{type: 'string', key: this.cert.id, value: this.cert.owner},
					{type: 'string', key: this.cert.owner, value: this.cert.id},
					{type: 'binary', key: `${this.cert.id}.hash`, value: this.cert.hash},
					{type: 'boolean', key: `${this.cert.id}.status`, value: this.cert.status}
				],
				senderPublicKey: this.CAPK
			}
			await this.signAndPublishTx(data);
		},
		findByKey: function(array, id) {
			let element = array.find(element => {
				return element.key == id ? element : false;
			});
			return element;
		},
		checkCert: async function() {
			let certs = await this.getData();
			let id = '';
			switch (this.check.type) {
				case 'ID':
					id = this.check.data;
					break;
				case 'PK':
					let data = await this.findByKey(certs, this.check.data);
					id = data.value;
					break;
				default:
					id = this.check.data;
					break;
			}
			let status = await this.findByKey(certs, `${id}.status`);
			let result;
			if (status) {
				result = status.value;
			} else {
				result = false;
			}
			this.check.result = result;
			return result;
		},
		signAndPublishTx: async function(data) {
			let params = {
				type: 12,
				data: data
			}
			try {
				let res = await window.Waves.signAndPublishTransaction(params);
				this.result = res;
				console.log(res);
			} catch (err) {
				alert(err.message);
				console.log(err);
			}
		}
	}
});