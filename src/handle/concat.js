const { spawn } = require('child_process');
const { getTime, getArgv } = require('../utils/index.js');

/**
 * 合并
 * @param {string} dirPath 将作为新的文件名
 * @return {Promise}
 */
module.exports = function handleConcat(dirPath) {
  const { fext: _fext, fflog } = getArgv();
  const fext = _fext || 'mp4';
  const [copyCmd, ...copyArgs] =
    `ffmpeg -f concat -i ${dirPath}.txt -c copy ${dirPath}.${fext}`.split(' ');

  return new Promise((resolve, reject) => {
    console.log(`\n开始合并文件夹: ${dirPath}`);
    const copy = spawn(copyCmd, copyArgs, { stdio: fflog ? 'inherit' : 'ignore' });
    console.log(`[${getTime()}]#####[START]\n==> ${dirPath}.${fext}`);

    copy.on('error', (e) => console.log(e));
    copy.on('close', (code) => {
      if (code !== 0) {
        reject(code);
        console.log('生成失败, code:', code);
      } else {
        console.log(`[${getTime()}]#####[DONE]\n`);
        resolve();
      }
    });
  });
};
