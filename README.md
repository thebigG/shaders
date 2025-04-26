# shaders

## Building OpenFrameworks
```
git submodule update --init --recursive
cd openFrameworks/scripts/linux
./download_libs.sh
cd ubuntu
sudo ./install_dependencies.sh
cd ..
./compileOF.sh -j4
projectGenerator -o  apps/myApps/newExample
```

## Build shaders project
```
make -j4
make RunRelease
```


NOTE:Remember to add "export PG_OF_PATH=/home/lgomez/shaders/openFrameworks" to bashrc/zshrc.
