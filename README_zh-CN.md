# videos-speed-x_ffmpeg

[English](./README.md)|中文

基于`ffmpeg`多视频处理工具

- 仅合并
- 仅倍速
- 同时倍速+合并（先倍数后合并）
- 多文件夹处理

`Tips`:

> 先合并，得到的文件大小相当于所合并的文件大小相加，会占用较大空间；为了减少空间占用，采用

- **倍速** => `文件夹名__{speed}x`**文件夹**
- **合并** => `文件夹名__{speed}x`**文件**

## 安装 ffmpeg

点击链接官网下载[ffmpeg](http://www.ffmpeg.org/download.html)，并安装到本地

- shell测试版本如下

```bash
$ ffmpeg -version
ffmpeg version 5.1.2-full_build-www.gyan.dev Copyright (c) 2000-2022 the FFmpeg developers
```

## 使用

- `-h` 打印 `README.md`

```bash
vsxc-ffmpeg -h
```

- `--hzh` 打印 `README_zh-CN.md`

```bash
vsxc-ffmpeg --hzh
```

- `--mode=co`
```bash
vsxc-ffmpeg --mode=co --dirs=2023-02-12
```

- `--mode=sp`
```bash
vsxc-ffmpeg --mode=sp --file=2023-02-12.mp4 --sp=2
```

- `--mode=spc`
```bash
vsxc-ffmpeg --mode=spc --dirs=2023-02-12 --sp=8
```

### 参数

#### `--mode` 参数

- `sp`: 仅倍速
- `co`: 仅合并
- `spc`: 倍速+合并

#### 其他参数

| 参数   | 说明                                                 | 特定 --mode 有效/必传       |
| ------ | ---------------------------------------------------- | --------------------------- |
| --sp   | 倍速                                                 | all                         |
| --file | 当前路径下的目标文件                                 | `--mode=sp`必传             |
| --dirs | 目录，多个时逗号分隔                                 | `--mode=spc`/`--mode=co`有效 |
| --an   | **不保留音频**，不需要传值，**默认保留音频** | all                         |
| --fflog | 打印ffmpeg日志; **默认不打印** | all | 
| --fext | 合并输出的文件后缀，**默认mp4** | `--mode=spc`/`--mode=co`有效
