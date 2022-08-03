import { useHeadlessWorker } from "../services/headlessWorker";
import { useStorage } from "../services/storageAdapter";
import { mergeData,getPostifiedData } from '../lib/utils'
async function punchFlow({ key, value }) {
  const hlw = useHeadlessWorker();
  const storage = useStorage();
  const { today } = await storage.get("today");
  try {
    const { nextToken, todayData } = await hlw.moveTodayScreen();
    await hlw.saveTodayData({
      token: nextToken,
      data: mergeData([
        { [key]: hlw.formatDate(value) },
        todayData,
        getPostifiedData(today),
      ]),
    });
  } catch (error) {
    alert(error);
  }
}
export function usePunchIn(date) {
  return function punch() {
    punchFlow({
      key: "startTime",
      value: date
    });
  };
}

export function usePunchOut(date) {
  return function punch() {
    punchFlow({
      key: "endTime",
      value: date
    });
  };
}

const usePunch = {
  usePunchIn,
  usePunchOut,
};

export default usePunch;
