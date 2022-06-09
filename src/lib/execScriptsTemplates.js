//string without singlequote
export function loginScriptTemplate({compId,userId,password}){
    return window.onload=()=>{
      document.getElementById('compId').value=compId
      document.getElementById('userId').value=userId
      document.querySelector('input[type="password"]').value=password
      Array.from(document.querySelectorAll('a')).filter(a=>a.firstChild.nodeName==='IMG')[0].click()
    }

}
const execScriptsTemplates = {
    loginScriptTemplate
}
export default execScriptsTemplates