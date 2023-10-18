importScripts('extensionUtils.js');//引入扩展工具类

// 监听并响应commands中设置的快捷键。
chrome.commands.onCommand.addListener(function (command) {
  if (command === "enable-all") {
    // 启用所有插件的代码
    //chrome.runtime.sendMessage({action: "enableOrDisableAll", enable: true});
    enableOrDisableAll(true);
  } else if (command === "disable-all") {
    // 禁用所有插件的代码
    // chrome.runtime.sendMessage({action: "enableOrDisableAll", enable: false});
    enableOrDisableAll(false);
  }
});