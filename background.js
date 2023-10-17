chrome.commands.onCommand.addListener(function(command) {
    if (command === "enable-all") {
        // 启用所有插件的代码
        chrome.runtime.sendMessage({action: "enableOrDisableAll", enable: true});
    } else if (command === "disable-all") {
        // 禁用所有插件的代码
        chrome.runtime.sendMessage({action: "enableOrDisableAll", enable: false});
    }
});
