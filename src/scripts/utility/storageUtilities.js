function getStorage(key) {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(key, (val) => resolve(val));
  });
}
function setStorage(obj) {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.set(obj, () => resolve());
  });
}

const storageUtilities = {
  getStorage,
  setStorage,
};
export default storageUtilities;
