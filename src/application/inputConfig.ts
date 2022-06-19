import { useStorage } from "../services/storageAdapter";

export function useInputConfig(strFn) {
  const storage = useStorage();

  return async function setupConfig() {
    const config = JSON.parse(await strFn());
    await storage.set(config);
  };
}
export default useInputConfig;
