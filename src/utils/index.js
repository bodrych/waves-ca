const findByKey = (array, addr) => {
	let index = false
	for (let i in array) {
		if (array[i]['addr'] == addr) {
			index = i
		}
	}
	return index
}

export default {
	findByKey
}