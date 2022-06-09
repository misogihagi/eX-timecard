import {useStorage} from '../services/storageAdapter.js'
import {useDownloader} from '../services/downloadAdapter.js'

export function useOutputConfig(){
  return async function downloadConfig(){
  const storage=useStorage()
  const downloader=useDownloader()
//    var blob = new Blob([JSON.stringify(await su.getStorage(['login','today']))], { "type" : "application/json" });
    const blob=await storage.getAsBlob(['login','today'])
    downloader.download(blob)
  }
}
export default useOutputConfig