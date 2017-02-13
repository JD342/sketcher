'use strict';

const winStateKeeper = require('electron-window-state');
const ab = require('auto-bind-proxy');

const { app, BrowserWindow } = require('electron');
require('auto-bind-proxy');

app.on('ready', () => {
    const { x, y, width, height, manage } = ab(winStateKeeper());
    var win = new BrowserWindow({
        title: 'Sketcher',
        frame: false,
        transparent: true,
        x, y, width, height
    });
    manage(win);
    win.loadURL(`file://${__dirname}/main.htm`);
    win.webContents.openDevTools();
    win.on('closed', () => { app.quit(); });
});
