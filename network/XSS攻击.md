# XSS 攻击

## 什么是 XSS 攻击

XSS（Cross-Site Scripting）攻击是一种常见的网络安全漏洞，攻击者通过在网页中注入恶意脚本代码，使得用户在访问该网页时执行这些脚本，从而窃取用户信息、劫持会话或进行其他恶意操作。

## XSS 攻击的原理

XSS 攻击的原理是利用网页的输入输出机制，将恶意脚本代码注入到网页中。当用户访问该网页时，浏览器会执行这些脚本，从而导致安全问题。

比如论坛中的评论功能，用户可以在评论中输入 HTML 代码，但是如果没有对用户输入进行过滤，就会导致 XSS 攻击。攻击者可以在评论中输入 `<script>alert('XSS');</script>`，当用户访问该评论时，浏览器会执行该脚本，从而弹出提示框。

## XSS 攻击的类型

1. **存储型 XSS**：攻击者将恶意脚本存储在服务器上，当用户访问该页面时，脚本被加载并执行。
2. **反射型 XSS**：攻击者将恶意脚本作为 URL 参数传递给网页，当用户点击该链接时，脚本被加载并执行。
3. **DOM 型 XSS**：攻击者通过修改网页的 DOM 结构，将恶意脚本注入到网页中。当用户访问该网页时，脚本被加载并执行。
4. **基于事件的 XSS**：攻击者通过监听用户的某些事件（如点击、输入等），触发恶意脚本的执行。

## XSS 攻击的防范措施

1. **输入过滤**：对用户输入进行严格的过滤和验证，禁止输入 HTML、JavaScript 等脚本代码。
2. **输出编码**：对输出到网页的内容进行编码，避免浏览器将其解释为脚本代码。
3. **使用 CSP（Content Security Policy）**：通过设置 CSP 头部，限制网页可以加载的资源类型和来源，从而降低 XSS 攻击的风险。
4. **使用 HTTPOnly 和 Secure Cookie**：设置 Cookie 的 HTTPOnly 和 Secure 属性，防止脚本访问 Cookie。

```js
// 示例代码
const userInput = "<script>alert('XSS');</script>";
const safeOutput = userInput.replace(/</g, "&lt;").replace(/>/g, "&gt;");
document.getElementById("output").innerHTML = safeOutput; // 输出安全的内容
```
