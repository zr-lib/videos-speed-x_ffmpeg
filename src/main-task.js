const path = require('path');
const { existsSync } = require('fs');
const { fork } = require('child_process');
const { panic } = require('./utils/index.js');

const cwd = process.cwd();

/**
 * 主任务
 * @param {string[]} dirs
 * @param {number} speed
 */
module.exports = function mainTask(dirs, speed) {
  const argv = process.argv.slice(2);
  dirs.forEach((dirName) => {
    const dirPath = path.resolve(cwd, `${dirName}`);
    if (!existsSync(dirPath)) panic(`${dirPath}不存在`);

    const worker = fork(path.resolve(__dirname, './worker-task.js'), argv);
    worker.send({ dirName, dirPath, speed });
    worker.on('error', () => worker.kill());
    worker.on('exit', () => worker.kill());
  });
};
