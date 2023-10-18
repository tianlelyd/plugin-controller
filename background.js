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

// 启用或禁用所有插件。
function enableOrDisableAll(enable) {
  chrome.management.getAll(function (extensions) {
    extensions.forEach((extension) => {
      // 不要启用或禁用自身。
      if (extension.id !== chrome.runtime.id)
        chrome.management.setEnabled(extension.id, enable,function() {
            if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError.message);
            } 
        });
    });
  });
}
