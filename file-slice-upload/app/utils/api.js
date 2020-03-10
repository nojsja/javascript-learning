export const hmsApi = {
  PublicIpParameter: () => JSON.parse(sessionStorage.getItem('currentChildrenMenu')).ip,
  list: {
    getList: { // 节点列表
      url: '/node/list',
      desc: 'HMS_Api_List_GetList',
      method: 'post',
    },
    searchList: { // 节点搜索
      url: '/node/list/search',
      desc: 'HMS_Api_List_SearchList',
      method: 'post',
    },
    nodeInfo: { // 节点基本信息
      url: '/node/list/info',
      desc: 'HMS_Api_List_NodeInfo',
      method: 'post',
    },
    addNode: { // 添加节点
      url: '/node/list/add',
      desc: 'HMS_Api_List_AddNode',
      method: 'post',
    },
    deleteNode: { // 删除节点
      url: '/node/list/delete',
      desc: 'HMS_Api_List_DeleteNode',
      method: 'post',
    },
    initNode: { // 初始化集群
      url: '/node/cluster/init',
      desc: 'HMS_Api_List_InitNode',
      method: 'post',
    },
    operationLog: { // 操作日志
      url: '/node/log/operation',
      desc: 'HMS_API_Log',
      method: 'get',
    },
    operationListLog: { // 节点列表操作日志
      url: '/node/list/log',
      desc: 'HMS_API_Log',
      method: 'get',
    },
    operationIpmiAndPower: { // 概况中 ipmi与导航条各种操作的操作日志
      url: '/node/ipmiAndpower/log',
      desc: 'HMS_API_Log',
      method: 'get',
    },
    // /node/list/log
  },
  abstract: {
    getAbstractBasic: { // 节点基本信息
      url: '/node/abstract/basic',
      desc: 'HMS_Api_Abstract_GetAbstractBasic',
    },
    getAbstract: { // 节点概况
      url: '/node/abstract',
      desc: 'HMS_Api_Abstract_GetAbstract',
      method: 'post',
    },
    getZoneList: { // 可选时区列表
      url: '/node/abstract/zone/list',
      desc: 'HMS_Api_Abstract_GetZoneList',
      methos: 'post',
    },
    editZone: { // 设置时区
      url: '/node/abstract/zone/edit',
      desc: 'HMS_Api_Abstract_EditZone',
      method: 'post',
    },
    getTimeDetail: { // 获取时间详情
      url: '/node/abstract/time/detail',
      desc: 'HMS_Api_Abstract_GetTimeDetail',
      method: 'post',
    },
    editTime: { // 设置时间
      url: '/node/abstract/time/edit',
      desc: 'HMS_Api_Abstract_EditTime',
      method: 'post',
    },
    getNodeModel: { // 查询主机型号
      url: '/node/abstract/model',
      desc: 'HMS_Api_Abstract_GetNodeModel',
      method: 'post',
    },
    editNodeModel: { // 设置主机型号
      url: '/node/abstract/model/edit',
      desc: 'HMS_Api_Abstract_EditNodeModel',
      method: 'post',
    },
    getNodeHostName: { // 查询主机名称
      url: '/node/abstract/hostname',
      desc: 'HMS_Api_Abstract_GetNodeHostName',
      method: 'post',
    },
    editNodeHostName: { // 设置主机名称
      url: '/node/abstract/hostname/edit',
      desc: 'HMS_Api_Abstract_EditNodeHostName',
      method: 'post',
    },
    getIpmiInfo: { // 获取ipmi信息
      url: '/node/abstract/ipmi',
      desc: 'HMS_Api_Abstract_GetIpmiInfo',
      method: 'post',
    },
    editIpmiPwd: { // 设置IPmi密码
      url: '/node/abstract/ipmi/password/edit',
      desc: 'HMS_Api_Abstract_EditIpmiPwd',
      method: 'post',
    },
    editIpmiLan: { // 设置ipmi网络
      url: '/node/abstract/ipmi/lan/edit',
      desc: 'HMS_Api_Abstract_EditIpmiLan',
      method: 'post',
    },
    currentIpmiInfo: { // 获取当前ipmi的信息
      url: '/node/abstract/ipmi/current',
      desc: 'HMS_Api_Abstract_CurrentIpmiInfo',
      method: 'post',
    },
    updateIpmi: { // 更新ipmi
      url: '/node/abstract/ipmi/update/current',
      desc: 'HMS_Api_Abstract_UpdateIpmi',
      method: 'post',
    },
    powerOff: { // 关机
      url: '/node/abstract/power/off',
      desc: 'HMS_Api_Abstract_PowerOff',
      method: 'post',
    },
    powerControl: { // 强制电源操作
      url: '/node/abstract/power/control',
      desc: 'HMS_Api_Abstract_PowerControl',
      method: 'post',
    },
    powerRestart: { // 重启
      url: '/node/abstract/power/restart',
      desc: 'HMS_Api_Abstract_PowerRestart',
      method: 'post',
    },
    powerStatus: { // 获取电源信息
      url: '/node/abstract/power/status',
      desc: 'HMS_Api_Abstract_PowerStatus',
      method: 'post',
    },
    getCycleList: { // 定时扫描周期
      url: '/node/abstract/monitor/cycle/list',
      desc: 'HMS_Api_Abstract_GetCycleList',
      method: 'post',
    },
    setCycle: {// 设置定时扫描周期
      url: '/node/abstract/monitor/cycle/set',
      desc: 'HMS_Api_Abstract_SetCycle',
      method: 'post',
    },
  },
  hardware: {
    getCpuInfo: { // 查询cpu信息
      url: '/node/hardware/cpu',
      desc: 'HMS_Api_Hardware_GetCpuInfo',
      method: 'post',
    },
    getFanInfo: { // 查询风扇信息
      url: '/node/hardware/fan',
      desc: 'HMS_Api_Hardware_GetFanInfo',
      method: 'post',
    },
    getMotherboardInfo: { // 查询主板信息
      url: '/node/hardware/motherboard',
      desc: 'HMS_Api_Hardware_GetMotherboardInfo',
      method: 'post',
    },
    getPcieInfo: { // 查询pcie信息
      url: '/node/hardware/pcie',
      desc: 'HMS_Api_Hardware_GetPcieInfo',
      method: 'post',
    },
    getMemoryInfo: { // 查询memory信息
      url: '/node/hardware/memory',
      desc: 'HMS_Api_Hardware_GetMemoryInfo',
      method: 'post',
    },
    getHistories: { // 查询日志信息
      url: '/node/monitor/histories',
      desc: 'HMS_Api_Hardware_GetHistories',
      method: 'post',
    },
    getChanges: { // 查询变更
      url: '/node/monitor/changes/list',
      desc: 'HMS_Api_Hardware_GerChanges',
      method: 'post',
    },
    confirmChanges: { // 确认变更
      url: '/node/monitor/changes/confirm',
      desc: 'HMS_Api_Hardware_ConfirmChanges',
      method: 'post',
    },
  },
  storage: {
    getStorageInfo: { // 查询存储信息
      url: '/node/storage/info',
      desc: 'HMS_Api_Storage_GetStorageInfo',
      method: 'post',
    },
    getSwapInfo: {
      url: '/node/storage/memory/swap', // 查询SWAP信息
      desc: 'HMS_Api_Storage_GetSwapInfo',
      method: 'post',
    },
    getBlockdevInfo: {
      url: '/node/storage/blockdev/info', // 块设备-查询
      desc: 'HMS_Api_Storage_GetBlockDevInfo',
      method: 'post',
    },
    getBlockdevRaInfo: {
      url: '/node/storage/blockdev/ra', // 块设备-预读值-查询
      desc: 'HMS_Api_Storage_GetBlockDevRaInfo',
      method: 'post',
    },
    editPartationRa: {
      url: '/node/storage/partation/ra/edit', // 块设备-预读值-设置
      desc: 'HMS_Api_Storage_EditBlockDevRa',
      method: 'post',
    },
    editLvmLvRa: {
      url: '/node/storage/lvm/lv/ra/edit', // 块设备-预读值-设置
      desc: 'HMS_Api_Storage_EditBlockDevRa',
      method: 'post',
    },
    getBlockDevPartitionsInfo: {
      url: '/node/storage/blockdev/partitions', // 分区查询
      desc: 'HMS_Api_Storage_GetBlcokDevPartitionsInfo',
      method: 'post',
    },
    addBlockDevpartition: {
      url: '/node/storage/blockdev/partitions/add', // 分区创建
      desc: 'HMS_Api_Storage_AddBlockDevPartition',
      method: 'post',
    },
    deleteBlockDevpartition: {
      url: '/node/storage/blockdev/partitions/delete', // 分区删除
      desc: 'HMS_Api_Storage_DeleteBlockDevPartition',
      method: 'post',
    },
    getLvmInfo: {
      url: '/node/storage/lvm', // lvm查询,
      desc: 'HMS_Api_Storage_GetLvmInfo',
      method: 'post',
    },
    addLvmPV: {
      url: '/node/storage/lvm/pv/add', // pv创建
      desc: 'HMS_Api_Storage_AddLvmPV',
      method: 'post',
    },
    extendLvmPV: {
      url: '/node/storage/lvm/pv/extend', // pv扩容
      desc: 'HMS_Api_Storage_ExtendLvmPV',
      method: 'post',
    },
    deleteLvmPV: {
      url: '/node/storage/lvm/pv/delete', // pv删除
      desc: 'HMS_Api_Storage_DeleteLvmPv',
      method: 'post',
    },
    addLvmVg: {
      url: '/node/storage/lvm/vg/add', // vg创建
      desc: 'HMS_Api_Storage_AddLvmVg',
      method: 'post',
    },
    extendLvmVg: {
      url: '/node/storage/lvm/vg/extend', // vg扩容
      desc: 'HMS_Api_Storage_ExtendLvmVg',
      method: 'post',
    },
    renameLvmVg: {
      url: '/node/storage/lvm/vg/rename', // vg重命名
      desc: 'HMS_Api_Storage_RenameLvmVg',
      method: 'post',
    },
    deleteLvmVg: {
      url: '/node/storage/lvm/vg/delete', // vg删除
      desc: 'HMS_Api_Storage_DeleteLvmVg',
      method: 'post',
    },
    addLvmLv: {
      url: '/node/storage/lvm/lv/add', // lv创建
      desc: 'HMS_Api_Storage_AddLvmLv',
      method: 'post',
    },
    extendLvmLv: {
      url: '/node/storage/lvm/lv/extend', // lv扩容
      desc: 'HMS_Api_Storage_ExtendLvmLv',
      method: 'post',
    },
    renameLvmLv: {
      url: '/node/storage/lvm/lv/rename', // lv重命名
      desc: 'HMS_Api_Storage_RenameLvmLv',
      method: 'post',
    },
    rollbackLvmLv: {
      url: '/node/storage/lvm/lv/rollback', // lv回滚
      desc: 'HMS_Api_Storage_RollbackLvmLv',
      method: 'post',
    },
    deleteLvmLv: {
      url: '/node/storage/lvm/lv/delete', // lv删除
      desc: 'HMS_Api_Storage_DeleteLvmLv',
      method: 'post',
    },
    snapshotRestore: {
      url: '/node/storage/lvm/snapshot/restore', // 快照回滚
      desc: 'HMS_Api_Storage_SnapshotRestore',
      method: 'post',
    },
    lvActivate: {
      url: '/node/storage/lvm/lv/activate', // lv启用
      desc: 'HMS_Api_Storage_LV_activate',
      method: 'post',
    },
    lvDeactivate: {
      url: '/node/storage/lvm/lv/deactivate', // lv停用
      desc: 'HMS_Api_Storage_LV_deactivate',
      method: 'post',
    },
    scanningIscsiTarget: {
      url: '/node/storage/iscsi/initiator/targets/scanning', // 扫描ISCSI Target
      desc: 'HMS_Api_Storage_ScanningIscsiTarget',
      method: 'post',
    },
    getIscsiInitiator: {
      url: '/node/storage/iscsi/initiator', // iscsi-查询
      desc: 'HMS_Api_Storage_GetIscsiInitiator',
      method: 'post',
    },
    createIscsiSession: {
      url: '/node/storage/iscsi/session/create', // iscsi-挂载/创建
      desc: 'HMS_Api_Storage_CreateIscsiSession',
      method: 'post',
    },
    deleteIscsiSession: {
      url: '/node/storage/iscsi/initiator/sessions', // iscsi-卸载
      desc: 'HMS_Api_Storage_DeleteIscsiSession',
      method: 'post',
    },
    deleteIscsi: {
      url: '/node/storage/iscsi/initiator/delete', // iscsi-删除
      desc: 'HMS_Api_Storage_DeleteIscsi',
      method: 'post',
    },
    setIscsi: {
      url: '/node/storage/iscsi/initiator/set', // iscsi-设置
      desc: 'HMS_Api_Storage_SetIscsi',
      method: 'post',
    },
    discoverTargets: {
      url: '/node/storage/iscsi/initiator/targets', // iscsi-获取ip信息
      desc: 'HMS_Api_Storage_DiscoverTargets',
      method: 'post',
    },
    getLocalFileSystemInfo: {
      url: '/node/storage/fs/local/info', // Local Fs-查询
      desc: 'HMS_Api_Storage_GetLocalFileSystemInfo',
      method: 'post',
    },
    addLocalFS: {
      url: '/node/storage/fs/local/add', // Local Fs-创建
      desc: 'HMS_Api_Storage_AddLocalFS',
      method: 'post',
    },
    deleteLocalFS: {
      url: '/node/storage/fs/local/delete', // Local Fs-删除
      desc: 'HMS_Api_Storage_DeleteLocalFS',
      method: 'post',
    },
    expandLocalFS: {
      url: '/node/storage/fs/local/expand', // Local Fs-扩容
      desc: 'HMS_Api_Storage_ExpandLocalFS',
      method: 'post',
    },
    getFileSystemInfo: {
      url: '/node/storage/fs/net/info', // Network Fs & Infinity Fs-查询
      desc: 'HMS_Api_Storage_GetFileSystemInfo',
      method: 'post',
    },
    addNFS: {
      url: '/node/storage/fs/net/nfs/add', // Network Fs-创建NFS
      desc: 'HMS_Api_Storage_AddNFS',
      method: 'post',
    },
    getNfsShares: {
      url: '/node/storage/fs/net/nfs/exports', // NFS Shares-查询
      desc: 'HMS_Api_Storage_GetNfsShares',
      method: 'post',
    },
    addCIFS: {
      url: '/node/storage/fs/net/cifs/add', // Network Fs-创建CIFS
      desc: 'HMS_Api_Storage_AddCIFS',
      method: 'post',
    },
    getCifsShares: {
      url: '/node/storage/fs/net/cifs/shares', // CIFS Shares-查询
      desc: 'HMS_Api_Storage_GetCifsShares',
      method: 'post',
    },
    addInfinityFs: {
      url: '/node/storage/fs/net/infinity/add', // Infinity Fs-创建
      desc: 'HMS_Api_Storage_AddInfinityFs',
      method: 'post',
    },
    getInfinitySubDir: {
      url: '/node/storage/fs/net/infinity/subdir', // Infinity Path-查询
      desc: 'HMS_Api_Storage_GetInfinitySubDir',
      method: 'post',
    },
    deleteFileSystem: {
      url: '/node/storage/fs/net/delete', // Network Fs & Infinity Fs-删除
      desc: 'HMS_Api_Storage_DeleteFileSystem',
      method: 'post',
    },
    unmountFileSystem: {
      url: '/node/storage/fs/mounts/unmount', // Fs-卸载
      desc: 'HMS_Api_Storage_UnmountFileSystem',
      method: 'post',
    },
    mountFileSystem: {
      url: '/node/storage/fs/mounts/mount', // Fs-挂载
      desc: 'HMS_Api_Storage_MountFileSystem',
      method: 'post',
    },
    editAutomount: {
      url: '/node/storage/fs/automount', // Fs-挂载设置
      desc: 'HMS_Api_Storage_EditAutomount',
      method: 'post',
    },
    getFileSubDir: {
      url: '/node/storage/file/subdir', // Fs-获取子目录
      desc: 'HMS_Api_Storage_GetFileSubDir',
      method: 'post',
    },
    getraidsList: {
      url: '/node/storage/raids', // raids-查询
      desc: 'HMS_Api_Storage_GetraidsList',
      method: 'post',
    },
    addRaid: {
      url: '/node/storage/raid', // Raid-创建
      desc: 'HMS_Api_Storage_AddRaid',
      method: 'post',
    },
    extendRaid: {
      url: '/node/storage/raids/extend', // Raid-扩容
      desc: 'HMS_Api_Storage_ExtendRaid',
      method: 'post',
    },
    deleteRaid: {
      url: '/node/storage/raids/delete', // Raid-删除
      desc: 'HMS_Api_Storage_DeleteRaid',
      method: 'post',
    },
    setReadWriteCacheRAID: {
      url: '/node/storage/raid/cache', //  Raid-设置读写缓存
      desc: 'HMS_Api_Storage_SetReadWriteCacheRAID',
      method: 'post',
    },
    setReadCacheRAID: {
      url: '/node/storage/raid/cache/read', //  Raid-设置读缓存
      desc: 'HMS_Api_Storage_SetReadCacheRAID',
      method: 'post',
    },
    setWriteCacheRAID: {
      url: '/node/storage/raid/cache/write', //  Raid-设置写缓存
      desc: 'HMS_Api_Storage_SetWriteCacheRAID',
      method: 'post',
    },
    startRaidCheck: {
      url: '/node/storage/raid/check/start', // Raid-开始校验
      desc: 'HMS_Api_Storage_StartRaidCheck',
      method: 'post',
    },
    stopRaidCheck: {
      url: '/node/storage/raid/check/stop', // Raid-停止校验
      desc: 'HMS_Api_Storage_StopRaidCheck',
      method: 'post',
    },
    retrieveRaidCheck: {
      url: '/node/storage/raid/check/schedule', // Raid-获取定时校验
      desc: 'HMS_Api_Storage_RetrieveRaidCheck',
      method: 'post',
    },
    setRaidCheck: {
      url: '/node/storage/raid/check/schedule/set', // Raid-设置定时校验
      desc: 'HMS_Api_Storage_SetRaidCheck',
      method: 'post',
    },
    disableRaidCheck: {
      url: '/node/storage/raid/check/schedule/disable', // Raid-取消定时校验
      desc: 'HMS_Api_Storage_DisableRaidCheck',
      method: 'post',
    },
    getRaidNextTime: {
      url: '/node/storage/raid/schedule/next', // Raid-获取下次执行时间
      desc: 'HMS_Api_Storage_GetRaidNextTime',
      method: 'post',
    },
    getRaidTask: {
      url: '/node/storage/raid/check', // Raid-获取当前任务
      desc: 'HMS_Api_Storage_GetRaidTask',
      method: 'post',
    },
    retrieveSSDCacheTask: {
      url: '/node/storage/raid/ssdcache/task', // Raid-获取缓存任务
      desc: 'HMS_Api_Storage_RetrieveSSDCacheTask',
      method: 'post',
    },
    startSSDCacheCheck: {
      url: '/node/storage/raid/ssdcache/check/start', // Raid-开始缓存任务
      desc: 'HMS_Api_Storage_StartSSDCacheCheck',
      method: 'post',
    },
    stopSSDCacheCheck: {
      url: '/node/storage/raid/ssdcache/check/stop', // Raid-停止缓存任务
      desc: 'HMS_Api_Storage_StopSSDCacheCheck',
      method: 'post',
    },
    editRaidName: {
      url: '/node/storage/raids/edit', // Raid-修改名字
      desc: 'HMS_Api_Storage_EditRaidName',
      method: 'post',
    },
    createCacheRAID: {
      url: '/node/storage/raid/ssdcache/create', // 创建缓存raid
      desc: 'HMS_Api_Storage_CreateCacheRAID',
      method: 'post',
    },
    deleteCacheRAID: {
      url: '/node/storage/raid/ssdcache/delete', // 删除缓存raid
      desc: 'HMS_Api_Storage_DeleteCacheRAID',
      method: 'post',
    },
    setSSDReadCache: {
      url: '/node/storage/raid/ssdcache/read', // 设置SSD读缓存
      desc: 'HMS_Api_Storage_SetSSDReadCache',
      method: 'post',
    },
    setSSDWriteCache: {
      url: '/node/storage/raid/ssdcache/write', // 设置SSD写缓存
      desc: 'HMS_Api_Storage_SetSSDWriteCache',
      method: 'post',
    },
    getControllers: {
      url: '/node/storage/disk/controllers', // controllers-查询
      desc: 'HMS_Api_Storage_GetControllers',
      method: 'post',
    },
    scanDisks: {
      url: '/node/storage/disks/scan', // disks-scan-查询
      desc: 'HMS_Api_Storage_ScanDisks',
      method: 'post',
    },
    retrieveDisks: {
      url: '/node/storage/disks', // disk-查询
      desc: 'HMS_Api_Storage_RetrieveDisks',
      method: 'post',
    },
    retrieveAvailableDisks: {
      url: '/node/storage/disk/available', // available_disk-查询
      desc: 'HMS_Api_Storage_RetrieveAvailableDisks',
      method: 'post',
    },
    getEnclosure: {
      url: '/node/storage/enclosure/config', // Enclosure-查询
      desc: 'HMS_Api_Storage_GetEnclosure',
      method: 'post',
    },
    setEnclosure: {
      url: '/node/storage/enclosure/config/set', // Enclosure-设置
      desc: 'HMS_Api_Storage_SetEnclosure',
      method: 'post',
    },
    initializeDisk: {
      url: '/node/storage/disks/initialize', // disk-初始化
      desc: 'HMS_Api_Storage_InitializeDisk',
      method: 'post',
    },
    enableSmart: {
      url: '/node/storage/disk/smart', // disk-开启SMART
      desc: 'HMS_Api_Storage_EnableSmart',
      method: 'post',
    },
    hostSpareDelete: {
      url: '/node/storage/raid/hotspare/delete', // hostSpare-删除
      desc: 'HMS_Api_Storage_HostSpareDelete',
      method: 'post',
    },
    addHostSpare: {
      url: '/node/storage/raid/hotspare/create', // hostSpare-创建
      desc: 'HMS_Api_Storage_AddHostSpare',
      method: 'post',
    },
    modifyHostSpare: {
      url: '/node/storage/raid/hotspare/modify', // hostSpare-编辑
      desc: 'HMS_Api_Storage_ModifyHostSpare',
      method: 'post',
    },
  },
  network: {
    getNetworkDevicesInfo: {
      url: '/node/hardware/pcie', // 查询物理设备
      desc: 'HMS_Api_NetWork_GetNetworkDevicesInfo',
      method: 'post',
    },
    getNetworkInformation: {
      url: '/node/network/links', // 网络信息查询
      desc: 'HMS_Api_NetWork_GetNetworkInformation',
      method: 'post',
    },
    networkStatusUp: {
      url: '/node/network/links/status/up', // 网口启用
      desc: 'HMS_Api_NetWork_NetworkStatusUp',
      method: 'post',
    },
    networkStatusDown: {
      url: '/node/network/links/status/down', // 网口停用
      desc: 'HMS_Api_NetWork_NetworkStatusDown',
      method: 'post',
    },
    networkUnbind: {
      url: '/node/network/bonding/unbind', // 解绑
      desc: 'HMS_Api_NetWork_NetworkUnbind',
      method: 'post',
    },
    networkDelete: {
      url: '/node/network/bonding/delete', // 网口删除
      desc: 'HMS_Api_NetWork_NetworkDelete',
      method: 'post',
    },
    networkIpEdit: { // 编辑网口IP & 编辑网口绑定 & 编辑网桥 & 配置IP
      url: '/node/network/ipaddr/edit',
      desc: 'HMS_Api_NetWork_NetworkIpEdit',
      method: 'post',
    },
    networkBondingCreate: {
      url: '/node/network/bonding/create', // 网口绑定
      desc: 'HMS_Api_NetWork_NetworkBondingCreate',
      method: 'post',
    },
    getNetworkRoutesInfo: {
      url: '/node/network/routes/detail', // 路由查询
      desc: 'HMS_Api_NetWork_GetNetworkRoutesInfo',
      method: 'post',
    },
    getNetworkNameserversInfo: {
      url: '/node/network/nameservers', // dns查询
      desc: 'HMS_Api_NetWork_GetNetworkNameserversInfo',
      method: 'post',
    },
    editNetworkNameservers: {
      url: '/node/network/nameservers/edit', // dns设置
      desc: 'HMS_Api_NetWork_EditNetworkNameservers',
      method: 'post',
    },
    bridgeCreate: {
      url: '/node/network/bridge/create', // 添加网桥
      desc: 'HMS_Api_NetWork_BridgeCreate',
      method: 'post',
    },
    bridgeDelete: {
      url: '/node/network/bridge/delete', // 删除网桥
      desc: 'HMS_Api_NetWork_BridgeDelete',
      method: 'post',
    },
    networkInterfaces: {
      url: '/node/network/interfaces', // 查询网口名称（设备）
      desc: 'HMS_Api_NetWork_NetworkInterfaces',
      method: 'post',
    },
    addRouter: {
      url: '/node/network/routes/add', // 添加路由
      desc: 'HMS_Api_NetWork_AddRouter',
      method: 'post',
    },
    editRouter: {
      url: '/node/network/routes/edit', // 修改路由
      desc: 'HMS_Api_NetWork_EditRouter',
      method: 'post',
    },
    deleteRouter: {
      url: '/node/network/routes/delete', // 删除路由
      desc: 'HMS_Api_NetWork_DeleteRouter',
      method: 'post',
    },
  },
  statistics: {
    getOverallCpuStatis: {
      url: '/node/statistical/cpu/overall', // CPU利用率-整体
      desc: 'HMS_Api_Statictics_GetOverallCpuStatis',
      method: 'post',
    },
    getNuclearsCpuStatis: {
      url: '/node/statistical/cpu/nuclears', // CPU利用率-各核
      desc: 'HMS_Api_Statictics_GetNuclearsCpuStatis',
      method: 'post',
    },
    getRamUtilizationStatis: {
      url: '/node/statistical/ram/utilization', // 内存利用率
      desc: 'HMS_Api_Statictics_GetRamUtilizationStatis',
      method: 'post',
    },
    getDiskUtilizationStatis: {
      url: '/node/statistical/disk/utilization', // 存储带宽-磁盘利用率
      desc: 'HMS_Api_Statictics_GetDiskUtilizationStatis',
      method: 'post',
    },
    getDiskReadRate: {
      url: '/node/statistical/disk/read/rate', // 存储带宽-读
      desc: 'HMS_Api_Statictics_GetDiskReadRate',
      method: 'post',
    },
    getDiskWriteRate: {
      url: '/node/statistical/disk/write/rate', // 存储带宽-写
      desc: 'HMS_Api_Statictics_GetDiskWriteRate',
      method: 'post',
    },
    getDiskReadIops: {
      url: '/node/statistical/read/iops', // IOPS-读
      desc: 'HMS_Api_Statictics_GetDiskReadIops',
      method: 'post',
    },
    getDiskWriteIops: {
      url: '/node/statistical/write/iops', // IOPS-写
      desc: 'HMS_Api_Statictics_GetDiskWriteIops',
      method: 'post',
    },
    getNetworkReceivePps: {
      url: '/node/statistical/network/receive/pps', // 网络带宽-收包
      desc: 'HMS_Api_Statictics_GetNetworkReceivePps',
      method: 'post',
    },
    getNetworkTransmitPps: {
      url: '/node/statistical/network/transmit/pps', // 网络带宽-发包
      desc: 'HMS_Api_Statictics_GetNetworkTransmitPps',
      method: 'post',
    },
    getNetworkReceiveRate: {
      url: '/node/statistical/network/receive/rate', // 网络收发包率-收包率
      desc: 'HMS_Api_Statictics_GetNetworkReceiveRate',
      method: 'post',
    },
    getNetworkTransmitRate: {
      url: '/node/statistical/network/transmit/rate', // 网络收发包率-发包率
      desc: 'HMS_Api_Statictics_GetNetworkTransmitRate',
      method: 'post',
    },
  },
};

export const objectResourceApi = {
  configuration: {
    getRgwServiceList: { // 查询集群rgw服务列表
      url: '/object/config/rgw/service/list',
      desc: 'ObjectStorage_Api_Configuration_getRgwServiceList',
      method: 'post',
    },
    createRgwService: { // 创建rgw服务
      url: '/object/config/rgw/service/create',
      desc: 'ObjectStorage_Api_Configuration_createRgwService',
      method: 'post',
    },
    deleteRgwService: { // 删除rgw服务
      url: '/object/config/rgw/service/delete',
      desc: 'ObjectStorage_Api_Configuration_deleteRgwService',
      method: 'post',
    },
    startRgwService: { // 启动rgw服务
      url: '/object/config/rgw/service/start',
      desc: 'ObjectStorage_Api_Configuration_startRgwService',
      method: 'post',
    },
    stopRgwService: { // 停止rgw服务
      url: '/object/config/rgw/service/stop',
      desc: 'ObjectStorage_Api_Configuration_stopRgwService',
      method: 'post',
    },
    getPlacementList: { // 查询集群placement列表
      url: '/object/config/rgw/placement/list',
      desc: 'ObjectStorage_Api_Configuration_getPlacementList',
      method: 'post',
    },
    createPlacement: { // 创建placement
      url: '/object/config/rgw/placement/create',
      desc: 'ObjectStorage_Api_Configuration_createPlacement',
      method: 'post',
    },
    deletePlacement: { // 删除placement
      url: '/object/config/rgw/placement/delete',
      desc: 'ObjectStorage_Api_Configuration_deletePlacement',
      method: 'post',
    },
    modifyPlacement: { // 修改placement
      url: '/object/config/rgw/placement/modify',
      desc: 'ObjectStorage_Api_Configuration_modifyPlacement',
      method: 'post',
    },
    getGcRate: { // 查询垃圾回收速率
      url: '/object/config/rgw/gc/get',
      desc: 'ObjectStorage_Api_Configuration_getGcRate',
      method: 'post',
    },
    setGcRate: { // 设置垃圾回收速率
      url: '/object/config/rgw/gc/set',
      desc: 'ObjectStorage_Api_Configuration_setGcRate',
      method: 'post',
    },
    getShardSize: { // 查询分片大小
      url: '/object/config/rgw/shard/get',
      desc: 'ObjectStorage_Api_Configuration_getShardSize',
      method: 'post',
    },
    setShardSize: { // 设置分片大小
      url: '/object/config/rgw/shard/set',
      desc: 'ObjectStorage_Api_Configuration_setShardSize',
      method: 'post',
    },
  },
  user: {
    getUserList: {
      url: '/object/user/list',
      desc: 'ObjectStorage_Api_User_GetUserList',
      method: 'post',
    },
    createUser: {
      url: '/object/user/create',
      desc: 'ObjectStorage_Api_User_createUser',
      method: 'post',
    },
    deleteUser: {
      url: '/object/user/delete',
      desc: 'ObjectStorage_Api_User_deleteUser',
      method: 'post',
    },
    getUserDetail: {
      url: '/object/user/detail',
      desc: 'ObjectStorage_Api_User_GetUserDetail',
      method: 'post',
    },
    modifyUserEmail: {
      url: '/object/user/email/modify',
      desc: 'ObjectStorage_Api_User_modifyUserEmail',
      method: 'post',
    },
    disableUser: {
      url: '/object/user/disable',
      desc: 'ObjectStorage_Api_User_disableUser',
      method: 'post',
    },
    enableUser: {
      url: '/object/user/enable',
      desc: 'ObjectStorage_Api_User_enableUser',
      method: 'post',
    },
  },
  bucket: {
    listBuckets: {
      url: '/object/bucket/list',
      method: 'post',
      desc: 'ObjectStorage_Api_Bucket_listBuckets',
    },
    getBucketDetails: {
      url: '/object/bucket/details',
      method: 'post',
      desc: 'ObjectStorage_Api_Bucket_getBucketDetails',
    },
    setBucketInfo: {
      url: '/object/bucket/info/set',
      method: 'post',
      desc: 'ObjectStorage_Api_Bucket_getBucketInfo',
    },
    getBucketInfo: {
      url: '/object/bucket/info/get',
      method: 'post',
      desc: 'ObjectStorage_Api_Bucket_getBucketInfo',
    },
    newBucket: {
      url: '/object/bucket/new',
      method: 'post',
      desc: 'ObjectStorage_Api_Bucket_newBucket',
    },
    deleteBucket: {
      url: '/object/bucket/delete',
      method: 'post',
      desc: 'ObjectStorage_Api_Bucket_deleteBucket',
    },
    getBucketAcl: {
      url: '/object/bucket/acl/get',
      method: 'post',
      desc: 'ObjectStorage_Api_Bucket_getBucketAcl',
    },
    getBucketLifecycle: {
      url: '/object/bucket/lifecycle/get',
      method: 'post',
      desc: 'ObjectStorage_Api_Bucket_getBucketLifecycle',
    },
    deleteBucketLifecycle: {
      url: '/object/bucket/lifecycle/delete',
      method: 'post',
      desc: 'ObjectStorage_Api_Bucket_deleteBucketLifecycle',
    },
    setBucketLifecycle: {
      url: '/object/bucket/lifecycle/set',
      method: 'post',
      desc: 'ObjectStorage_Api_Bucket_setBucketLifecycle',
    },
  },
  audit: {
    getAuditlogList: {
      url: '/object/auditlog/list',
      desc: 'ObjectStorage_Api_Audit_getAuditlogList',
      method: 'post',
    },
    auditlogDownload: {
      url: '/object/auditlog/download',
      desc: 'ObjectStorage_Api_Audit_auditlogDownload',
      method: 'post',
    },
    clearLogs: {
      url: '/object/auditlog/clearLogsFile',
      desc: 'ObjectStorage_Api_Audit_clearLogsFile',
      method: 'post',
    },
  },
  statistics: {
    userCountData: { // 对象存储单个用户数据统计
      url: '/object/statistics/user/info',
      desc: 'ObjectStorage_Api_Statistics_userCountData',
      method: 'post',
    },
    usersCountData: { // 对象存储单个所有用户数据统计
      url: '/object/statistics/user/info/all',
      desc: 'ObjectStorage_Api_Statistics_usersCountData',
      method: 'post',
    },
    bucketCountData: { // 单个桶
      url: '/object/statistics/bucket/info',
      desc: 'ObjectStorage_Api_Statistics_bucketCountData',
      method: 'post',
    },
    bucketsCountData: { // 所有桶
      url: '/object/statistics/bucket/info/all',
      desc: 'ObjectStorage_Api_Statistics_bucketsCountData',
      method: 'post',
    },
    clusterCountData: { // 集群统计
      url: '/object/statistics/cluster/info',
      desc: 'ObjectStorage_Api_Statistics_userCountData',
      method: 'post',
    },
  },
  object: {
    putObjectUpload: {
      url: '/object/object/upload',
      method: 'post',
      desc: 'ObjectStorage_Api_Object_uploadObject',
      paramType: 'query', // 传参形式是query string
      bodyType: 'form-data', // body需要传递二进制数据
    },
    initFragmentUpload: {
      url: '/object/object/uploads/init',
      method: 'post',
      desc: 'ObjectStorage_Api_Object_initFragmentUpload',
    },
    listFragmentUpload: {
      url: '/object/object/uploads/list',
      method: 'post',
      desc: 'ObjectStorage_Api_Object_listFragmentUpload',
    },
    termFragmentUpload: {
      url: '/object/object/uploads/term',
      method: 'post',
      desc: 'ObjectStorage_Api_Object_termFragmentUpload',
    },
    completeFragmentUpload: {
      url: '/object/object/uploads/complete',
      method: 'post',
      desc: 'ObjectStorage_Api_Object_completeFragmentUpload',
    },
    putFragmentUpload: {
      url: '/object/object/uploads/put',
      method: 'post',
      desc: 'ObjectStorage_Api_Object_putFragmentUpload',
      paramType: 'query', // 传参形式是query string
      bodyType: 'form-data', // body需要传递二进制数据
    },
    listBucketFragment: {
      url: '/object/bucket/uploads/list',
      method: 'post',
      desc: 'ObjectStorage_Api_Object_listBucketFragment',
    },
  },
  NFS: {
    createNfsService: { // 创建rgw-NFS服务
      url: '/object/nfs/service/create',
      method: 'post',
      desc: 'ObjectStorage_Api_Nfs_createNfsService',
    },
    deleteNfsService: { // 删除rgw-NFS服务
      url: '/object/nfs/service/delete',
      method: 'post',
      desc: 'ObjectStorage_Api_Nfs_deleteNfsService',
    },
    startNfsService: { // 启动rgw-NFS服务
      url: '/object/nfs/service/start',
      method: 'post',
      desc: 'ObjectStorage_Api_Nfs_startNfsService',
    },
    stopNfsService: { // 停止rgw-NFS服务
      url: '/object/nfs/service/stop',
      method: 'post',
      desc: 'ObjectStorage_Api_Nfs_stopNfsService',
    },
    getNfsServiceList: { // 查询rgw-NFS服务
      url: '/object/nfs/service/list',
      method: 'post',
      desc: 'ObjectStorage_Api_Nfs_getNfsServiceList',
    },
  },
};

export const hyhiveApi = {

};

export const infinityApi = {
  public: {
    login: {
      url: '/infinity/login',
      method: 'post',
      desc: 'Infintiy_Api_Public_login',
    },
  },
};
