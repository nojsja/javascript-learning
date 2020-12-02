const os = require('os');

function bytesToGB(num) {
  const result = (num / (1024 * 1024 * 1024)).toFixed(2);
  return result;
}

function secondsToHour(num) {
  const result = (num / 3600).toFixed(2);
  return result;
}

async function getCpuInfo() {
  const cpus = await os.cpus();
  return cpus;
}

async function getMemoryInfo() {
  const freemem = await os.freemem();
  const totalmem = await os.totalmem();
  const ratio = (((totalmem - freemem) / totalmem).toFixed(2)) * 100;

  return {
    freemem: `${bytesToGB(freemem)} GB`,
    totalmem: `${bytesToGB(totalmem)} GB`,
    ratio,
  };
}

async function getBasicInfo() {
  const hostname = await os.hostname();
  const release = await os.release();
  const platform = await os.platform();
  const arch = await os.arch();
  const uptime = await os.uptime();

  return {
    hostname,
    release,
    platform,
    arch,
    uptime: `${secondsToHour(uptime)} h`,
  };
}

async function getUserInfo() {
  const userInfo = await os.userInfo();

  return {
    username: userInfo.username,
    homedir: userInfo.homedir,
    shell: userInfo.shell,
  };
}

exports.cpu = getCpuInfo;
exports.memory = getMemoryInfo;
exports.basic = getBasicInfo;
exports.user = getUserInfo;
