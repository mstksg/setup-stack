const core = require('@actions/core');
const github = require('@actions/github');
const exec = require('child_process').exec;

try {
  ro = core.getInput('runs-on').split("-")[0];

  switch(ro) {
    case "ubuntu":
      dlcommand = "curl -L https://get.haskellstack.org/stable/linux-x86_64.tar.gz | tar xz --wildcards --strip-components=1 -C ~/.local/bin '*/stack'";
      break;
    case "macOS":
      dlcommand = "curl --insecure -L https://get.haskellstack.org/stable/osx-x86_64.tar.gz | tar xz --strip-components=1 --include '*/stack' -C ~/.local/bin";
      break;
    default:
      core.setFailed("Unsopported OS");
  }

  if (typeof dlcommand !== 'undefined') {
    exec(dlcommand, (err, stdout, stderr) => {
      core.addPath(process.env.HOME + "/.local/bin");
    });
  }
} catch (error) {
    core.setFailed(error.message);
}
