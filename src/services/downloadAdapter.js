import { configName } from "../lib/constants.js";

export function useDownloader() {
  return {
    download(blob) {
      chrome.downloads.download({
        filename: configName,
        url: window.URL.createObjectURL(blob),
      });
    },
  };
}
export default useDownloader;
