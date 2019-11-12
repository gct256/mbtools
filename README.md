# mbtools

Development tools for MSX.

## Features

- **Build system**: Generate `Makefile` and use `make` command to building.
- **Preprocessor**: Generate assembler files from various source files.
- **Watch**: Watch files, build project and reload emulator.

## System required

- node.js >= 10
- assembler
  - pasmo: http://pasmo.speccy.org/
- emulator
  - openmsx: https://openmsx.org/

## Install

```sh
$ npm install -g @gct256/mbtools
```

## Usage

```sh
$ mkdir my-project
$ cd my-project
$ mbtools setup
$ make watch
```

## Main commands

### `mbtools config`

Generate global configuration in interactive.
Other command needs global configuration.

| name     | description                          | default   | note                     |
| -------- | ------------------------------------ | --------- | ------------------------ |
| asm.type | Type of assembler.                   | `pasmo`   | currently only `pasmo`   |
| asm.path | File path of assembler executable.   |           |                          |
| asm.ext  | Extname of assembler source file.    | `.asm`    |                          |
| emu.type | Type of emulator.                    | `openmsx` | currently only `openmsx` |
| emu.path | File path of emulator executable.    |           |                          |
| pp.ext   | Extname of preprocessor result file. | `.inc`    |                          |
| dest.ext | Extname of destination file.         | `.rom`    |                          |

### `mbtools setup`

Generate Makefile on current directory in interactive.

After setup, use `make` to build.

| command line | action                  |
| ------------ | ----------------------- |
| `make`       | Build project.          |
| `make clean` | Remove generated files. |
| `make watch` | Start watch mode.       |

### Other command.

Normally not used. (used by Makefile)

#### `mbtools watch`

Start watch mode.

- Watch file in current directory.
  - If add/update preprocess target file, start preprocess.
  - If add/update assembler source file, build project.
  - If add/update destination file, reload emulator.

#### `mbtools js2asm FILE EXT`

Generate assembler source file from JavaScript code.

`FILE` is file include JavaScript code.
`EXT` is output file's extname.

- Example:
  - FILE: `foo/bar/baz.js`
  - EXT: `.inc`
  - output: `foo/bar/baz.js.inc`

##### Convert rules

| JavaScript value                         | result                               |
| ---------------------------------------- | ------------------------------------ |
| boolean, boolean[]                       | DB directive. (0 or 1)               |
| number, number[]                         | DB directive.                        |
| Int8Array, Uint8Array, Uint8ClampedArray | DB directive.                        |
| Int16Array, Unt16Array                   | DW directive.                        |
| string, string[]                         | DB directive. (single quoted string) |
| other                                    | Ignore.                              |

NOTE: nested array flatten.

#### `mbtools png2asm FILE EXT`

Generate assembler source file from PNG image file.

`FILE` is image file.
`EXT` is output file's extname.

- Example 1: single result
  - FILE: `foo/bar/baz.png`
  - EXT: `.inc`
  - output: `foo/bar/baz.png.inc`
- Example 2: multiple result
  - FILE: `foo/bar/baz.png`
  - EXT: `.inc`
  - output: `foo/bar/baz.png.inc`, `foo/bar/baz.png.qux.inc`

##### Convert rules

Convertion method is desided according end of file name.

| end on file name     | method                             | result            |
| -------------------- | ---------------------------------- | ----------------- |
| `.msx_sprite_8.png`  | 8x8 bit pattern                    | single            |
| `.msx_sprite_16.png` | 16x16 bit pattern                  | single            |
| `.msx_screen_2.png`  | 8x8 bit pattern and 8x8 color data | multiple (.color) |

#### `mbtools shrink SIZE IN OUT`

Adjust file size.

`SIZE` is file size by `KiB`
`IN` is input file path.
`OUT` is output file path.

## TODO

- Add assembler types.
- Add emulator types.
