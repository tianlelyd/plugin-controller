/**
 * extensionUtils.js
 * 
 * Chrome 扩展管理器的实用功能集合。
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

// 获取插件自身的ID
const currentExtensionId = chrome.runtime.id;

// 当文档加载完毕后，初始化插件列表和设置批量操作。
document.addEventListener("DOMContentLoaded", function () {
  initializeExtensions();
  setupBulkActions();
});

// 获取并初始化所有插件的列表。
function initializeExtensions() {
  chrome.management.getAll((extensions) => {
    const list = document.getElementById("extensions-list");
    extensions.forEach((extension) => {
      if (extension.id === currentExtensionId) return;
      list.appendChild(createExtensionListItem(extension));
    });
    updateGroupSelector();
    updateAllGroupSelectors();
  });
}

// 为每个插件创建一个列表项。
function createExtensionListItem(extension) {
  const listItem = document.createElement("li");

  // 如果插件有图标，添加图标到列表项。
  if (extension.icons && extension.icons.length) {
    const iconImg = document.createElement("img");
    Object.assign(iconImg.style, {
      width: "16px",
      height: "16px",
      marginRight: "5px",
    });
    iconImg.src = extension.icons[0].url;
    iconImg.alt = `${extension.name} icon`;
    listItem.appendChild(iconImg);
  }

  // 添加插件的名字到列表项。
  const nameSpan = document.createElement("span");
  nameSpan.style.width = "150px";
  nameSpan.textContent = extension.name;
  listItem.appendChild(nameSpan);

  // 添加启用/禁用按钮到列表项。
  const toggleButton = createToggleButton(extension);
  listItem.appendChild(toggleButton);

  // 添加分组下拉列表到列表项。
  const groupDropdown = createGroupDropdown(extension);
  listItem.appendChild(groupDropdown);

  return listItem;
}

// 创建启用/禁用按钮。
function createToggleButton(extension) {
  const button = document.createElement("button");
  updateToggleButton(button, extension);

  button.onclick = function () {
    toggleExtension(button, extension);
  };

  return button;
}

// 切换插件的启用/禁用状态。
function toggleExtension(button, extension) {
  chrome.management.setEnabled(extension.id, !extension.enabled, function () {
    chrome.management.get(extension.id, function (updatedExtension) {
      extension.enabled = updatedExtension.enabled;
      updateToggleButton(button, updatedExtension);
    });
  });
}

// 更新启用/禁用按钮的文本。
function updateToggleButton(button, ext) {
  button.textContent = ext.enabled ? "Disable" : "Enable";
}

// 创建分组选择的下拉列表。
function createGroupDropdown(extension) {
  const dropdown = document.createElement("select");
  dropdown.classList.add("extension-group-selector");
  dropdown.dataset.extensionId = extension.id;

  dropdown.value = getGroup(extension.id);
  dropdown.onchange = function () {
    setGroup(extension.id, dropdown.value);
  };

  return dropdown;
}

// 从localStorage中获取插件的分组。
function getGroup(extensionId) {
  return localStorage.getItem(extensionId) || "default";
}

// 将插件的分组设置到localStorage中。
function setGroup(extensionId, groupName) {
  // 如果分组名为"default"，则从localStorage中删除插件的分组。
  if (groupName === "default") {
    localStorage.removeItem(extensionId);
  } else {
    localStorage.setItem(extensionId, groupName);
  }
}

// 更新插件分组列表的分组选择器。
function updateGroupSelector() {
  const groups = new Set(Object.values(localStorage));
  const groupsList = document.getElementById("groups-list");
  groupsList.innerHTML = "";

  groups.forEach((group) => {
    const listItem = document.createElement("li");
    listItem.textContent = group;
    listItem.onclick = toggleGroupSelection;

    const deleteButton = document.createElement("span");
    deleteButton.classList.add("delete-group");
    deleteButton.textContent = "×";
    // 点击叉叉图标删除分组并阻止事件冒泡。
    deleteButton.onclick = function (event) {
      event.stopPropagation();
      deleteGroup(group);
      // 从DOM中移除分组
      event.target.parentElement.remove();
    };

    listItem.appendChild(deleteButton);
    groupsList.appendChild(listItem);
  });
}

// 删除分组。
function deleteGroup(groupName) {
  localStorage.removeItem(`group_${groupName}`);
  // 删除分组后，将原使用该分组的插件从localStorage中删除。
  chrome.management.getAll(function (extensions) {
    extensions.forEach((extension) => {
      if (getGroup(extension.id) === groupName) {
        localStorage.removeItem(extension.id);
      }
    });
    // 更新所有插件的分组选择器。
    updateAllGroupSelectors();
  });
}

// 切换分组的选择状态。
function toggleGroupSelection(event) {
  const listItem = event.target;
  if (listItem.classList.contains("selected")) {
    listItem.classList.remove("selected");
  } else {
    document
      .querySelectorAll("#groups-list li")
      .forEach((item) => item.classList.remove("selected"));
    listItem.classList.add("selected");
  }
}

// 根据分组名启用或禁用一组插件。
function enableOrDisableGroup(groupName, enable) {
  chrome.management.getAll(function (extensions) {
    extensions.forEach((extension) => {
      if (
        getGroup(extension.id) === groupName &&
        extension.id !== currentExtensionId
      ) {
        chrome.management.setEnabled(extension.id, enable);
      }
    });
  });
}

// 设置批量启用、禁用、添加分组的操作。
function setupBulkActions() {
  // 启用所有插件。
  document.getElementById("enableAll").onclick = function () {
    enableOrDisableAll(true);
  };
  // 禁用所有插件。
  document.getElementById("disableAll").onclick = function () {
    enableOrDisableAll(false);
  };
  // 启用已选择的分组。
  document.getElementById("enableGroup").onclick = function () {
    enableOrDisableSelectedGroup(true);
  };
  // 禁用已选择的分组。
  document.getElementById("disableGroup").onclick = function () {
    enableOrDisableSelectedGroup(false);
  };
  // 添加新的分组。
  document.getElementById("addGroup").onclick = function () {
    addNewGroup();
  };

  // 当鼠标悬停在分组列表上时，显示叉叉图标。点击叉叉图标删除分组。
  document.addEventListener("click", function (event) {
    if (event.target.tagName === "LI") {
      // 隐藏所有叉叉图标
      const allDeleteIcons = document.querySelectorAll(".delete-group");
      allDeleteIcons.forEach((icon) => (icon.style.display = "none"));
      // 显示叉叉图标
      const deleteIcon = event.target.querySelector(".delete-group");
      deleteIcon.style.display = "inline";
    }
  });
}

// 启用或禁用已选择的分组。
function enableOrDisableSelectedGroup(enable) {
  const selectedGroupItem = document.querySelector("#groups-list li.selected");
  if (selectedGroupItem) {
    // 由于分组li内部有一个叉叉图标，而分组名称不能包含叉叉。因此，分组名称是li的textContent去除叉叉图标后的内容。
    const groupName = Array.from(selectedGroupItem.childNodes).filter(node => node.nodeType === 3).map(textNode => textNode.textContent.trim()).join("");
    enableOrDisableGroup(groupName, enable);
  } else {
    alert("Please select a group first.");
  }
}

// 添加新的分组。
function addNewGroup() {
  const newGroupName = document.getElementById("newGroup").value.trim();
  if (newGroupName) {
    localStorage.setItem(`group_${newGroupName}`, newGroupName);
    document.getElementById("newGroup").value = "";
    updateGroupSelector();
    updateAllGroupSelectors();
  }
}

// 更新所有插件的分组选择器。
function updateAllGroupSelectors() {
  const allGroupSelectors = document.querySelectorAll(
    ".extension-group-selector"
  );
  allGroupSelectors.forEach(updateGroupSelectorForDropdown);
}

// 更新单个插件的分组选择器。
function updateGroupSelectorForDropdown(selector) {
  const extensionId = selector.dataset.extensionId;
  const currentGroup = getGroup(extensionId);
  selector.innerHTML = "";

  const defaultOption = document.createElement("option");
  defaultOption.textContent = "default";
  defaultOption.value = "default";
  selector.appendChild(defaultOption);

  const groups = new Set(Object.values(localStorage));
  groups.forEach((group) => {
    const option = document.createElement("option");
    option.textContent = group;
    option.value = group;
    selector.appendChild(option);
  });

  selector.value = currentGroup;
}
