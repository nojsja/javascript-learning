// 事件处理函数
window.EventUtil = {

        // 添加事件处理
        addHandler: function (element, type, handler, arges) {
            if(element.addEventListener){
                element.addEventListener(type, handler, false);

            }else if(element.attachEvent){
                element.attachEvent('on' + type, handler);

            }else {
                element['on' + type] = handler;
            }
        },

        // 移除事件处理
        removeHandler: function (element, type, handler, arges) {
            if(element.removeEventListener){
                element.removeEventListener(type, handler, false);

            }else if(element.detachEvent){
                element.detachEvent('on' + type, handler);

            }else {
                element['on' + type] = null;
            }
        },

        // 获取事件对象
        getEvent: function (event) {

            return event ? event : window.event;
        },

        // 获取事件目标
        getTarget: function (event) {
            return event.target || event.srcElement;
        },

        // 阻止默认行为
        preventDefault: function (event) {
            if(event.preventDefault){
                event.preventDefault();
            }else {
                event.returnValue = false;
            }
        },

        // 阻止事件冒泡
        stopPropagation: function (event) {

            if(event.stopPropagation){
                event.stopPropagation();
            }else {
                event.cancelBubble = false;
            }
        }

};
