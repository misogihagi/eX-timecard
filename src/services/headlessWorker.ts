import defaultPostObjects from "../lib/defaultPostObjects";
import constants from "../lib/constants";
import { useStorage } from "../services/storageAdapter";
import { LoginParams } from "../lib/types"

import Encoding from "encoding-japanese";

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

  const body = Object.keys(item)
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
      if (text.indexOf("spErrorMargin") !== -1) {
        const doc = new DOMParser().parseFromString(text, "text/html");
        throw doc?.querySelector<HTMLInputElement>(".spErrorMargin").innerText;
      }
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
  )?.value;
  const todayData = parseTodayData(afterLoginDocument);
  return { nextScreen, nextToken, todayData };
}
async function postTodayData({ token, data }) {
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
  )?.value;
  const dataHTMLStr = await getThisHalfMonthHTML(token);
  const dataHTML = new DOMParser().parseFromString(dataHTMLStr.resultHTML, "text/html");
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
const headlessUtilities = {
  moveTodayScreen,
  formatDate,
  postTodayData,
};

export function useHeadlessWorker() {
  return {
    moveTodayScreen,
    formatDate,
    postTodayData,
  };
}

export default headlessUtilities;
