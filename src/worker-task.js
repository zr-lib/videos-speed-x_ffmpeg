const path = require('path');
const { existsSync, writeFile, statSync } = require('fs');
const { getArgv, panic, getDirFiles } = require('./utils/index.js');
const handleSpeed = require('./handle/speed.js');
const handleConcat = require('./handle/concat.js');
const handleMerge = require('./handle/merge.js');

const cwd = process.cwd();

process.on('message', (data) => workerTask(data));

/**
 * 视频倍数+合并
 * @param {{dirName: string, dirPath: string, speed: number}} param0
 */
function workerTask({ dirName, dirPath, speed }) {
  const { fext, mode } = getArgv();
  const newDirName = `${dirName}__${speed}x`;
  const newDirPath = path.resolve(cwd, newDirName);

  if (speed !== 1 && existsSync(newDirPath)) {
    panic(`${newDirPath}已存在，请修改后继续`);
  }

  console.log(dirPath);
  getDirFiles(dirPath).then((data) => {
    console.log(data);
    if (speed !== 1) {
      // 先倍数再合并
      data.forEach((fileName, index) => {
        if (!statSync(path.resolve(dirPath, fileName)).isFile) return;
        handleSpeed({ fileName, dirName, speed });
        console.log(`${index + 1}/${data.length}`);
      });
    }

    const concatFilePath = `${newDirPath}.${fext}`;
    if (existsSync(concatFilePath)) panic(`${concatFilePath}已存在，请修改后继续`);

    const targetPath = speed > 1 ? newDirPath : dirPath;

    // 合并视频+音频
    if (mode === 'mr') {
      handleMerge(
        targetPath,
        data.map((i) => `${path.join(targetPath, i)}`)
      )
        .then(() => process.exit())
        .catch((err) => panic(err));
    }
    // ffmpeg多文件合并参数格式
    else if (mode === 'co' || mode === 'spc') {
      const txtData = data
        .map((i) => `file ${path.join(targetPath, i).replaceAll('\\', '\\\\')}`)
        .join('\n');
      const textFile = path.resolve(cwd, `${targetPath}.txt`);
      writeFile(textFile, txtData, { encoding: 'utf-8' }, (e) => {
        if (e) throw e;
        // console.log('生成成功: ', textFile);
        handleConcat(targetPath)
          .then(() => {
            if (speed !== 1) {
              console.log(`${dirPath}压缩并合并完成，\n请手动删除[${dirPath}__${speed}x]文件夹`);
            }
            process.exit();
          })
          .catch((err) => panic(err));
      });
    }
  });
}
