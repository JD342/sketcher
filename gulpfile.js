'use strict';

const { createInterface } = require('readline');
const { exec } = require('mz/child_process');
const { spawn } = require('child_process');
const ab = require('auto-bind-proxy');
const { task, watch, parallel } = ab(require('gulp'));
const listenDeath = require('death');
const timeout = require('timeout-as-promise');

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

        // Sends Alt+Tab keystroke when window is opened to regain focus
        // of last active window
        {

            const interf = createInterface({ input: electron.stdout });

            interf.on('line', function onLine(line) {

                if (line === 'load') {

                    interf.removeListener('line', onLine);

                    console.log('sending alt+tab keystroke');

                    (async () => {
                        await exec('xdotool keydown alt');
                        await timeout(500);
                        await exec('xdotool key Tab keyup alt');
                    })().catch(() => {
                        console.log('keystroke failed to execute, ' +
                                    'xdotool may not be installed');
                    });

                }

            });

        }

        const unlistenDeath = listenDeath((signal) => {
            process.kill(-pid);
            process.exit(signal);
        });

        electron.once('exit', () => { unlistenDeath(); });

    });

})();
