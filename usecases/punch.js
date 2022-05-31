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
async function punchFlow({
    moveTodayScreen,
    postTodayData,
    formatDate,
    userData,
    storageTodayData,
    key,
    value
}){
    try {
      const {nextToken,todayData} = await moveTodayScreen(userData)
      await postTodayData({
        token:nextToken,
        data:mergeData([{[key]:formatDate(value)},todayData,getPostifiedData(storageTodayData)]),
      })
    } catch (error) {
      alert(error)
    }
}
function punchInFlow(obj){
    obj.key='startTime'
    punchFlow(obj)
  }
function punchOutFlow(obj){
    obj.key='endTime'
    punchFlow(obj)
  }
const punch = {
    punchInFlow,
    punchOutFlow,
}
export default punch