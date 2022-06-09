//string without singlequote
function loginScriptTemplate({compId,userId,password}){
    return `(e=>{
    e.src="/s/js/etcCommon.js"
    document.head.appendChild(e)
  })(document.createElement("script"))
document.getElementById('compId').value='${compId}'
document.getElementById('userId').value='${userId}'
document.querySelector('input[type="password"]').value='${password}'
Array.from(document.querySelectorAll('a')).filter(a=>a.firstChild.nodeName==='IMG')[0].click()
`
}
const execScriptsTemplates = {
    loginScriptTemplate
}
export default execScriptsTemplates