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
 */
function enableOrDisableAll(enable) {
  chrome.management.getAll(function (extensions) {
    extensions.forEach((extension) => {
      // 不要启用或禁用自身。
      if (extension.id !== chrome.runtime.id)
        chrome.management.setEnabled(extension.id, enable, function () {
          if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError.message);
          }
        });
    });
  });
}
