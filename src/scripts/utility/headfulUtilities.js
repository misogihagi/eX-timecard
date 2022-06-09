
import constants from '../constants.js'
function moveLoginPage(moveProperties){
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
function postLoginData(postProperties){
    //postProperties.data!
    //postProperties.execScriptTemplate!
    //postProperties.tabId!
    const data = postProperties.data
    const execScriptTemplate=postProperties.execScriptTemplate
    const tabId=postProperties.tabId
    chrome.tabs.executeScript(tabId,{
        code: execScriptTemplate(data)
    });
}

function activateManagedTab(tabId){
    chrome.tabs.update(tabId,{active:true})
} 
const headfulUtilities = {
    moveLoginPage,
    postLoginData,
    activateManagedTab,
}
export default headfulUtilities