const minimist = require('minimist');

/**
 * @typedef Argvs 命令行参数格式化
 * @property {'spc' | 'sp' | 'co'} mode;
 * @property {number} sp 倍速 `mode=sp`时必传
 * @property {string} file 一个倍速文件，`mode=sp`时必传，
 * @property {string[]} dirs 合并的文件目录，`mode=co`/`mode=spc`时必传
 * @property {boolean} [fflog] 打印ffmpeg日志
 * @property {string} [fext] 合并后的文件后缀，默认`.mp4`
 * @property {string} [an] 倍速时禁用音频
 */

/**
 * 获取命令行参数
 * @returns {Argvs}
 */
exports.getArgv = function getArgv() {
  const argv = minimist(process.argv.slice(2));
  const sp = argv.sp ? argv.sp - 0 : 1;
  const dirs = (argv.dirs || '').split(',');
  const fflog = !!argv.fflog;
  const fext = argv.fext || 'mp4';
  return { ...argv, sp, dirs, fext, fflog };
};

/**
 * 打印并退出进程
 * @param {string} message
 * @param {number} code
 */
exports.panic = function panic(message, code = 1) {
  console.log(message);
  if (!exports.getArgv().fflog) console.log('可使用--fflog参数查看具体错误');
  process.exit(code);
};

/** 获取时间字符串 */
exports.getTime = function getTime() {
  return new Date().toLocaleString();
};

const fs = require('fs');
/**
 * 获取文件夹下文件列表
 * @param {import("fs").PathLike} targetPath
 * @returns {Promise<string[]>} 返回读取的data
 */
exports.getDirFiles = function getDirFiles(targetPath) {
  return new Promise((resolve) => {
    fs.readdir(targetPath, (e, data) => {
      if (e) throw e;
      resolve(data);
    });
  });
};
