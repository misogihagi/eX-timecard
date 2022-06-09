import { loginScriptTemplate } from "../lib/execScriptsTemplates.js"
import constants from '../lib/constants.js'
import {useStorage} from '../services/storageAdapter.js'


export function moveLoginPage(moveProperties){
    function isNullOrUndefined(e){return e===null || e===undefined}
    const active = isNullOrUndefined(moveProperties.active) ? true : moveProperties.active
    const url = moveProperties.url || '_blank'
    return new Promise((resolve, reject) => {
        chrome.tabs.create({
            active,
            url:constants.staffIndexURL,
        },tab=>{
            resolve(tab.id) 
        })
    })
}
export async function postLoginData({tabId}){
    //postProperties.tabId!
    const storage=useStorage()
    const {login}=await storage.get('login')

    chrome.scripting.executeScript({
        target: {tabId},
        func: loginScriptTemplate,
        args: [login],
    });
}

export function activateManagedTab(tabId){
    chrome.tabs.update(tabId,{active:true})
}
function useHeadfulWorker(){

    return {
        moveLoginPage,
        postLoginData,
        activateManagedTab,
    }
}
export default useHeadfulWorker