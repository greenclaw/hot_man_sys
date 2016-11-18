$(() => {
	const cities = $(`td.city`).map((i, el) => $(el).text()).get().reduce((a, x) => a.includes(x) ? a : [...a, x], []).sort()
	$("#city").autocomplete({
		source: cities
	})

	$(`#hotels tbody tr`).addClass(`hidden-xs-up`)

	const l = $(`#hotels tbody tr`).length
	for(let i = 0; i < 5; i++) {
		let r = Math.random() * l
		$(`#hotels tbody tr`).sort(() => 0.5 - Math.random())[i].classList.remove(`hidden-xs-up`)
	}
	
})