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
console.log("preload loaded");
