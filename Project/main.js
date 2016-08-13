const { app, BrowserWindow } = require('electron');

app.on('ready', () => {

    var win = new BrowserWindow({
        title: "Sketcher",
        frame: false,
        transparent: true
    });
    win.setMenu(null);
    win.loadURL(`file://${__dirname}/main.htm`);

});

app.on('window-all-closed', () => { app.quit(); });
