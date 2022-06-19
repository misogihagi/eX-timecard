import constants from "../lib/constants";
import useHeadfulWorker from "../services/headfulWorker";

export default function useAutoLogin() {
  return async function autoLogin() {
    const hfw = useHeadfulWorker();
    const managedTabId = await hfw.moveLoginPage({
      active: false,
      url: constants.staffIndexURL,
    });
    hfw.postLoginData({
      tabId: managedTabId,
    });
    //hfw.activateManagedTab(managedTabId)
  };
}
