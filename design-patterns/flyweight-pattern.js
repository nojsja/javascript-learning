/*
享元模式
*/

/*
未使用享元模式前需要创建很多对象
*/
(function () {

  var Upload = function (uploadType, fileName, fileSize) {
    this.uploadType = uploadType;
    this.fileName = fileName;
    this.fileSize = fileSize;
    this.dom = null;
  };

  Upload.prototype.init = function (id) {
    var that = this;
    this.id = id;
    this.dom = document.createElement('div');
    this.dom.innerHTML =
      '<span>文件名称：' + this.fileName + ', 文件大小：' + this.fileSize + '</span>' +
      '<button class="delFile">删除</button>';
    this.dom.querySelector('.delFile').onclick = function () {
      that.delFile();
    };
    document.appendChild( this.dom );
  };

  Upload.prototype.delFile = function () {
    if(this.fileSize < 3000){
      return this.dom.parentNode.removeChild(this.dom);
    }

    if (window.confirm('确定删除这个文件吗？'+this.fileName)) {
      return this.dom.parentNode.removeChild(this.dom);
    }
  }

  // 创建文件上传对象
  var id = 0;
  window.startUpload = function ( uploadType, files) {
    for (var i = 0, file; i < files.length, file = files[i]; i++) {
      var uploadObj = new Upload( uploadType, file.fileName, file.fileSize );
      uploadObj.init(id++);
    }
  };

})();

/*
使用享元模式后
*/
(function () {

  // 构造函数
  var Upload = function (uploadType) {
    this.uploadType = uploadType;
  }

  // init方法不再需要
  Upload.prototype.delFile = function (id) {
    // 结合外部状态
    uploadManager.setExternalState( id, this );

    if(this.fileSize < 3000){
      return this.dom.parentNode.removeChild(this.dom);
    }

    if (window.confirm('确定删除这个文件吗？'+this.fileName)) {
      return this.dom.parentNode.removeChild(this.dom);
    }
  };

  // 工厂进行对象实例化
  var UploadFactory = (function () {
    var createdFlyweightObjs = {};

    return {
      create: function ( uploadType ) {
        if( createdFlyweightObjs[ uploadType ] ){
          return createdFlyweightObjs[ uploadType ];
        }

        return createdFlyweightObjs[ uploadType ] = new Upload( uploadType );
      }
    };
  })();

  // 管理器封装外部状态
  var uploadManager = (function () {
    var uploadDatabase = {};

    return {
      // 添加一个共享对象
      add: function ( id, uploadType, fileName, fileSize ) {
        var flyweightObj = UploadFactory.create( uploadType );

        var dom = document.createElement('div');
        dom.innerHTML =
          '<span>文件名称：' + fileName + ', 文件大小：' + fileSize + '</span>' +
          '<button class="delFile">删除</button>';
        dom.querySelector('.delFile').onclick = function () {
          flyweightObj.delFile(id);
        };

        document.body.appendChild(dom);
        uploadDatabase[id] = {
          fileName: fileName,
          fileSize: fileSize,
          dom: dom
        };

        return flyweightObj;
      },
      // 共享对象需要用到外部主状态的时候执行组装
      setExternalState: function (id, flyweightObj) {
        var uploadData = uploadDatabase[id];
        for(var attr in uploadData){
          flyweightObj[attr] = uploadData[attr];
        }
      }
    }
  })();

  // 文件上传操作
  var id = 0;
  window.startUpload = function ( uploadType, files ) {
    for (var i = 0, file; i < files.length, file = files[i]; i++) {
      var uploadObj = uploadManager.add(id++, uploadType, file.fileName, file.fileSize);
    }
  }

})();
