/**
 * extensionUtils.js
 *
 * Chrome 扩展管理器的工具函数库。
 *
 * 本文件包含一套实用功能，用于协助管理 Chrome 扩展的管理器。功能描述如下：
 * - 一键启用/禁用所有扩展。
 * - 使用快捷键快速启用/禁用扩展。
 * - 根据分组批量启用/禁用扩展。
 * - 对单个扩展进行启用/禁用操作。
 *
 * 作者: Liyd
 * 创建日期: 2023-10-18
 *
 * 依赖项:
 * - 假设在运行环境中有Chrome API可用。
 * - 需要相应函数中提及的DOM元素。
 *
 * 注意:
 * 由于此扩展与 Chrome 扩展API 以及扩展的 HTML 结构紧密相关，确保随时更新以与最新的 API 或结构保持同步。
 */

/**
 * 启用或禁用所有扩展。
 *
 * @param {boolean} enable - true 启用所有扩展，false 禁用所有扩展。
 * @param {function} callback - 回调函数。
 */
function enableOrDisableAll(enable, callback) {
  chrome.management.getAll(function (extensions) {
    // 计算需要处理的扩展数量（不包括自身）
    const totalExtensions = extensions.filter(extension => extension.id !== chrome.runtime.id).length;

    // 如果没有扩展需要处理，直接调用回调函数
    if (totalExtensions === 0) {
      if (callback) {
        callback();
      }
      return;
    }

    let processedExtensions = 0;

    extensions.forEach((extension) => {
      if (extension.id !== chrome.runtime.id) {
        chrome.management.setEnabled(extension.id, enable, function() {
          if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError.message);
          }

          processedExtensions++;

          // 当所有扩展都已处理，调用回调函数
          if (processedExtensions === totalExtensions && callback) {
            callback();
          }
        });
      }
    });
  });
}


/**
 * 从localStorage中获取插件的分组。
 *
 * @param {*} extensionId
 * @returns
 */
function getGroup(extensionId) {
  return localStorage.getItem(extensionId) || "default";
}

/**
 * 将插件的分组设置到localStorage中。
 *
 * @param {*} extensionId
 * @param {*} groupName
 */
function setGroup(extensionId, groupName) {
  // 如果分组名为"default"，则从localStorage中删除插件的分组。
  if (groupName === "default") {
    localStorage.removeItem(extensionId);
  } else {
    localStorage.setItem(extensionId, groupName);
  }
}

/**
 * 根据分组名启用或禁用一组插件。
 *
 * @param {string} groupName - 分组名。
 * @param {boolean} enable - true 启用插件，false 禁用插件。
 * @param {function} callback - 回调函数。
 */
function enableOrDisableGroup(groupName, enable, callback) {
  chrome.management.getAll(function (extensions) {
    // 计算需要处理的扩展数量
    const totalExtensions = extensions.filter(extension => getGroup(extension.id) === groupName && extension.id !== chrome.runtime.id).length;

    // 如果没有扩展需要处理，直接调用回调函数
    if (totalExtensions === 0) {
      if (callback) {
        callback();
      }
      return;
    }

    let processedExtensions = 0;

    extensions.forEach((extension) => {
      if (getGroup(extension.id) === groupName && extension.id !== chrome.runtime.id) {
        chrome.management.setEnabled(extension.id, enable, function() {
          processedExtensions++;

          // 当所有扩展都已处理，调用回调函数
          if (processedExtensions === totalExtensions && callback) {
            callback();
          }
        });
      }
    });
  });
}
