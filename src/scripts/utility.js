import constants from "../models/constants.js";
//import headfulUtilities as hfu from './utility/headfulUtilities.js'
import headfulUtilities from "./utility/headfulUtilities.js";
const hfu = headfulUtilities;
import headlessUtilities from "../controllers/headlessUtilities.js";
const hlu = headlessUtilities;
import storageUtilities from "./utility/storageUtilities.js";
const su = storageUtilities;
import execScriptsTemplates from "../usecases/execScriptsTemplates.js";
import configSchema from "./configSchema.js";

export default class Utility {
  constructor() {
    this.ManagedTabId = 0;
    su.getStorage(["login", "today"]).then((data) => {
      this.userData = data["login"];
      this.todayData = data["today"] || configSchema["today"];
    });
  }
  async autoLoginFlow() {
    this.ManagedTabId = await hfu.moveLoginPage({
      active: false,
      url: this.host + constants.staffIndexPath,
    });
    hfu.postLoginData({
      data: this.userData,
      execScriptTemplate: execScriptsTemplates.loginScriptTemplate,
      tabId: this.ManagedTabId,
    });
    hfu.activateManagedTab(this.ManagedTabId);
  }
  async punchFlow({ key, value }) {
    try {
      const { nextToken, todayData } = await hlu.moveTodayScreen(this.userData);
      await hlu.postTodayData({
        token: nextToken,
        data: mergeData([
          { [key]: hlu.formatDate(value) },
          todayData,
          getPostifiedData(this.todayData),
        ]),
      });
    } catch (error) {
      alert(error);
    }
  }
  async punchInFlow(punchInTime) {
    this.punchFlow({
      key: "startTime",
      value: punchInTime,
    });
  }
  async punchOutFlow(punchOutTime) {
    this.punchFlow({
      key: "endTime",
      value: punchOutTime,
    });
  }
  async asd() {
    const { nextToken, todayData } = await hlu.moveTodayScreen(this.userData);

    await hlu.postTodayData({
      token: nextToken,
      data: todayData,
    });
  }
  setupConfig(str) {
    return new Promise((resolve, reject) => {
      try {
        const config = JSON.parse(str);
        chrome.storage.sync.set(config, () => resolve());
      } catch (error) {
        reject(error);
      }
    });
  }
  async downloadConfig() {
    var blob = new Blob(
      [JSON.stringify(await su.getStorage(["login", "today"]))],
      { type: "application/json" }
    );
    chrome.downloads.download({
      filename: "config.json",
      url: window.URL.createObjectURL(blob),
    });
  }
}
