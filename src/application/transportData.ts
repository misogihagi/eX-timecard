import { useHeadlessWorker } from "../services/headlessWorker";
import { useStorage } from "../services/storageAdapter";
import { useDownloader } from "../services/downloadAdapter";
import { mergeData,getPostifiedData } from "../lib/utils";

function postify(data){
  return data.reduce((acc,cur,idx)=>{
    acc[`etcddataList[${idx}].worktype`]=1
    acc[`etcddataList[${idx}].workPlaceKbnOffice`]=0
    acc[`etcddataList[${idx}].startTimeInput`]=cur['kaisi_zikoku'].replace(':','')
    acc[`etcddataList[${idx}].endTimeInput`]=cur['syuuryou_zikoku'].replace(':','')
    acc[`etcddataList[${idx}].rstTimeInput`]=cur['kyuukei_zikan'].replace(':','')
    acc[`etcddataList[${idx}].nightRstTimeInput`]=cur['sinya_kyuukei'].replace(':','')
    return acc
  },{})
}
export function useImportData(strFn){
  return async function importData() {
    const hlw = useHeadlessWorker();
    const storage = useStorage();
    const { today } = await storage.get("today");
    const data = JSON.parse(await strFn());
    try {
      let token
      let result
      token = (await hlw.moveTodayScreen()).nextToken;
      result = await hlw.moveThisHalfMonthScreen(token);
      token = result.nextToken
      const thisHalfMonthData= result.data
      console.log(data,thisHalfMonthData)
      await hlw.commitTodayData({
        token,
        data
      });
    } catch (error) {
      alert(error);
    }
  }
}
export function useExportData(){
  return async function exportData() {
    const hlw = useHeadlessWorker();
    const downloader = useDownloader();
      try {
      let token
      token= (await hlw.moveTodayScreen()).nextToken;
      const { data }= await hlw.moveThisHalfMonthScreen(token);
      console.log(data)
      const blob = new Blob([JSON.stringify(data, null, 2)], {type : 'application/json'});
      downloader.download(blob);
    } catch (error) {
      alert(error);
    }
  }
}

const useTransortData = {
  useImportData,
  useExportData,
};

export default useTransortData;
