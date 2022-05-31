async function downloadConfig(){
    var blob = new Blob([JSON.stringify(await su.getStorage(['login','today']))], { "type" : "application/json" });
    chrome.downloads.download({
      filename:'config.json',
      url:window.URL.createObjectURL(blob),
    })
  }
  export default downloadConfig