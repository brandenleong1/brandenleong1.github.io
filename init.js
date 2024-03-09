async function init() {
	await initTheme(parseInt(Cookies.getCookie('themeID'), 10) || 0);

	let link = document.createElement('link');
	link.href = 'https://cdn.jsdelivr.net/gh/brandenleong1/utils@latest/themes/transition.css';
	link.rel = 'stylesheet';
	link.type = 'text/css';
	document.head.appendChild(link);
	
	for (let e of document.querySelectorAll('[data-anim]')) {
		if ([Animate.fadeIn].includes(eval(e.dataset.anim))) await Animate.remove(e);
	}
	await Animate.animateGroupByIndex([document.querySelector('#name-title'), document.querySelector('#theme-btn'), , document.querySelector('#theme-label-1')].concat(level0Ids.map(i => document.querySelector('#' + i + '-btn > span'))));
	level0Ids.forEach(i => {
		document.querySelector('#' + i + '-btn > span').onclick = function() {expandLevel0(i);};
	});

	document.querySelector('#help').onclick = () => {Popup.popup(document.querySelector('#popup-help'))};
	document.querySelector('#settings').onclick = () => {Popup.popup(document.querySelector('#popup-settings'))};
}

function initTheme(id = 0) {
	Themes.createThemeCSS(id);
	document.querySelector('#theme-btn').onclick = changeTheme;
	document.querySelector('#theme-btn').themeId = id;
	document.querySelector('#theme-btn').themeLabel1Shown = false;
	document.querySelector('#theme-label-2').innerText = Themes.themes[id][0];
	document.querySelector('#theme-css').setAttribute('href', Themes.themes[id][1]);
	Cookies.setCookie('themeID', id, 5 * 365 * 24 * 60 * 60 * 1000);
}

window.addEventListener('load', async function() {
	await Utils.sleep(100);
	document.querySelector('#loading-css').remove();
	document.querySelector('#loading').style.display = 'none';
	await init();
});