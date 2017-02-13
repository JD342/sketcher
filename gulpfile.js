const { exec } = require('mz/child_process');
const { spawn } = require('child_process');
const ab = require('auto-bind-proxy');
const { task, watch, parallel } = ab(require('gulp'));
const listenDeath = require('death');

task('default', ['run'], () => {
    watch('source/**/*', ['run']);
});

(() => {

    let pid = null;

    task('run', () => {

        if (pid !== null) process.kill(-pid);

        const electron = spawn('node_modules/.bin/electron', [
            '--enable-transparent-visuals',
            '--js-flags="--harmony"',
            'source/main.js'
        ], { detached: true });

        pid = electron.pid;

        const unlistenDeath = listenDeath((signal) => {
            process.kill(-pid);
            process.exit(signal);
        });

        electron.once('exit', () => { unlistenDeath(); });

    });

})();
