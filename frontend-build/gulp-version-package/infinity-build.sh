#!/usr/bin/bash

check() {
  local targetDir=$1
  if [ ! -d $targetDir ]; then
    echo "Please set the correct target-directory like '/path/to/infinity-frontend/infinity.boreas'"
    exit 1
  fi
}

chmod_gulp() {
  sudo chmod a+x ./node_modules/.bin/gulp
}

git_update() {
  git reset --hard HEAD
  git pull
}


Main() {
  targetDir=$1
  check $targetDir

  # cd $targetDir
  # git_update
  # cd -

  chmod_gulp

  bash gulp-build.sh $targetDir
  cd $targetDir/../

  bash configure `pwd`
  rpmbuild -bb infinitymgm-frontend.spec
}

Main $@
