import execScriptsTemplates from "./execScriptsTemplates.js"
import constants from '../models/constants.js'

export default async function autoLoginFlow({
    moveLoginPage,
    postLoginData,
    activateManagedTab,
    userData
}){
    const managedTabId = await moveLoginPage({
      active: false,
      url:constants.staffIndexPath,
    })
    postLoginData({
      data:userData,
      execScriptTemplate:execScriptsTemplates.loginScriptTemplate,
      tabId:managedTabId,
    })
    activateManagedTab(managedTabId)
}