# shaders
This repo is meant to be a source of reference for shaders examples to help guide future shader efforts (e.g. games.). Below is a list of some examples that stand out that might be helpful shader reference/documentation for the future.
- [HUD](shaders/examples/bin/data/shadersGL2/hud_lygia.frag)
This HUD is a replication of this [HUD](https://www.shadertoy.com/view/4s2SRt) with some modifications and it drawn using [lygia](https://lygia.xyz/)


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
