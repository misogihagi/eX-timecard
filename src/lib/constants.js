const etimecardSchema={
    hizuke:{
      name:"日付",
      index:0,
    },  
    youbi:{
      name:"曜日",
      index:1,
    },
    kubun:{
      name:"区分",
      index:2,
    },
    syuugyou_basyo:{
      name:"就業場所",
      index:3,
    },
    kaisi_zikoku:{
      name:"開始時刻",
      index:4,
    },  syuuryou_zikoku:{
      name:"終了時刻",
      index:5,
    },  kyuukei_zikan:{
      name:"休憩時間(分)",
      index:6,
    },
    sinya_kyuukei:{
      name:"深夜休憩(分)",
      index:7,
    },  
    zyoukyou:{
      name:"状況",
      index:9,
    },  
    rireki:{
      name:"履歴",
      index:10,
    },  
    bikou:{
      name:"備考",
      index:11,
    },  
    tatekaekin:{
      name:"立替金",
      index:12,
    },  
  }
  const etimecardHost='https://e-timecard.ne.jp/'
  const staffIndexPath="s/EPPLGN01/staff/"
  const staffIndexURL=etimecardHost+staffIndexPath
  const todayScreenDB=[
    {
      key:'worktype',
      nodeName:'select',
    },{
      key:'workPlaceKbnHome',
      nodeName:'input',
    },{
      key:'startTime',
      nodeName:'input',
    },{
      key:'endTime',
      nodeName:'input',
    },{
      key:'rstTime',
      nodeName:'input',
    },{
      key:'nightRstTime',
      nodeName:'input',
    },{
      key:'remark',
      nodeName:'textarea',
    }
].concat([...Array(10)].reduce(
  (acc,_,idx) => {
    ["carfareList["+idx+"].contents1",
    "carfareList["+idx+"].contents2",
    "carfareList["+idx+"].total"].forEach(key=>{
      acc.push({
        key,
        nodeName:'input',
      })
    })
    return acc
  },[]))
  .concat([...Array(5)].reduce(
      (acc,_,idx) => {
        ["otherList["+idx+"].contents1",
        "otherList["+idx+"].total"].forEach(key=>{
          acc.push({
            key,
            nodeName:'input',
          })
        })
        return acc
      },[]))
    .concat([{
      key:'dailyChk',
      nodeName:'input',
    }])
export const configName='config.json'
const constants={
  staffIndexURL,
  todayScreenDB,
  configName,
}
export default constants