import { getDefinition } from "../../services/dictionary";

const contextMenuItemId = 'saveWord';
chrome.runtime.onInstalled.addListener(function () {
    chrome.contextMenus.create({
        title: 'Save this word',
        contexts: ['selection'],
        id: contextMenuItemId
    });

    // Intentionally create an invalid item, to show off error checking in the
    // create callback.
    chrome.contextMenus.create(
        { title: 'Oops', parentId: 999, id: 'errorItem' },
        function () {
            if (chrome.runtime.lastError) {
                console.log('Got expected error: ' + chrome.runtime.lastError.message);
            }
        }
    );
});

chrome.contextMenus.onClicked.addListener(genericOnClick);
async function genericOnClick(info) {
    if (info.menuItemId == contextMenuItemId) {
        chrome.storage.sync.get("data", function ({ data }) {
            const words = data?.words || [];
            words.unshift(info.selectionText);
            chrome.storage.sync.set({ "data": { words } }, function () {
                console.log("set", words);
            });
        });
    }
}