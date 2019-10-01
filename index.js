const core = require('@actions/core');
const github = require('@actions/github');
const exec = require('child_process').exec;
const fs = require('fs');

installdir = process.env.HOME + "/.local/bin"

try {
  ro = core.getInput('runs-on').split("-")[0];

  fs.mkdirSync(installdir, { recursive: true });

  switch(ro) {
    case "ubuntu":
      dlcommand = "curl -L https://get.haskellstack.org/stable/linux-x86_64.tar.gz | tar xz --wildcards --strip-components=1 -C " + installdir + " '*/stack'";
      break;
    case "macOS":
      dlcommand = "curl --insecure -L https://get.haskellstack.org/stable/osx-x86_64.tar.gz | tar xz --strip-components=1 --include '*/stack' -C " + installdir;
      break;
    default:
      core.setFailed("Unsopported OS");
  }

  if (typeof dlcommand !== 'undefined') {
    exec(dlcommand, (err, stdout, stderr) => {
      core.addPath(installdir);
    });
  }
} catch (error) {
    core.setFailed(error.message);
}
