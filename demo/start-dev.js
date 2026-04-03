const { spawn } = require('child_process');
const path = require('path');
const proc = spawn(path.join(__dirname, 'node_modules/.bin/vite'), ['--port', '5174', '--host'], {
  cwd: __dirname, stdio: 'inherit'
});
