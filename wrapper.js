const { spawn } = require('child_process');

const proc = spawn('node', ['testRegister.js'], { stdio: 'inherit' });

proc.on('close', (code) => {
  console.log('testRegister exited with code', code);
});
