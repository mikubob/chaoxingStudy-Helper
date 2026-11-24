const { app, BrowserWindow, Menu, ipcMain, safeStorage, shell } = require('electron');
const fs = require('node:fs');
const path = require('path');
const { spawn } = require('child_process');
const iconv = require('iconv-lite');

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        title: "超星AI自动答题",
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false
        },
    });

    if (process.env.NODE_ENV === 'development') {
        win.loadURL('http://localhost:8080');
        // win.webContents.openDevTools();
    } else {
        win.loadFile(path.join(__dirname, '../dist/index.html'));
    }
    // win.webContents.openDevTools();

    win.webContents.on('context-menu', (event, params) => {
        const selectEnabled = !!params.selectionText.trim().length
        const template = []
        if (params.isEditable) {
            template.unshift(...[{
                label: '粘贴',
                role: 'paste'
            }])
        }
        if (selectEnabled) {
            template.unshift(...[{
                label: '复制',
                role: 'copy',
                visible: () => !selectEnabled
            },
                {
                    label: '剪切',
                    role: 'cut'
                }])
        }
        if (template.length) {
            const RightMenu = Menu.buildFromTemplate(template)
            RightMenu.popup()
        }
    });
}

app.whenReady().then(() =>{
    Menu.setApplicationMenu(null);
    createWindow();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

function settingsFile() {
    return path.join(app.getPath('userData'), 'settings.enc');
}

function checkSettingsEncryption() {
    if (!safeStorage.isEncryptionAvailable() ||
        (process.platform === 'linux' && safeStorage.getSelectedStorageBackend() === 'basic_text')) {
        throw new Error('Local settings encryption is unavailable');
    }
}

ipcMain.handle('load-settings', () => {
    let encrypted;
    try {
        encrypted = fs.readFileSync(settingsFile());
    } catch (error) {
        if (error.code === 'ENOENT') return {};
        throw error;
    }
    checkSettingsEncryption();
    return JSON.parse(safeStorage.decryptString(encrypted));
});

ipcMain.handle('save-settings', (_event, settings) => {
    checkSettingsEncryption();
    const encrypted = safeStorage.encryptString(JSON.stringify(settings));
    const file = settingsFile();
    const temporaryFile = `${file}.${process.pid}.tmp`;
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(temporaryFile, encrypted, { mode: 0o600 });
    fs.renameSync(temporaryFile, file);
});

ipcMain.on('run-cmd', (event, args) => {
    if (!Array.isArray(args) || !args.every(arg => typeof arg === 'string' && arg.startsWith('--'))) {
        return;
    }

    const backend = path.join(process.resourcesPath, 'backend', 'chaoxing-backend.exe');
    const script = path.join(__dirname, '..', 'main.py');
    const options = { windowsHide: true, env: { ...process.env, PYTHONIOENCODING: 'gbk' } };
    const cmdProcess = app.isPackaged
        ? spawn(backend, args, { ...options, cwd: app.getPath('userData') })
        : spawn('python', [script, ...args], options);

    cmdProcess.on('error', (error) => {
        event.reply('cmd-output', `无法启动 Python 后端：${error.message}\n`);
    });

    // 实时输出日志（将 GBK 转换为 UTF-8）
    cmdProcess.stdout.on('data', (data) => {
        const utf8Data = iconv.decode(data, 'gbk'); // 转换编码
        event.reply('cmd-output', utf8Data);
    });

    cmdProcess.stderr.on('data', (data) => {
        const utf8Data = iconv.decode(data, 'gbk'); // 转换编码
        event.reply('cmd-output', utf8Data);
    });

    cmdProcess.on('close', (code) => {
        if (code !== null) {
            event.reply('cmd-output', `命令执行完毕，退出码：${code}\n`);
        }
    });
});

ipcMain.on("start-ie",(event,url) => {
    shell.openExternal(url);
});
