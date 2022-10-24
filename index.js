const core = require('@actions/core');
const github = require('@actions/github');
const child_process = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path')

const installdir = path.join(os.homedir(), '.local', 'bin');

try {
  fs.mkdirSync(installdir, { recursive: true });

  var dlcommand;

  switch (os.platform()) {
    case "linux":
      dlcommand = "curl -L https://get.haskellstack.org/stable/linux-x86_64.tar.gz | tar xz --wildcards --strip-components=1 -C " + installdir + " '*/stack'";
      break;
    case "darwin":
      dlcommand = "curl --insecure -L https://get.haskellstack.org/stable/osx-x86_64.tar.gz | tar xz --strip-components=1 --include '*/stack' -C " + installdir;
      break;
    case "win32":
      dlcommand = `PowerShell.exe -Command "&{Invoke-WebRequest -OutFile ${installdir}\\stack.zip https://get.haskellstack.org/stable/windows-x86_64.zip ; 7z e ${installdir}\\stack.zip -o${installdir} stack.exe ; Remove-Item ${installdir}\\stack.zip}"`;
      break;
    default:
      core.setFailed("Unsupported OS");
  }

  if (dlcommand) {
    child_process.execSync(dlcommand);
    core.addPath(installdir);
    child_process.execSync(path.join(installdir, "stack", "update"));
  }
} catch (error) {
    core.setFailed(error.message);
}
