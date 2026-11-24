const { contextBridge, ipcRenderer } = require('electron');

// 安全地暴露 ipcRenderer 方法
contextBridge.exposeInMainWorld('electronAPI', {
    loadSettings: () => ipcRenderer.invoke('load-settings'),
    saveSettings: (settings) => ipcRenderer.invoke('save-settings', settings),
    send: (channel, data) => ipcRenderer.send(channel, data),
    on: (channel, callback) => ipcRenderer.on(channel, callback),
});
