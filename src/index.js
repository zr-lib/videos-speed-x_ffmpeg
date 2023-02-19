const { getArgv, panic } = require('./utils/index.js');
const mainTask = require('./main-task.js');
const handleSpeed = require('./handle/speed.js');

(function () {
  const { mode, sp, an, file, dirs } = getArgv();
  if (!mode) panic('--mode参数不存在!');
  if (!['spc', 'sp', 'co'].includes(mode)) {
    panic(`--mode参数不正确，可选值：${['spc', 'sp', 'co']}`);
  }
  // 仅合并
  if (mode === 'co') {
    if (!dirs.length) panic('--dirs参数不存在!');
    mainTask(dirs, 1);
  }
  // 仅倍速
  else if (mode === 'sp') {
    if (!file) panic('--file参数不存在!');
    if (!sp) panic('--sp参数不存在!');
    handleSpeed({ fileName: file, speed: sp, an });
  }
  // 倍速后合并
  else if (mode === 'spc') {
    if (!sp) panic('--sp参数不存在!');
    if (!dirs.length) panic('--dirs参数不存在!');
    mainTask(dirs, sp);
  }
})();
