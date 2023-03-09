const { createFFmpeg, fetchFile } = require('@ffmpeg/ffmpeg');
const { writeFile } = require('fs/promises');
const path = require('path');
const { getTime, getArgv } = require('../utils/index.js');

const cwd = process.cwd();
const { fext: _fext, fflog } = getArgv();
// TODO: 只有一个cpu在跑
const ffmpeg = createFFmpeg({ log: !!fflog });

/**
 * 合并
 * @param {string} dirPath 输出路径
 * @param {string} dirName 将作为新的文件名
 * @return {Promise}
 */
module.exports = async function handleConcat(dirPath, dirName) {
  const fext = _fext || 'mp4';
  const txtFile = `${dirName}.txt`;
  const outputFile = `${dirName}.${fext}`;
  const [_, ...copyArgs] = `ffmpeg -i ${txtFile} -f concat -c copy ${outputFile}`.split(' ');

  return new Promise(async (resolve, reject) => {
    console.log(`\n开始合并文件夹: ${dirPath}`);
    console.log(`[${getTime()}]#####[START]\n==> ${dirPath}.${fext}`);
    try {
      if (!ffmpeg.isLoaded()) await ffmpeg.load();
      ffmpeg.FS('writeFile', txtFile, await fetchFile(path.resolve(cwd, txtFile)));
      await ffmpeg.run.apply(ffmpeg, copyArgs);
      // TODO: error
      await writeFile(`${dirPath}.${fext}`, ffmpeg.FS('readFile', outputFile));
      console.log(`\n[${getTime()}]#####[DONE]\n`);
      resolve();
    } catch (err) {
      console.log('生成失败:', err);
      reject(err);
    }
  });
};
