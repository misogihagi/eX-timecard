import useAutoLogin from "./application/autoLogin";
import { useInputConfig } from "./application/inputConfig";
import { useOutputConfig } from "./application/outputConfig";
import { usePunchIn, usePunchOut } from "./application/punch";
import { useImportData, useExportData} from './application/transportData'

function getFileBody() {
  const fileBody = document.getElementById("fileBody");
  return new Promise((resolve, reject) => {
    function readFile(e) {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.readAsText(e.target.files[0]);
    }
    fileBody.addEventListener("change", readFile, {
      once: true,
    });
    fileBody.click();
  });
}
const autoLogin = useAutoLogin();
const punchIn = usePunchIn(new Date());
const punchOut = usePunchOut(new Date());
const inputConfig = useInputConfig(() => {
  return getFileBody();
}); //.catch (alert)
const outputConfig = useOutputConfig();
const importData = useImportData(getFileBody)
const exportData= useExportData()
const scripts = {
  autoLogin,
  punchIn,
  punchOut,
  inputConfig,
  outputConfig,
  importData,
  exportData,
};

document.addEventListener("DOMContentLoaded", () => {
  ["autoLogin", "punchIn", "punchOut", "inputConfig", "outputConfig", "importData", "exportData"].forEach(
    (p) => {
      document.getElementById(p).addEventListener("click", scripts[p]);
    }
  );
});
