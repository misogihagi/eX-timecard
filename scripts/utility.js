import constants from './constants.js'
//import headfulUtilities as hfu from './utility/headfulUtilities.js'
import headfulUtilities from './utility/headfulUtilities.js'
const hfu = headfulUtilities
import headlessUtilities from './utility/headlessUtilities.js'
const hlu = headlessUtilities
import storageUtilities from './utility/storageUtilities.js'
const su = storageUtilities
import execScriptsTemplates from './utility/execScriptsTemplates.js'
import configSchema from './configSchema.js'


function mergeData(dataArray){
  function isObj(val){
    if(typeof val !== 'object'){return false}
    return Array.isArray(val) ? false : true
  }

  return dataArray.reverse().reduce((acc,cur)=>{
    const depth=[]
    function getAccProp(k){
      return depth.reduce((a,c)=>{return a[c]},acc)
    }
    function dfs(v){
      Object.keys(v).forEach(key => {
        if(isObj(v[key])){
        const obj=getAccProp()
        if(typeof obj[key]==='undefined')obj[key]={}
        depth.push(key)
        dfs(v[key])
          depth.pop()
        }else{
        const obj=getAccProp()
        if(v[key]!=='')obj[key]=v[key] 
        if(obj[key]===undefined)obj[key]=v[key]
        }
      });
    }
    dfs(cur)
    return acc
  },{})
}

function getPostifiedData(dataObject){
  const rtnObj={}
  const keyStack=[]
  function assignObj(val,key){
    let tmpObj=rtnObj
    keyStack.slice(0,-1).forEach(k=>tmpObj=tmpObj[k])
    const parentKey=keyStack.slice(-1)[0]
    if(parentKey){
      if(key){      tmpObj[parentKey][key]=val    }else{     tmpObj[parentKey]=val    }
    }else{
      if(key){      tmpObj[key]=val    }else{     tmpObj=val    }
    }
  }
  function arrayToStringifiedObject(obj){
    if(Array.isArray(obj)){
    let tmpObj=rtnObj
    keyStack.slice(0,-2).forEach(k=>tmpObj=tmpObj[k])
    const parentKey=keyStack.slice(-1)[0]
    const grandParentKey=keyStack.slice(-2,-1)[0]
      obj.forEach((child,i)=>{
        for (const childKey in child) {
          if(grandParentKey){
            tmpObj[grandParentKey][parentKey+'['+i+'].'+childKey]=child[childKey]
          }else{
            
            tmpObj[parentKey+'['+i+'].'+childKey]=child[childKey]
          }
        }
      })
    }else if(typeof obj ==='object'){
        for (const key in obj) {
          if(!Array.isArray(obj[key]) &&typeof obj[key]==='object')assignObj({},key)
          keyStack.push(key)
          arrayToStringifiedObject(obj[key])
          keyStack.pop(key)
        }
      } else{
        assignObj(obj)
      }
  }
  arrayToStringifiedObject(dataObject)
  return rtnObj
}
export default class Utility {
  constructor(){
    this.ManagedTabId=0
    su.getStorage(['login','today']).then((data)=>{
      this.userData=data['login']
      this.todayData=data['today'] || configSchema['today']
    })
  }
  async autoLoginFlow(){
    this.ManagedTabId = await hfu.moveLoginPage({
      active: false,
      url:this.host+constants.staffIndexPath,
    })
    hfu.postLoginData({
      data:this.userData,
      execScriptTemplate:execScriptsTemplates.loginScriptTemplate,
      tabId:this.ManagedTabId,
    })
    hfu.activateManagedTab(this.ManagedTabId)
  }
  async punchFlow({key,value}){
    try {
      const {nextToken,todayData} = await hlu.moveTodayScreen(this.userData)
      await hlu.postTodayData({
        token:nextToken,
        data:mergeData([{[key]:hlu.formatDate(value)},todayData,getPostifiedData(this.todayData)]),
      })
    } catch (error) {
      alert(error)
    }
  }
  async punchInFlow(punchInTime){
    this.punchFlow({
      key:'startTime',
      value:punchInTime
    })
  }
  async punchOutFlow(punchOutTime){
    this.punchFlow({
      key:'endTime',
      value:punchOutTime
    })
  }
  async asd(){
    const {nextToken,todayData} = await hlu.moveTodayScreen(this.userData)

    await hlu.postTodayData({
      token:nextToken,
      data:todayData,
    })       
  }
  setupConfig(str){
    return new Promise((resolve,reject)=>{
      try {
        const config=JSON.parse(str)
        chrome.storage.sync.set(config,()=>resolve());  
      } catch (error) {
        reject(error)
      }
    })
  }
  async downloadConfig(){
    var blob = new Blob([JSON.stringify(await su.getStorage(['login','today']))], { "type" : "application/json" });
    chrome.downloads.download({
      filename:'config.json',
      url:window.URL.createObjectURL(blob),
    })
  }
}
