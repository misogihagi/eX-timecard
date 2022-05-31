
import ETXController from './controllers/etxController.js';
const etxController=new ETXController()

function returnFileBody(){
  const fileBody=document.getElementById('fileBody')
  return new Promise((resolve,reject)=>{
        function readFile(e){
      const reader=new FileReader()
      reader.onload=()=>{
        resolve(reader.result)
      }
      reader.readAsText(e.target.files[0])
    }
    fileBody.addEventListener("change",readFile,{
      once: true
  })
    fileBody.click()
  })
}

function autoLogin(){
  etxController.autoLoginFlow()
}
function punchInNow(){
  etxController.punchInFlow(new Date())
}
function punchOutNow(){
  etxController.punchOutFlow(new Date())
}
async function inputConfig(){
  etxController.setupConfig(await returnFileBody())
  .catch (alert)
}
function outputConfig(){
  etxController.downloadConfig()
}
const scripts={
  autoLogin,
  punchIn:punchInNow,
  punchOut:punchOutNow,
  inputConfig,
  outputConfig,
}




document.addEventListener("DOMContentLoaded", ()=>{
  ["autoLogin","punchIn","punchOut",'inputConfig','outputConfig'].forEach(p=>{
    document.getElementById(p).addEventListener("click", scripts[p])
  });

  
});
