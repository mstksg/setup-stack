const core = require('@actions/core');
const github = require('@actions/github');
const child_process = require('child_process');
const fs = require('fs');
const os = require('os');

const installdir = process.env.HOME + "/.local/bin";

try {
  fs.mkdirSync(installdir, { recursive: true });

  var dlcommand;

  switch(os.platform()) {
    case "linux":
      dlcommand = "curl -L https://get.haskellstack.org/stable/linux-x86_64.tar.gz | tar xz --wildcards --strip-components=1 -C " + installdir + " '*/stack'";
      break;
    case "darwin":
      dlcommand = "curl --insecure -L https://get.haskellstack.org/stable/osx-x86_64.tar.gz | tar xz --strip-components=1 --include '*/stack' -C " + installdir;
      break;
    default:
      core.setFailed("Unsupported OS");
  }

  if (dlcommand) {
    child_process.execSync(dlcommand);
    core.addPath(installdir);
    child_process.execSync(installdir + "/stack", ["update"]);
  }
} catch (error) {
    core.setFailed(error.message);
}
