# videos-speed-x_ffmpeg

English|[中文](./README_zh-CN.md)

Multi-video processing tool based on 'ffmpeg'

- concat only
- merge `video`+`audio`
- speed only
- speed+concat(speed first, and then concat)
- Multi-folder and multi-process processing

`Tips`:

> Concat first, and the resulting file size is equal to the combined file size, which will occupy a large space; In order to reduce space occupation

- **Speed** => `dir__{speed}x`**directory**
- **Concat** => `dir__{speed}x`**file**

## Install ffmpeg

Click the link to download from the official website[ffmpeg](http://www.ffmpeg.org/download.html), And install it locally

- The shell test version is as follows

```bash
$ ffmpeg -version
ffmpeg version 5.1.2-full_build-www.gyan.dev Copyright (c) 2000-2022 the FFmpeg developers
```

## Usage

- `-h` console `README.md`

```bash
vsxc-ffmpeg -h
```

- `--hzh` console `README_zh-CN.md`

```bash
vsxc-ffmpeg --hzh
```

- `--mode=mr`

merge `video`+`audio`

```bash
vsxc-ffmpeg --mode=mr --dirs=2023-02-12
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

### Params

#### `--mode` param

- `sp`: speed only
- `co`: concat only
- `mr`: merge video+audio
- `spc`: speed and concat

#### others

| params   | describtion                                                 | Specific -- mode is valid/required       |
| ------ | ---------------------------------------------------- | --------------------------- |
| --sp   | speed                                                 | all                         |
| --file | Target file under current path                                 | `--mode=sp` Required             |
| --dirs | Directory, multiple separated by commas                                | `--mode=spc`/`--mode=co` Valid |
| --an   | **No audio reserved**, no value transfer required, **audio reserved by default** | all                         |
| --fflog | Print ffmpeg logs;**Do not print by default** | all | 
| --fext | Merged output file suffix, **default mp4** | `--mode=spc`/`--mode=co` Valid
