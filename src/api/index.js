const getData = async () => {
	const node = 'https://testnode1.wavesnodes.com'
	const CA = '3NBZsCMvJkSDUtVSdYA8mCMn1bwv7fa7zo2'
	let rawData = await fetch(`${node}/addresses/data/${CA}`);
	let data = await rawData.json();
	return data;
}

export default {
	getData
}