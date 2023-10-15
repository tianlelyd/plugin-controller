// 当文档加载完成时，执行以下代码
document.addEventListener("DOMContentLoaded", function () {
  // 获取所有插件
  chrome.management.getAll(function (extensions) {
    const list = document.getElementById("extensions-list");
    // 为每个插件创建列表项
    extensions.forEach((extension) => {
      const listItem = document.createElement("li");

      // 如果插件有图标，显示其最小尺寸的图标
      if (extension.icons && extension.icons.length) {
        const iconURL = extension.icons[0].url;
        const iconImg = document.createElement("img");
        iconImg.src = iconURL;
        iconImg.alt = extension.name + " icon";
        iconImg.style.width = "16px"; // 设置图标的宽度
        iconImg.style.height = "16px"; // 设置图标的高度
        iconImg.style.marginRight = "5px"; // 添加右边距
        listItem.appendChild(iconImg);
      }

      // 创建一个 <span> 元素来显示插件的名称
      const nameSpan = document.createElement("span");
      nameSpan.style.width = "150px"; // 设置固定的宽度
      nameSpan.textContent = extension.name;
      listItem.appendChild(nameSpan);

      //listItem.textContent = extension.name;

      // 创建启用/禁用按钮
      const toggleButton = document.createElement("button");
      updateToggleButton(toggleButton, extension);

      toggleButton.onclick = function () {
        chrome.management.setEnabled(
          extension.id,
          !extension.enabled,
          function () {
            // 在setEnabled的回调中再次获取扩展的信息
            chrome.management.get(extension.id, function (updatedExtension) {
              extension.enabled = updatedExtension.enabled; // 更新extension的状态
              updateToggleButton(toggleButton, updatedExtension);
            });
          }
        );
      };

      // 更新按钮文本的函数
      function updateToggleButton(button, ext) {
        button.textContent = ext.enabled ? "Disable" : "Enable";
      }

      listItem.appendChild(toggleButton);

      // 创建分组选择下拉列表
      const groupDropdown = document.createElement("select");
      groupDropdown.classList.add("extension-group-selector");
      groupDropdown.dataset.extensionId = extension.id; // 为每个下拉列表添加一个自定义属性，用于更新所有下拉列表
      // 添加默认分组选项
      const defaultOption = document.createElement("option");
      defaultOption.textContent = "default";
      groupDropdown.appendChild(defaultOption);
      // ... 添加其他分组选项
      groupDropdown.value = getGroup(extension.id); // 设置当前插件的分组
      groupDropdown.onchange = function () {
        setGroup(extension.id, groupDropdown.value);
      };
      listItem.appendChild(groupDropdown);

      list.appendChild(listItem);
    });

    // 更新分组选择器
    updateGroupSelector();

    // 更新所有插件分组选择器
    updateAllGroupSelectors();
  });

  // 按分组批量启用插件
  document.getElementById("enableGroup").onclick = function () {
    const selectedGroupItem = document.querySelector(
      "#groups-list li.selected"
    );
    if (selectedGroupItem) {
      const groupName = selectedGroupItem.textContent;
      enableOrDisableGroup(groupName, true);
    } else {
      alert("Please select a group first.");
    }
  };

  // 按分组批量禁用插件
  document.getElementById("disableGroup").onclick = function () {
    const selectedGroupItem = document.querySelector(
      "#groups-list li.selected"
    );
    if (selectedGroupItem) {
      const groupName = selectedGroupItem.textContent;
      enableOrDisableGroup(groupName, false);
    } else {
      alert("Please select a group first.");
    }
  };
});

// 获取插件的分组
function getGroup(extensionId) {
  return localStorage.getItem(extensionId) || "default";
}

// 设置插件的分组
function setGroup(extensionId, groupName) {
  localStorage.setItem(extensionId, groupName);
}

// 更新分组选择器
function updateGroupSelector() {
  // 获取所有存储的分组
  const groups = new Set(Object.values(localStorage));

  // 获取所有分组选择器
  const groupsList = document.getElementById("groups-list");
  groupsList.innerHTML = ""; // 清空列表
  groups.forEach((group) => {
    const listItem = document.createElement("li");
    listItem.textContent = group;
    listItem.onclick = function () {
      // 如果已经选中，则取消选中
      if (listItem.classList.contains("selected")) {
        listItem.classList.remove("selected");
      } else {
        // 否则，取消其他分组的选中状态，并选中当前分组
        const allGroups = groupsList.querySelectorAll("li");
        allGroups.forEach((item) => item.classList.remove("selected"));
        listItem.classList.add("selected");
      }
    };
    groupsList.appendChild(listItem);
  });
}

// 按分组启用或禁用插件
function enableOrDisableGroup(groupName, enable) {
  chrome.management.getAll(function (extensions) {
    extensions.forEach((extension) => {
      if (getGroup(extension.id) === groupName) {
        chrome.management.setEnabled(extension.id, enable);
      }
    });
  });
}

// 启用所有插件
document.getElementById("enableAll").onclick = function () {
  chrome.management.getAll(function (extensions) {
    extensions.forEach((extension) => {
      chrome.management.setEnabled(extension.id, true);
    });
  });
};

// 禁用所有插件
document.getElementById("disableAll").onclick = function () {
  chrome.management.getAll(function (extensions) {
    extensions.forEach((extension) => {
      chrome.management.setEnabled(extension.id, false);
    });
  });
};

document.getElementById("addGroup").onclick = function () {
  const newGroupName = document.getElementById("newGroup").value.trim();
  if (newGroupName) {
    addGroup(newGroupName);
    document.getElementById("newGroup").value = ""; // 清空输入框
    updateAllGroupSelectors(); // 更新分组列表
  }
};

function addGroup(groupName) {
  // 将新分组添加到localStorage
  localStorage.setItem(`group_${groupName}`, groupName);

  // 更新分组选择器
  updateGroupSelector();

  // 更新所有分组选择器
  updateAllGroupSelectors();
}

function updateAllGroupSelectors() {
  const allGroupSelectors = document.querySelectorAll(
    ".extension-group-selector"
  );
  allGroupSelectors.forEach((selector) => {
    // 获取当前插件的ID
    const extensionId = selector.dataset.extensionId;
    // 获取当前插件的分组
    const currentGroup = getGroup(extensionId);

    // 清空下拉列表
    selector.innerHTML = "";

    // 添加 "default" 选项
    const defaultOption = document.createElement("option");
    defaultOption.textContent = "default";
    defaultOption.value = "default";
    selector.appendChild(defaultOption);

    // 获取所有存储的分组
    const groups = new Set(Object.values(localStorage));
    groups.forEach((group) => {
      const option = document.createElement("option");
      option.textContent = group;
      option.value = group;
      selector.appendChild(option);
    });

    // 设置默认选中的选项
    selector.value = currentGroup;
  });
}
