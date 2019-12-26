let inputField = null; 

window.addEventListener('focusin', function(event) {
	inputField = event.target;
});

// window.addEventListener("message", function(event){
// 	console.log('Event registered')
// 	// if (event.source != window)
// 	// return;
	
// 	// if (event.data.type && (event.data.type == "FROM_PAGE")) {
// 	// 	console.log("Content script received: " + event.data.text);
// 	// }
// 	inputField.value = event.data.text;

// }, false);
chrome.runtime.onConnect.addListener(port=> {
	console.log('port connected..!')
	port.onMessage.addListener((message, sender, sendResponse) => {
		inputField.value = message.message;
	});
});