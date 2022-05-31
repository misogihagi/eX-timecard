function get(key){
    return new Promise((resolve,reject)=>{
        chrome.storage.sync.get(key, val=>resolve(val))
    })
}
function set(obj){
    return new Promise((resolve,reject)=>{
        chrome.storage.sync.set(obj, ()=>resolve())
    })
}

const storageGateway ={
    get,
    set,
}
export default storageGateway