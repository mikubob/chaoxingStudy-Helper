import { createApp } from 'vue';
import App from './App.vue';

async function mountApp() {
    let initialSettings = {};
    let settingsLoadFailed = false;
    try {
        initialSettings = await window.electronAPI.loadSettings();
    } catch {
        settingsLoadFailed = true;
    }
    createApp(App).provide('settingsStartup', { initialSettings, settingsLoadFailed }).mount('#app');
}

mountApp();
