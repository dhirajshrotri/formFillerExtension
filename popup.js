let autoFillEnable = document.getElementById('fillForm')
const bkg = chrome.extension.getBackgroundPage()
// bkg.console.log('hi this script is running')
autoFillEnable.onclick = function(element) {
	bkg.console.log('heere')
	chrome.tabs.executeScript(null, {
		file: "contentScript.js"
	});
};