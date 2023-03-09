const path = require('path');
const { existsSync, writeFile, statSync } = require('fs');
const { getArgv, panic, getDirFiles } = require('./utils/index.js');
const handleSpeed = require('./handle/speed.js');
const handleConcat = require('./handle/concat.js');

const cwd = process.cwd();

process.on('message', (data) => workerTask(data));

/**
 * 视频倍数+合并
 * @param {{dirName: string, dirPath: string, speed: number}} param0
 */
function workerTask({ dirName, dirPath, speed }) {
  const { fext, mode } = getArgv();
  const newDirName = mode === 'co' ? dirName : `${dirName}__${speed}x`;
  const newDirPath = path.resolve(cwd, newDirName);

  if (speed !== 1 && existsSync(newDirPath)) {
    panic(`${newDirPath}已存在，请修改后继续`);
  }

  console.log(dirPath);
  getDirFiles(dirPath).then(async (data) => {
    console.log(data);
    if (speed !== 1) {
      // 先倍数再合并
      for (let i = 0; i < data.length; i++) {
        const fileName = data[i];
        if (!statSync(path.resolve(dirPath, fileName)).isFile) return;
        await handleSpeed({ fileName, dirName, speed });
        console.log(`${i + 1}/${data.length}`);
      }
    }

    const concatFilePath = `${newDirPath}.${fext}`;
    if (existsSync(concatFilePath)) panic(`${concatFilePath}已存在，请修改后继续`);

    // ffmpeg多文件合并参数格式
    const txtData = data.map((i) => `file ${newDirName}/${i}`).join('\n');
    const textFile = path.resolve(cwd, `${newDirName}.txt`);
    writeFile(textFile, txtData, { encoding: 'utf-8' }, (e) => {
      if (e) throw e;
      // console.log('生成成功: ', textFile);
      handleConcat(newDirPath, newDirName)
        .then(() => {
          console.log(`${dirPath}压缩并合并完成，\n请手动删除[${newDirName}]文件夹`);
          process.exit();
        })
        .catch((err) => panic(err));
    });
  });
}
