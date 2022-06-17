import constants from "../lib/constants.js";
import useHeadfulWorker from "../services/headfulWorker.js";

export default function useAutoLogin() {
  //  export default function useAutoLogin(credential:Credential){
  return async function autoLogin() {
    const hfw = useHeadfulWorker();
    const managedTabId = await hfw.moveLoginPage({
      active: false,
      url: constants.staffIndexPath,
    });
    hfw.postLoginData({
      tabId: managedTabId,
    });
    //hfw.activateManagedTab(managedTabId)
  };
}
