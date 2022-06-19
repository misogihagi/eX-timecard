import { Config } from '../domain/config'

//var blob = new Blob([JSON.stringify(await su.getStorage(['login','today']))], { "type" : "application/json" });
type Key='login' | 'today'

function get(key:Key):Promise<Config> {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(key, (val) => resolve(val as Config));
  });
}
function set(obj) {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.set(obj, () => resolve("done"));
  });
}
function getAsBlob(key) {
  return get(key).then(
    (val) => new Blob([JSON.stringify(val)], { type: "application/json" })
  );
}
export function useStorage() {
  return {
    get,
    set,
    getAsBlob,
  };
}
export default useStorage;
