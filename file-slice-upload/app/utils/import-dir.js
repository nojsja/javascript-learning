const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '../../');
const isProd = process.env.NODE_ENV !== 'development';

function importTarget(array, target) {
  if (fs.statSync(target).isDirectory()) {
    const files = fs.readdirSync(target);
    files.length && files.forEach((file) => {
      importTarget(array, path.join(target, file));
    });
  } else {
    array.push(target);
  }
}

function importDir(dir) {
  const total = [];
  if (isProd) {
    importTarget(total, path.join(root, dir));
  }
  return total;
}


module.exports = importDir;
