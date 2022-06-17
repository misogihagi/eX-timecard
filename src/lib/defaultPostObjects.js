const defaultValues = {
  login: {
    loginType: 3,
    etcToken: "",
    compid: "",
    userid: "",
    pwd: "",
  },
  today: {
    "org.apache.struts.taglib.html.TOKEN": "",
    loginType: 3,
    etcToken: "",
    hiddenDate: "",
    worktype: 1,
    startTime: "",
    endTime: "",
    rstTime: "",
    nightRstTime: "",
    remark: "",
    "carfareList[0].contents1": "",
    "carfareList[0].contents2": "",
    "carfareList[0].total": "",
    "carfareList[1].contents1": "",
    "carfareList[1].contents2": "",
    "carfareList[1].total": "",
    "carfareList[2].contents1": "",
    "carfareList[2].contents2": "",
    "carfareList[2].total": "",
    "carfareList[3].contents1": "",
    "carfareList[3].contents2": "",
    "carfareList[3].total": "",
    "carfareList[4].contents1": "",
    "carfareList[4].contents2": "",
    "carfareList[4].total": "",
    "carfareList[5].contents1": "",
    "carfareList[5].contents2": "",
    "carfareList[5].total": "",
    "carfareList[6].contents1": "",
    "carfareList[6].contents2": "",
    "carfareList[6].total": "",
    "carfareList[7].contents1": "",
    "carfareList[7].contents2": "",
    "carfareList[7].total": "",
    "carfareList[8].contents1": "",
    "carfareList[8].contents2": "",
    "carfareList[8].total": "",
    "carfareList[9].contents1": "",
    "carfareList[9].contents2": "",
    "carfareList[9].total": "",
    "otherList[0].contents1": "",
    "otherList[0].total": "",
    "otherList[1].contents1": "",
    "otherList[1].total": "",
    "otherList[2].contents1": "",
    "otherList[2].total": "",
    "otherList[3].contents1": "",
    "otherList[3].total": "",
    "otherList[4].contents1": "",
    "otherList[4].total": "",
    dailyChk: "on",
  },
};

function deepCopy(obj) {
  return JSON.parse(JSON.stringify(obj));
}
function login() {
  return deepCopy(defaultValues.login);
}
function today() {
  return deepCopy(defaultValues.today);
}
const defaultPostObjects = {
  login,
  today,
};
export default defaultPostObjects;
