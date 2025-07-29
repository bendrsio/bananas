import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  getInitialText: () => ipcRenderer.invoke("get-initial-text"),
});
