const path = require('path');
const { spawnSync } = require('child_process');
const { getTime, getArgv, panic } = require('../utils/index.js');
const { existsSync, mkdirSync } = require('fs');

/**
 * 倍速
 * @param {{fileName: string; dirName: string; speed: number}} param0
 * @returns
 */
module.exports = function handleSpeed({ fileName, dirName, speed }) {
  // TODO: 文件名多个.处理
  const [fname, fext] = fileName.split('.');
  if (!fext) panic('file: ', fileName, '没有文件扩展名!');

  const cwd = process.cwd();
  const { mode, fflog, an } = getArgv();
  const isModeSP = mode === 'sp';
  const newFileName = isModeSP ? `${fname}__${speed}x.${fext}` : fileName;
  const filePath = isModeSP ? path.resolve(cwd, fileName) : path.resolve(cwd, dirName, fileName);
  const dirPath = path.resolve(cwd, dirName);
  const newDirPath = isModeSP ? dirPath : path.resolve(cwd, `${dirName}__${speed}x`);

  if (!existsSync(filePath)) panic(`${filePath} 不存在`);
  if (!existsSync(newDirPath)) {
    if (newDirPath === `${dirPath}__${speed}x`) mkdirSync(newDirPath);
    else panic(`${newDirPath} 格式不正确，应为"{dir}__{sp}x"`);
  }

  // 视频倍速
  const videoParam = `setpts=${(1 / speed).toFixed(2)}*PTS`;
  // 音频倍速
  const audioParam = `[0:a]atempo=${speed}[a]`;
  const filter_complex = `-filter_complex [0:v]${videoParam}[v];${audioParam} -map [v] -map [a]`;
  // an去音频
  const param = an ? `-an -filter:v ${videoParam}` : filter_complex;
  const [cmd, ...args] = `ffmpeg -i ${filePath} ${param} ${newDirPath}/${newFileName}`.split(' ');
  console.log(`\n[${getTime()}]#####[START]\n==> ${newDirPath}/${newFileName}`);

  const sp = spawnSync(cmd, args, { stdio: fflog ? 'inherit' : 'ignore' });
  if (sp.error) throw sp.error;
  if (sp.stderr) console.log(sp.stderr.toString());
  if (!sp.error) console.log(`[${getTime()}]#####[DONE]`);
};
