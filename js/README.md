# UTM Link Manager - 模块化结构

代码已重构为模块化结构，便于维护和扩展。

## 模块说明

### `config.js` - 全局状态管理
- 管理应用的全局状态（links, selectedIndices, token 状态等）
- 提供状态同步机制，保持向后兼容

### `encryption.js` - 加密功能
- 加密/解密函数
- 密码管理
- 加密状态检查

### `utils.js` - 工具函数
- SweetAlert2 帮助函数
- 字符串处理（escapeHtml）
- 文件下载（CSV, JSON）
- CSV 解析
- 其他工具函数

## 使用方式

所有模块通过 `window` 对象导出，可以通过以下方式访问：

```javascript
// 状态管理
const links = window.appState.getLinks();
window.appState.addLinks(newLinks);

// 加密
const encrypted = await window.encryption.encryptData(data, password);

// 工具
window.utils.showSuccess('Message');
```

## 向后兼容

为了保持现有代码正常工作，模块同时导出到全局变量：

```javascript
// 以下都可以使用（向后兼容）
let links = appState.getLinks(); // 推荐
let links = window.links; // 兼容旧代码
```

## 未来扩展

可以继续将以下功能模块化：
- `storage.js` - localStorage 操作
- `form.js` - 表单处理
- `table.js` - 表格渲染和更新
- `bitly.js` - Bitly 集成

