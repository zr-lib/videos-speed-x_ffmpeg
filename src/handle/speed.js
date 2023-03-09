const path = require('path');
const { getTime, getArgv, panic } = require('../utils/index.js');
const { existsSync, mkdirSync } = require('fs');
const { createFFmpeg, fetchFile } = require('@ffmpeg/ffmpeg');
const { writeFile } = require('fs/promises');

const { mode, fflog, an } = getArgv();
// TODO: 只有一个cpu在跑
const ffmpeg = createFFmpeg({
  log: !!fflog,
  progress: ({ ratio }) => !fflog && process.stdout.write(`\r${(ratio * 100).toFixed(2)}%`),
});

/**
 * 倍速
 * @param {{fileName: string; dirName: string; speed: number}} param0
 * @returns
 */
module.exports = async function handleSpeed({ fileName, dirName, speed }) {
  // TODO: 文件名多个.处理
  const [fname, fext] = fileName.split('.');
  if (!fext) panic('file: ', fileName, '没有文件扩展名!');

  const cwd = process.cwd();
  const isModeSP = mode === 'sp';
  const newFileName = `${fname}__${speed}x.${fext}`;
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
  const [_, ...args] = `ffmpeg -i ${fileName} ${param} ${newFileName}`.split(' ');
  console.log(`\n[${getTime()}]#####[START]\n==> ${newDirPath}/${newFileName}`);

  try {
    if (!ffmpeg.isLoaded()) await ffmpeg.load();
    ffmpeg.FS('writeFile', fileName, await fetchFile(filePath));
    await ffmpeg.run.apply(ffmpeg, args);
    await writeFile(`${newDirPath}/${newFileName}`, ffmpeg.FS('readFile', newFileName));
    console.log(`\n[${getTime()}]#####[DONE]`);
  } catch (err) {
    console.log(err);
  }
};
