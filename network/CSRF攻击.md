# CSRF 攻击

## 什么是 CSRF 攻击

CSRF（Cross-Site Request Forgery）攻击，也称为跨站请求伪造，是一种恶意攻击方式，攻击者利用用户的身份认证信息，在用户不知情的情况下，向受信任的网站发送未经授权的请求。

这种攻击通常发生在用户已经登录某个网站时，攻击者诱导用户点击一个链接或加载一个图片等，从而触发对受信任网站的请求。

## CSRF 攻击的原理

CSRF 攻击的原理是利用用户的身份认证信息（如 Cookie）来伪造请求。攻击者通过以下步骤进行 CSRF 攻击：

1. 用户登录受信任的网站，浏览器保存了用户的身份认证信息（如 Cookie）。
2. 攻击者诱导用户访问一个恶意网站，该网站包含了指向受信任网站的请求。
3. 浏览器在发送请求时，会自动携带用户的身份认证信息（如 Cookie）。
4. 受信任的网站接收到请求后，认为这是用户的正常操作，从而执行了攻击者的恶意请求。

使用 JS 发送请求虽然会触发跨域，但是图片请求，form 请求都可以携带 cookie，因此可以用来发送 CSRF 攻击。

```js
// 示例代码

// 受信任的网站
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// 恶意网站 利用img元素发送get请求。
// 请求会自动携带http://bank.com下用户的身份认证信息（如 Cookie）。
<img
  src="http://bank.com/transfer?amount=1000&to=attacker"
  style="display:none"
/>;

// 或者使用form 发送post  put等请求
<form
  id="formEle"
  style="display:none"
  action="http://bank.com/transfer"
  method="post"
>
  <input type="hidden" name="amount" value="1000" />
  <input type="hidden" name="to" value="attacker" />
  <button type="submit">Transfer</button>
</form>;
formEle.submit();
```

## 如何防止 CSRF 攻击

1. **SameSite Cookie**：在服务器端设置 SameSite Cookie 属性，将 Cookie 与请求来源进行绑定，防止跨站请求。
   - `SameSite=Strict`：仅允许同站请求携带 Cookie。
   - `SameSite=Lax`：允许同站请求和一些安全的跨站请求携带 Cookie。
   - `SameSite=None`：允许所有跨站请求携带 Cookie，但需要设置 `Secure` 属性。
2. **CSRF Token**：在表单中添加 CSRF Token 字段，服务器端验证 Token 有效性，防止 CSRF 攻击。
3. **Referer Check**：检查请求的 Referer 字段，判断请求来源是否合法，防止 CSRF 攻击。
4. **双重验证**：对于敏感操作，要求用户进行二次验证，如输入密码或验证码，增加攻击难度。
5. 最有效的方法则是不使用 cookie 来校验用户是否登录，改用 localStorage 来存储用户信息

```js
// 设置 SameSite Cookie
res.cookie("sessionId", sessionId, {
  sameSite: "Strict", // 或 "Lax"
});

// CSRF Token 示例
app.post("/submit", (req, res) => {
  const csrfToken = req.body.csrfToken;
  if (csrfToken !== req.session.csrfToken) {
    return res.status(403).send("Invalid CSRF Token");
  }
  // 处理请求
});

// 生成 CSRF Token
app.get("/form", (req, res) => {
  req.session.csrfToken = generateCsrfToken(); // 生成 CSRF Token
  res.send(`
    <form action="/submit" method="post">
      <input type="hidden" name="csrfToken" value="${req.session.csrfToken}" />
      <button type="submit">Submit</button>
    </form>
  `);
});

// Referer Check 示例
app.post("/submit", (req, res) => {
  const referrer = req.headers.referrer;
  if (!referrer || !referrer.startsWith("https://trusted.com")) {
    return res.status(403).send("Invalid Referer");
  }
});
```
