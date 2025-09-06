"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("ipcRenderer", {
  on(...args) {
    const [channel, listener] = args;
    return electron.ipcRenderer.on(
      channel,
      (event, ...args2) => listener(event, ...args2)
    );
  },
  off(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.off(channel, ...omit);
  },
  send(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.send(channel, ...omit);
  },
  invoke(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.invoke(channel, ...omit);
  }
});
electron.contextBridge.exposeInMainWorld("chatgpt", {
  ask: (prompt) => electron.ipcRenderer.invoke("ask-chatgpt", prompt)
});
electron.contextBridge.exposeInMainWorld("auth", {
  setAuthUser: (authUser) => electron.ipcRenderer.send("save-auth-user", authUser),
  getAuthUser: () => electron.ipcRenderer.invoke("get-auth-user")
});
electron.contextBridge.exposeInMainWorld("updater", {
  checkForUpdate: () => electron.ipcRenderer.send("check_for_update"),
  installUpdate: () => electron.ipcRenderer.send("install_update"),
  onUpdateAvailable: (callback) => electron.ipcRenderer.on("update-available", callback),
  onUpdateDownloaded: (callback) => electron.ipcRenderer.on("update_downloaded", callback)
});
console.log("preload loaded");
