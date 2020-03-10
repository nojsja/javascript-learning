const path = require('path');
const fsChmod = require('./fs-chmod');

function fsChmodShell() {
  fsChmod(path.join(__dirname, '../shell'), 0o711);
}

module.exports = fsChmodShell;
