import defaultPostObjects from "../lib/defaultPostObjects";
import constants from "../lib/constants";
import { useStorage } from "../services/storageAdapter";
import { LoginParams } from "../lib/types"

import Encoding from "encoding-japanese";
import { sign } from "crypto";

function encodeURIFromArray(arr) {
  console.log(arr);
  return "%" + arr.map((i) => i.toString(16)).join("%");
}
function fetchResultHTML(resource, item) {
  const host = "https://e-timecard.ne.jp/";
  const url = host + resource;
  const method = "POST";
  function toSJIS(s) {
    return Encoding.convert(
      s.split("").map((v) => v.charCodeAt()),
      "SJIS"
    );
  }
  console.log(item)

  const body = typeof item === 'string' ? item : Object.keys(item)
    .map((key) => {
      return Array.isArray(item[key])
        ? key + "=" + encodeURIFromArray(toSJIS(item[key]))
        : /^[\x00-\x7F]*$/.test(item[key])
        ? key + "=" + encodeURIComponent(item[key])
        : key + "=" + encodeURIFromArray(toSJIS(item[key]));
    })
    .join("&");
  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
  };
  console.log(body)
  return fetch(url, {
    method,
    headers,
    body,
    credentials: "include",
  })
    .then((res) => {
      return res.arrayBuffer();
    })
    .then((buffer) => {
      const decoder = new TextDecoder("shift_jis");
      const text = decoder.decode(buffer);
      const doc = new DOMParser().parseFromString(text, "text/html");
      console.log( doc);

/*
      if (text.indexOf("spErrorMargin") !== -1 || text.indexOf("cmTokenError") !== -1) {        
        
        const doc = new DOMParser().parseFromString(text, "text/html");
        if(doc.querySelector<HTMLInputElement>(".spErrorMargin").innerText.indexOf('タイムカードの締め申請を行ってください。') !== -1)return text
        throw doc.querySelector<HTMLInputElement>(".spErrorMargin").innerText;
      }
      */
      return text;
    });
}
async function postLoginScreen({ compId, userId, pwd }:LoginParams) {
  const obj = defaultPostObjects.login();
  obj.compid = compId;
  obj.userid = userId;
  obj.pwd = pwd;
  const resultHTML = await fetchResultHTML("s/EPPLGN01/login/", obj);
  return {
    nextScreen: "todayScreen",
    resultHTML,
  };
}
function parseTodayData(doc) {
  return constants.todayScreenDB.reduce((acc, cur) => {
    acc[cur.key] = doc.querySelector(
      `${cur.nodeName}[name="${cur.key}"]`
    ).value;
    return acc;
  }, {});
}
async function moveTodayScreen() {
  const storage = useStorage();
  const { login } = await storage.get("login");
  const { nextScreen, resultHTML } = await postLoginScreen(login);
  const afterLoginDocument = new DOMParser().parseFromString(
    resultHTML,
    "text/html"
  );
  const nextToken = afterLoginDocument.querySelector<HTMLInputElement>(
    'input[name="org.apache.struts.taglib.html.TOKEN"]'
  ).value;
  const todayData = parseTodayData(afterLoginDocument);
  return { nextScreen, nextToken, todayData };
}
async function saveTodayData({ token, data }) {
  const obj = defaultPostObjects.today();
  obj["org.apache.struts.taglib.html.TOKEN"] = token;
  obj.etcToken = token;
  for (const key in data) {
    obj[key] = data[key];
  }
  return fetchResultHTML("s/EPSINP02/temStorage/", obj);
}
async function getThisHalfMonthHTML(token) {
  const obj = defaultPostObjects.login();
  obj["org.apache.struts.taglib.html.TOKEN"] = token;
  obj.etcToken = token;
  const resultHTML = await fetchResultHTML("s/EPPLGN01/login/", obj);
  return { next: "thisHalfMonth", resultHTML };
}

async function getThisHalfMonth() {
  const afterLoginHTMLStr = await getLoginHTML();
  const afterLoginHTML = new DOMParser().parseFromString(
    afterLoginHTMLStr,
    "text/html"
  );
  const token = afterLoginHTML.querySelector<HTMLInputElement>(
    'input[name="org.apache.struts.taglib.html.TOKEN"]'
  ).value;
  const dataHTMLStr = await getThisHalfMonthHTML(token);
  const dataHTML = new DOMParser().parseFromString(dataHTMLStr, "text/html");
  function indexof(e) {
    return etimecardSchema[e].index;
  }
  return Array.from(
    dataHTML
      .querySelectorAll("table.inputtable_02.cmWidthP100")[2]
      .querySelectorAll("tr")
  )
    .slice(1)
    .map((tr) =>
      Array.from(tr.querySelectorAll("td"))
        .filter((_, index) =>
          ["hizuke", "kaisi_zikoku", "syuuryou_zikoku", "kyuukei_zikan"]
            .map(indexof)
            .includes(index)
        )
        .map((td) => td.innerText.trim())
    );
}

function formatDate(date) {
  return (
    ("" + date.getHours()).padStart(2, "0") +
    ("" + date.getMinutes()).padStart(2, "0")
  );
}

async function moveThisHalfMonthScreen({ token }){
  const obj = defaultPostObjects.today();
  obj["org.apache.struts.taglib.html.TOKEN"] = token;
  obj.etcToken = token;
  const resultHTML = await fetchResultHTML("s/EPSINP03/", obj);
  const afterLoginDocument = new DOMParser().parseFromString(
    resultHTML,
    "text/html"
  );
  const nextToken = afterLoginDocument.querySelector<HTMLInputElement>(
    'input[name="org.apache.struts.taglib.html.TOKEN"]'
  )?.value
  if(!nextToken) throw 'no token!'
  const data = parseThisHalfMonthData(afterLoginDocument);
  return { nextScreen:'thisHalfMonthScreen', nextToken, data };
}

function parseThisHalfMonthData(doc:Document) {
  return Array.from(
    doc
      .querySelectorAll('table.inputtable_02')[2]
      .querySelectorAll('tr')
  ).slice(1)
  .map(row=>{
    const tds=Array.from(row.querySelectorAll('td'))
    const v=(t)=>{
      return constants.etimecardSchema[t].valueFn(tds[constants.etimecardSchema[t].index])
    }

    return {
      hizuke: v('hizuke'),
      youbi: v('youbi'),
      kubun: v('kubun'),
      syuugyou_basyo: v('syuugyou_basyo'),
      kaisi_zikoku: v('kaisi_zikoku'),
      syuuryou_zikoku: v('syuuryou_zikoku'),
      kyuukei_zikan: v('kyuukei_zikan'),
      sinya_kyuukei: v('sinya_kyuukei')
  }
})
}

async function commitTodayData({token, data}){
  let res=''
  const youbi='日月火水木金土'
  function add(key,val){
    return encodeURIComponent(key)+'='+val+'&'
  }
  res+=add('org.apache.struts.taglib.html.TOKEN',token)
  res+=add('loginType',3)
  res+=add('etcToken',token)
  res+=add('closingChk1','on')
  data.forEach((day,idx)=>{
    res+=add('weekCnt',youbi.indexOf(day.youbi)+1)
    res+=add('holidayflg',0)
    res+=add(`etcddataList[${idx}].worktype`,1)
//    res+=add(`etcddataList[${idx}].workPlaceKbnOffice`,0)
    console.log(res)
    res+=add(`etcddataList[${idx}].startTimeInput`,day['kaisi_zikoku'].replace(':',''))
    res+=add(`etcddataList[${idx}].endTimeInput`,day['syuuryou_zikoku'].replace(':',''))
    res+=add(`etcddataList[${idx}].rstTimeInput`,day['kyuukei_zikan'].replace(':',''))
    res+=add(`etcddataList[${idx}].nightRstTimeInput`,day['sinya_kyuukei'].replace(':',''))
    res+='remark=&'  
  })
  res +=add('closingChk2', 'on')
  res=''
  res+=add('org.apache.struts.taglib.html.TOKEN',token)
  res+=add('loginType',3)
  res+=add('etcToken',token)
  res+='&closingChk1=on&weekCnt=7&holidayflg=0&etcddataList%5B0%5D.worktype=1&etcddataList%5B0%5D.workPlaceKbnOffice=on&etcddataList%5B0%5D.workPlaceKbnHome=on&etcddataList%5B0%5D.workPlaceKbnSatelliteOffice=on&etcddataList%5B0%5D.startTimeInput=1111&etcddataList%5B0%5D.endTimeInput=1222&etcddataList%5B0%5D.rstTimeInput=0&etcddataList%5B0%5D.nightRstTimeInput=0&remark=&weekCnt=1&holidayflg=0&etcddataList%5B1%5D.worktype=1&etcddataList%5B1%5D.workPlaceKbnOffice=on&etcddataList%5B1%5D.startTimeInput=1111&etcddataList%5B1%5D.endTimeInput=1222&etcddataList%5B1%5D.rstTimeInput=0&etcddataList%5B1%5D.nightRstTimeInput=0&remark=&weekCnt=2&holidayflg=1&etcddataList%5B2%5D.worktype=1&etcddataList%5B2%5D.workPlaceKbnHome=on&etcddataList%5B2%5D.startTimeInput=1111&etcddataList%5B2%5D.endTimeInput=1222&etcddataList%5B2%5D.rstTimeInput=0&etcddataList%5B2%5D.nightRstTimeInput=0&remark=&weekCnt=3&holidayflg=0&etcddataList%5B3%5D.worktype=1&etcddataList%5B3%5D.startTimeInput=&etcddataList%5B3%5D.endTimeInput=&etcddataList%5B3%5D.rstTimeInput=&etcddataList%5B3%5D.nightRstTimeInput=&remark=&weekCnt=4&holidayflg=0&etcddataList%5B4%5D.worktype=1&etcddataList%5B4%5D.startTimeInput=&etcddataList%5B4%5D.endTimeInput=&etcddataList%5B4%5D.rstTimeInput=&etcddataList%5B4%5D.nightRstTimeInput=&remark=&weekCnt=5&holidayflg=0&etcddataList%5B5%5D.worktype=1&etcddataList%5B5%5D.workPlaceKbnHome=on&etcddataList%5B5%5D.startTimeInput=1111&etcddataList%5B5%5D.endTimeInput=1222&etcddataList%5B5%5D.rstTimeInput=0&etcddataList%5B5%5D.nightRstTimeInput=0&remark=&weekCnt=6&holidayflg=0&etcddataList%5B6%5D.worktype=1&etcddataList%5B6%5D.workPlaceKbnHome=on&etcddataList%5B6%5D.startTimeInput=1111&etcddataList%5B6%5D.endTimeInput=1222&etcddataList%5B6%5D.rstTimeInput=0&etcddataList%5B6%5D.nightRstTimeInput=0&remark=&weekCnt=7&holidayflg=0&etcddataList%5B7%5D.worktype=1&etcddataList%5B7%5D.workPlaceKbnOffice=on&etcddataList%5B7%5D.startTimeInput=1111&etcddataList%5B7%5D.endTimeInput=1222&etcddataList%5B7%5D.rstTimeInput=0&etcddataList%5B7%5D.nightRstTimeInput=0&remark=&weekCnt=1&holidayflg=0&etcddataList%5B8%5D.worktype=4&etcddataList%5B8%5D.startTimeInput=&etcddataList%5B8%5D.endTimeInput=&etcddataList%5B8%5D.rstTimeInput=&etcddataList%5B8%5D.nightRstTimeInput=&remark=&weekCnt=2&holidayflg=0&etcddataList%5B9%5D.worktype=1&etcddataList%5B9%5D.startTimeInput=&etcddataList%5B9%5D.endTimeInput=&etcddataList%5B9%5D.rstTimeInput=&etcddataList%5B9%5D.nightRstTimeInput=&remark=&weekCnt=3&holidayflg=0&etcddataList%5B10%5D.worktype=1&etcddataList%5B10%5D.startTimeInput=&etcddataList%5B10%5D.endTimeInput=&etcddataList%5B10%5D.rstTimeInput=&etcddataList%5B10%5D.nightRstTimeInput=&remark=&weekCnt=4&holidayflg=0&etcddataList%5B11%5D.worktype=1&etcddataList%5B11%5D.startTimeInput=&etcddataList%5B11%5D.endTimeInput=&etcddataList%5B11%5D.rstTimeInput=&etcddataList%5B11%5D.nightRstTimeInput=&remark=&weekCnt=5&holidayflg=0&etcddataList%5B12%5D.worktype=1&etcddataList%5B12%5D.startTimeInput=&etcddataList%5B12%5D.endTimeInput=&etcddataList%5B12%5D.rstTimeInput=&etcddataList%5B12%5D.nightRstTimeInput=&remark=&weekCnt=6&holidayflg=0&etcddataList%5B13%5D.worktype=1&etcddataList%5B13%5D.workPlaceKbnHome=on&etcddataList%5B13%5D.startTimeInput=0010&etcddataList%5B13%5D.endTimeInput=&etcddataList%5B13%5D.rstTimeInput=&etcddataList%5B13%5D.nightRstTimeInput=&remark=&weekCnt=7&holidayflg=0&etcddataList%5B14%5D.worktype=1&etcddataList%5B14%5D.startTimeInput=&etcddataList%5B14%5D.endTimeInput=&etcddataList%5B14%5D.rstTimeInput=&etcddataList%5B14%5D.nightRstTimeInput=&remark=&weekCnt=1&holidayflg=0&etcddataList%5B15%5D.worktype=1&etcddataList%5B15%5D.startTimeInput=&etcddataList%5B15%5D.endTimeInput=&etcddataList%5B15%5D.rstTimeInput=&etcddataList%5B15%5D.nightRstTimeInput=&remark=&closingChk2=on'
  let resultHTML = await fetchResultHTML("s/EPSINP03/apply/0", res);
  let afterLoginDocument = new DOMParser().parseFromString(
    resultHTML,
    "text/html"
  );
  let nextToken = afterLoginDocument.querySelector<HTMLInputElement>(
    'input[name="org.apache.struts.taglib.html.TOKEN"]'
  )?.value
  if(!nextToken) throw 'no token!'
  const obj={
    'org.apache.struts.taglib.html.TOKEN':nextToken,
    loginType:3,
    etcToken:nextToken
  }
  resultHTML = await fetchResultHTML("s/EPSINP03/selfIndex", obj);
  afterLoginDocument = new DOMParser().parseFromString(
    resultHTML,
    "text/html"
  );
  nextToken = afterLoginDocument.querySelector<HTMLInputElement>(
    'input[name="org.apache.struts.taglib.html.TOKEN"]'
  )?.value
  if(!nextToken) throw 'no token!'
  return { nextScreen:'thisHalfMonthScreen', nextToken, data };
};

const headlessUtilities = {
  moveTodayScreen,
  formatDate,
  saveTodayData,
  moveThisHalfMonthScreen,
  commitTodayData,
};

export function useHeadlessWorker() {
  return {
    moveTodayScreen,
    formatDate,
    saveTodayData,
    moveThisHalfMonthScreen,
    commitTodayData,
  };
}

export default headlessUtilities;
