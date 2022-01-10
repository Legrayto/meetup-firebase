export default (date) => {
	const dataFormat = { '01': 'Jan', '02': 'Feb', '03': 'Mar', '04': 'Apr', '05': 'May', '06': 'Jun', '07': 'Aug', '09': 'Sep', '10': 'Oct', '11': 'Nov', '12': 'Dec'}
	let time = date.split(' ')[1]
	let [year, month, day] = date.slice(0, date.indexOf(' ')).split('-')
	return `${dataFormat[month]} ${day}, ${year} ${time}`
}