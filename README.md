# shaders

## Building
```
git submodule update --init --recursive
cd openFrameworks/scripts/linux
./compileOF.sh -j4
./download_libs.sh
cd ubuntu
./compileOF.sh -j4
cd scripts/linux
./compilePG.sh
projectGenerator -o  apps/myApps/newExample
```
NOTE:Remember to add "export PG_OF_PATH=/home/lgomez/shaders/openFrameworks" to bashrc/zshrc.
