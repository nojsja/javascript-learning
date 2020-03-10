#!/bin/bash

echo_f() {
  echo ">>> now start to $1 ..."
}

echo_e() {
  printf ">>>\033[1;31m%b\033[0m" " ${1} \n"
}

clean() {
  echo_f "clean cache"
  rm dist/* -rf
  rm rev/css/* -rf
  rm rev/html/* -rf
  rm rev/js/* -rf
}

checkDir() {
  echo_f "check dir"
  for param in "$@" ; do
    if [ ! -d "$param" ]; then
      echo_e "$param is not a directory ! now exit ... "
      exit 1
    fi
  done
}

copyFile() {
  echo_f "copy origin file"
  fileType="$1"
  shift
  originDir="$1"
  mkdir -p "$originDir/$fileType"
  shift
  for param in "$@" ; do
    cp $param/*.$fileType $originDir/$fileType -rf
  done
}

gulpBuild() {
  echo_f "gulp build process"
  npm run gulp-build
}

restore() {
  echo_f "restore htm files"
  fileType="$1"
  distDir="$2"
  targetDir="$3"
  cp $distDir/$fileType/*.$fileType $targetDir/ -rf
}

main() {
  targetDir="$1"
  originDir="./origin"
  distDir="./dist"
  extendJs=("$targetDir/host/js/pages" "$targetDir/host/js/lib" "$targetDir/host/js/common" "$targetDir/host/js/lang")
  extendCss=("$targetDir/host/css")
  extendHtml=("$targetDir/webtemplate")

  checkDir ${extendJs[@]}
  checkDir ${extendCss[@]}
  checkDir ${extendHtml[@]}

  copyFile "js" $originDir ${extendJs[@]}
  copyFile "css" $originDir ${extendCss[@]}
  copyFile "htm" $originDir ${extendHtml[@]}

  clean

  gulpBuild

  restore "htm" "$distDir" "$targetDir/webtemplate"

  echo_f "done!"
}

main $@
