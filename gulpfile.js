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

        // If exists, kills the previous instance of the application
        //
        if (pid !== null) process.kill(-pid);

        // Instantiates the application
        //
        //   It is intantiated in detached mode because the application spawns
        //   its own processes, therefore simply invoking the electron.kill()
        //   method to close the application wouldn't work, an invocation to
        //   process.kill(-pid) is needed.
        //
        const electron = spawn('node_modules/.bin/electron', [
            '--js-flags="--harmony"',
            'source/main.js'
        ], { detached: true });

        // Caches the process identifier of the application
        //
        pid = electron.pid;

        // Sends Alt+Tab keystroke when window is opened to regain focus
        // of last active window
        //
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

        // Kills the application instance when main process concludes
        //
        const unlistenDeath = listenDeath((signal) => {
            process.kill(-pid);
            process.exit(signal);
        });

        // Unlinks listener when the application concludes
        //
        electron.once('exit', () => { unlistenDeath(); });

    });

})();
