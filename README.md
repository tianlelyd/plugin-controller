# Plugin Controller | Chrome Extension Manager

![Extension Icon](icon128.png)

## Brief Introduction

**Plugin Controller** is a powerful browser extension manager designed to help users efficiently manage their browser extensions. With a user-friendly interface, this extension offers one-click disable/enable for all extensions, grouping extensions for batch operations, quickly enabling or disabling individual extensions, and provides keyboard shortcuts to further speed up operations.

## Why did I develop this extension?

In our daily use of browsers, we often find ourselves installing various extensions to accomplish specific tasks or functions. However, as the number of extensions increases, managing and controlling them becomes more and more cumbersome. Even when we are not currently using these extensions, they still run in the background, continuously consuming resources, and may conflict, causing some inexplicable problems. This is the motivation for developing this extension.

Here are some problems I often face:

1. **Conflict Issues**: As the number of installed extensions increases, they may conflict with each other, and some plugins may also conflict with certain websites. These conflicts can lead to page loading errors or unexpected behavior.
   
2. **Performance Issues**: Many extensions are set to be active on all websites by default. This means that when we visit a website, in addition to the site's own requests, there are a large number of requests from these extensions. This not only slows down page loading but may also consume a lot of system resources, making the browser and even the entire system sluggish.

3. **Management Inconvenience**: Chrome's default extension list does not offer quick enable or disable functions. Sometimes when facing conflict issues that need quick troubleshooting, we have to go to the "Manage Extensions" detailed settings page each time and disable/enable plugins one by one for step-by-step troubleshooting, which is very cumbersome and extremely inefficient.

## Core Features

1. **One-click Operation**: We offer a one-click function to enable/disable all extensions for quick troubleshooting.

2. **Batch Operation**: We can group extensions and perform batch operations according to different usage scenarios, such as enabling all work-related plugins during work, enabling all study-related plugins during study, or putting some rarely used plugins into a group and opening them in batches when needed.

3. **Shortcut Operation**: We offer a drop-down list similar to extension management and provide corresponding operations, allowing quick enable/disable of individual extensions.

4. **Shortcut Key Support**: For the operation of one-click enable/disable all extensions, we provide a shortcut key for more convenient and quick use.

![Extension Interface](https://cdn.jsdelivr.net/gh/tianlelyd/cdn/images/202310191951369.png)

## How to Use

1. **Add Group**: Enter the required group name in the group input box, then press the Enter key or click the "Add Group" button to add a group.

2. **Delete Group**: Click to select a group, click the red cross "x" behind the group name to delete the group.

2. **Assign Extensions to Groups**: There is a drop-down menu next to each extension, where you can assign the extension to a specific group.

3. **Batch Operation**: Click to select a group, click the "Enable Group / Disable Group" button to perform batch operations on the extensions in the selected group.

4. **Enable/Disable All**: Click the "Enable All / Disable All" button to quickly disable or enable all extensions.

4. **Keyboard Shortcuts**: We support using the shortcut "Ctrl+Shift+X" by default to enable all extensions and "Ctrl+Shift+Z" to disable all extensions. If there is a conflict or you want to customize the keyboard shortcut, you can copy "chrome://extensions/shortcuts" and paste it into the address bar, then press Enter, find the "Plugin Controller" plugin, and customize it.

![Customize Keyboard Shortcuts](https://cdn.jsdelivr.net/gh/tianlelyd/cdn/images/202310192010676.png)

## Installation

1. Click to download and install the extension from the store.
2. Follow the instructions on the screen to add it to your browser.
3. Click the extension icon to open the manager and start organizing your extensions!

## Feedback and Support

If you have any feedback or need support, please post Issues.

## License

This extension is licensed under the MIT license. For more details, please see [LICENSE](LICENSE).

