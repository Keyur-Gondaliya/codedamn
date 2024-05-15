import fs from "fs";
import { spawn } from "node-pty";

const nginxConfigPath = "/etc/nginx/sites-enabled/default";
function getFileNameForPort(port: number) {
  return `/etc/nginx/sites-enabled/server-${port}.conf`;
}

export function _includeConfigForPort(port: number) {
  const fileName = getFileNameForPort(port);
  const currentConfig = fs.readFileSync(nginxConfigPath, "utf8");
  const newConfig = currentConfig.replace(
    `# include ${fileName};`,
    `include ${fileName};`
  );
  fs.writeFileSync(nginxConfigPath, newConfig);
  reloadNginx();
}

export function _excludeConfigForPort(port: number) {
  const fileName = getFileNameForPort(port);
  const currentConfig = fs.readFileSync(nginxConfigPath, "utf8");
  if (currentConfig.includes(`# include ${fileName};`)) {
    return;
  }
  const newConfig = currentConfig.replace(
    `include ${fileName};`,
    `# include ${fileName};`
  );
  fs.writeFileSync(nginxConfigPath, newConfig);
  reloadNginx();
}
import os from "os";

var shell = os.platform() === "win32" ? "powershell.exe" : "bash";

function reloadNginx() {
  var ptyProcess = spawn(shell, ["nginx", "-s", "reload"], {
    name: "xterm-color",
    cwd: "/",
    env: process.env,
  });

  ptyProcess.onExit((code: any) => {
    if (code !== 0) {
      console.error(`Error reloading NGINX. Exit code: ${code}`);
    } else {
      console.log("NGINX reloaded successfully.");
    }
  });
}

// Example port for the server

// const serverPort = 3003;

// _includeConfigForPort(serverPort);

// _excludeConfigForPort(serverPort);
