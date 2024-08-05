import { addWordBackground } from "../Popup/utils";

const contextMenuItemId = 'saveWord';
chrome.runtime.onInstalled.addListener(function () {
    chrome.contextMenus.create({
        title: 'Save this word',
        contexts: ['selection'],
        id: contextMenuItemId
    });
});

chrome.contextMenus.onClicked.addListener(genericOnClick);
async function genericOnClick(info) {
    if (info.menuItemId == contextMenuItemId) {
        addWordBackground(info.selectionText);
    }
}