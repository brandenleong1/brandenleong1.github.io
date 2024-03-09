async function changeTheme() {
	let btn = document.querySelector('#theme-btn');
	btn.onclick = null;
	btn.themeId = (btn.themeId + 1) % Themes.themes.length;

	let labels = btn.themeLabel1Shown ? [document.querySelector('#theme-label-1'), document.querySelector('#theme-label-2')] : [document.querySelector('#theme-label-2'), document.querySelector('#theme-label-1')];
	labels[1].innerText = Themes.themes[btn.themeId][0];
	await Animate.animateGroup([
		[labels[0], Animate.fadeOut, {shiftTo: UP}],
		[labels[1], Animate.fadeIn, {shiftFrom: DOWN}]
	]);
	document.querySelector('#theme-css').setAttribute('href', Themes.themes[btn.themeId][1]);
	Cookies.setCookie('themeID', btn.themeId, 5 * 365 * 24 * 60 * 60 * 1000);

	btn.themeLabel1Shown = !btn.themeLabel1Shown;
	await Animate.wait(1500);
	btn.onclick = changeTheme;
}

const level0Ids = ['about', 'coding', 'projects', 'random-works', 'contact'];

async function expandLevel0(id) {
	if (document.querySelector('#' + id + '-content').style.display != 'block') {
		level0Ids.forEach(i => {
			document.querySelector('#' + i + '-btn > span').onclick = null;
		});
		level0Ids.filter(i => i != id).forEach(i => {
			document.querySelector('#' + i + '-btn > span').style.cursor = 'default';
		});
		await Animate.animateGroup(level0Ids
								   .filter(i => i != id)
						   		   .map(i => [document.querySelector('#' + i + '-btn > span'), Animate.fadeOut, {shiftTo: LEFT, runTimeOffset: 100}])
								   .concat([[document.querySelector('#' + id + '-btn > span'), Animate.transform, {center: Vector3.getVectToEdge(document.querySelector('#' + id + '-btn > span'), LEFT), scaleTo: 2}]]));
		await Animate.remove(document.querySelector('#' + id + '-content'));
		document.querySelector('#' + id + '-content').style.display = 'block';
		await Animate.animateGroup(Array.from(document.querySelectorAll('#' + id + '-content  *[data-anim]')).map(e => [e, Animate.remove, {}]));
		await Animate.animate(document.querySelector('#' + id + '-content'), {anim: Animate.fadeIn, runTime: 50});
		await Animate.animateGroupByIndex(Array.from(document.querySelectorAll('#' + id + '-content *[data-anim]')));
		document.querySelector('#' + id + '-btn > span').onclick = function() {expandLevel0(id);};
	} else {
		document.querySelector('#' + id + '-btn > span').onclick = null;
		await Animate.animate(document.querySelector('#' + id + '-content'), {anim: Animate.fadeOut, runTime: 100});
		document.querySelector('#' + id + '-content').style.display = 'none';
		await Animate.animateGroup(level0Ids
								   .filter(i => i != id)
								   .map(i => [document.querySelector('#' + i + '-btn > span'), Animate.fadeIn, {shiftFrom: LEFT, shiftTo: ORIGIN, runTimeOffset: 100}])
								   .concat([[document.querySelector('#' + id + '-btn > span'), Animate.transform, {center: Vector3.getVectToEdge(document.querySelector('#' + id + '-btn > span'), LEFT), scaleFrom: 2}]]));
		level0Ids.filter(i => i != id).forEach(i => {
			document.querySelector('#' + i + '-btn > span').style.cursor = null;
		});
		level0Ids.forEach(i => {
			document.querySelector('#' + i + '-btn > span').onclick = function() {expandLevel0(i);};
		});
	}
}