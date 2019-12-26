// chrome.runtime.onInstalled.addListener(function() {
// 	// chrome.storage.sync.set({color: '#3aa757'}, function() {
// 	// 	console.log('the color is set')
// 	// })

//  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
//       chrome.declarativeContent.onPageChanged.addRules([{
//         conditions: [new chrome.declarativeContent.PageStateMatcher({
//           pageUrl: {urlContains: 'dev-instantats.com'},
//         })
//         ],
//             actions: [new chrome.declarativeContent.ShowPageAction()]
//       }]);
//     });
// });
const contexts = [
  "editable", "selection", "page"
];
const bkg = chrome.extension.getBackgroundPage()
/**
* Create simple generator item.
*
* @param title
* @param id
* @param parentId
* @param parentAction
* @param action
* @returns {any}
*/
// var port = chrome.runtime.connect();

const createSimpleGenerator = function({title, id, parentId, parentAction, action}) {
  return chrome.contextMenus.create({
      title: title,
      id: id,
      parentId: parentId || "parent",
      contexts: contexts,
  });
};
chrome.runtime.onConnect.addListener(function(port) {
  chrome.contextMenus.onClicked.addListener(function(info, tab) {
    let [parentAction, action] = info.menuItemId.split("-");
    let result = faker[parentAction][action](); 
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
      chrome.tabs.sendMessage(tabs[0].id, {action: result}, function(response) {
        console.log(response)
      });  
    });
    // port.postMessage({
    //   type: 'event',
    //   message: result
    // })
  });

})
/**
* Create a simple menu.
*
* @param title
* @param id
* @param parentId
* @returns {any}
*/
const createSimpleMenu = function({title, id, parentId}) {
  return chrome.contextMenus.create({
      title: title,
      id: id,
      parentId: parentId || "parent",
      contexts: contexts
  });
};

/**
* Load all items.
*
* @param items
* @param parent
*/
const loadAllItems = function(items, parent) {
  items.map(function (item) {
      if (item.children) {
          createSimpleMenu({
              title: item.title,
              id: item.id,
              parentId: item.parentId || parent
          });

          loadAllItems(item.children, item.id);
          return item;
      }

      createSimpleGenerator({
          title: item.title,
          id: item.id,
          parentId: item.parentId || parent,
          parentAction: item.parentAction,
          action: item.action
      })
  });
};

chrome.contextMenus.create({
  "title": "Auto Field Fill",
  "id": "parent",
  "contexts": contexts
});

var xhr = new XMLHttpRequest;
xhr.open("GET", chrome.runtime.getURL("contextMenus.json"));
xhr.onreadystatechange = function() {
  if (this.readyState == 4) {
      loadAllItems(JSON.parse(xhr.responseText));
  }
};
xhr.send(); 