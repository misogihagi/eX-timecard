const immutable=(td):string=>{return td.innerText.trim()}
const mutable=(fn)=>{
  return (td:HTMLInputElement)=>{
    return td.querySelector('input')
    ? fn(td)
    : td.innerText.trim()
  }
}
const etimecardSchema = {
  hizuke: {
    name: "日付",
    index: 0,
    valueFn:td=>immutable(td).slice(0,-1),
  },
  youbi: {
    name: "曜日",
    index: 1,
    valueFn:immutable,
  },
  kubun: {
    name: "区分",
    index: 2,
    valueFn: mutable(td=>{
      const sel=td.querySelector('select')
      return sel.selectedOptions[0].innerText
    })
  },
  syuugyou_basyo: {
    name: "就業場所",
    index: 3,
    valueFn:mutable((td:HTMLInputElement)=>{
        const labels=td.innerText.trim().replace(/ /g,'').split('\n')
        const checklist=Array.from(td.querySelectorAll<HTMLInputElement>('input'))
          .map(e=>e.checked)
        return labels.filter((_,i)=>checklist[i]).join('/')
    })
},
  kaisi_zikoku: {
    name: "開始時刻",
    index: 4,
    valueFn: mutable(td=>td.querySelector('input').value)
  },
  syuuryou_zikoku: {
    name: "終了時刻",
    index: 5,
    valueFn: mutable(td=>td.querySelector('input').value)
  },
  kyuukei_zikan: {
    name: "休憩時間(分)",
    index: 6,
    valueFn: mutable(td=>td.querySelector('input').value)
  },
  sinya_kyuukei: {
    name: "深夜休憩(分)",
    index: 7,
    valueFn: mutable(td=>td.querySelector('input').value)
  },
  zyoukyou: {
    name: "状況",
    index: 9,
    valueFn: immutable
  },
  rireki: {
    name: "履歴",
    index: 10,
  },
  bikou: {
    name: "備考",
    index: 11,
  },
  tatekaekin: {
    name: "立替金",
    index: 12,
  },
};
const etimecardHost = "https://e-timecard.ne.jp/";
const staffIndexPath = "s/EPPLGN01/staff/";
const staffIndexURL = etimecardHost + staffIndexPath;
const todayScreenDB = [
  {
    key: "worktype",
    nodeName: "select",
  },
  {
    key: "workPlaceKbnHome",
    nodeName: "input",
  },
  {
    key: "startTime",
    nodeName: "input",
  },
  {
    key: "endTime",
    nodeName: "input",
  },
  {
    key: "rstTime",
    nodeName: "input",
  },
  {
    key: "nightRstTime",
    nodeName: "input",
  },
  {
    key: "remark",
    nodeName: "textarea",
  },
]
  .concat(
    [...Array(10)].reduce((acc, _, idx) => {
      [
        "carfareList[" + idx + "].contents1",
        "carfareList[" + idx + "].contents2",
        "carfareList[" + idx + "].total",
      ].forEach((key) => {
        acc.push({
          key,
          nodeName: "input",
        });
      });
      return acc;
    }, [])
  )
  .concat(
    [...Array(5)].reduce((acc, _, idx) => {
      [
        "otherList[" + idx + "].contents1",
        "otherList[" + idx + "].total",
      ].forEach((key) => {
        acc.push({
          key,
          nodeName: "input",
        });
      });
      return acc;
    }, [])
  )
  .concat([
    {
      key: "dailyChk",
      nodeName: "input",
    },
  ]);
export const configName = "config.json";
const constants = {
  staffIndexURL,
  todayScreenDB,
  configName,
  etimecardSchema,
};
export default constants;
