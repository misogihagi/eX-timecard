//string without singlequote
import {LoginParams} from "./types"

export function loginScriptTemplate({ compId, userId, pwd }:LoginParams) {
  return (window.onload = () => {
    (<HTMLInputElement>document.getElementById("compId")).value = compId;
    (<HTMLInputElement>document.getElementById("userId")).value = userId;
    (<HTMLInputElement>document.querySelector('input[type="password"]')).value = pwd;
    Array.from(document.querySelectorAll("a"))
      .filter((a) => a.firstChild.nodeName === "IMG")[0]
      .click();
  });
}
const execScriptsTemplates = {
  loginScriptTemplate,
};
export default execScriptsTemplates;
