import autoLoginFlow from "../usecases/autoLogin.js";
import punch from "../usecases/punch.js";
import setupConfig from "../usecases/setupConfig.js";
import hfu from "./headfulUtilities.js";
import hlu from "./headlessUtilities.js";
import storageGateway from "../gateways/storageGateway.js";

export default class etxController {
  constructor() {
    this.managedTabId = 0;
    storageGateway.get(["login", "today"]).then((data) => {
      this.userData = data["login"];
      this.todayData = data["today"] || configSchema["today"];
    });
  }
  autoLoginFlow() {
    autoLoginFlow({
      moveLoginPage: hfu.moveLoginPage,
      postLoginData: hfu.postLoginData,
      activateManagedTab: hfu.activateManagedTab,
      userData: this.userData,
    });
  }
  punchInFlow(punchInTime) {
    punch.punchInFlow({
      moveTodayScreen: hlu.moveTodayScreen,
      postTodayData: hlu.postTodayData,
      formatDate: hlu.formatDate,
      userData: this.userData,
      storageTodayData: this.todayData,
      value: punchInTime,
    });
  }
  punchOutFlow(punchOutTime) {
    punch.punchOutFlow({
      moveTodayScreen: hlu.moveTodayScreen,
      postTodayData: hlu.postTodayData,
      formatDate: hlu.formatDate,
      userData: this.userData,
      storageTodayData: this.todayData,
      value: punchOutTime,
    });
  }
  setupConfig(str) {
    setupConfig(str);
  }
  downloadConfig() {
    downloadConfig();
  }
}
