import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  openFile: () => ipcRenderer.invoke("dialog:openFile"),
  saveFile: (content: string) => ipcRenderer.invoke("dialog:saveFile", content),
  writeFile: (filePath: string, content: string) =>
    ipcRenderer.invoke("file:write", filePath, content),
  confirmSaveBeforeNew: () => ipcRenderer.invoke("dialog:confirmSaveBeforeNew"),
  onAttemptClose: (listener: () => void) => {
    const wrapped = () => listener();
    ipcRenderer.on("app:attempt-close", wrapped);
    return () => ipcRenderer.removeListener("app:attempt-close", wrapped);
  },
  proceedClose: () => ipcRenderer.send("app:proceed-close"),
  cancelClose: () => ipcRenderer.send("app:cancel-close"),
});
