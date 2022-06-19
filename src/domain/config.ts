import { LoginParams } from "../lib/types"

interface Login extends LoginParams {
  loginType: number,
  compid: string,
  userid: string,
  pwd: string,
}
export type Config = {
  login: Login,
  today: {
    loginType: number,
    hiddenDate: string,
    worktype: number,
    startTime: string,
    endTime: string,
    rstTime: string,
    nightRstTime: string,
    remark: string,
    carfareList: [
      {
        //max 10
        contents1: string,
        contents2: string,
        total: string,
      },
    ],
    otherList: [
      {
        //max 5
        contents1: string,
        total: string,
      },
    ],
    dailyChk: string,
  },
};
