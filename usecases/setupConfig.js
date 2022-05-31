function setupConfig(str){
    return new Promise((resolve,reject)=>{
      try {
        const config=JSON.parse(str)
        chrome.storage.sync.set(config,()=>resolve());  
      } catch (error) {
        reject(error)
      }
    })
  }
export default setupConfig
