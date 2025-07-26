# CommonJS 规范和 ESM 规范

## CommonJS

- 社区标准
- 使用函数实现
- 仅限 node 环境支持
- 动态依赖（代码运行函数执行后，才能确定）
- 动态依赖时同步执行 同步函数

```js

function require(pathId) {
    if (pathId has cache) {
        return cache[pathId]
    }

    function _run(exports, require, module, __filename, __dirname) {
        // 模块代码在这里执行，不会污染全局
    }

    var module = {
        exports: {}
    }

    _run.call(
        module.exports,
        module.exports,
        require,
        module,
        __filename,
        __dirname
    )

    cache[pathId] = module.exports

    return module.exports
}

if (a == b) {
  require("./a.js");
}
```

## ESM

- 官方标准
- 符号绑定：import 的内容和 export 的内容是同一个内存空间
- 同时支持静态依赖和动态依赖
- 静态分析：import 的内容在编译时就确定了，不会动态改变
- 动态依赖是异步的

## 面试题

### 1. 请你介绍一下 CommonJS 规范和 ESM 规范的区别

答：CommonJS 规范和 ESM 规范的区别主要体现在以下几个方面：

1. **社区标准 vs 官方标准**：CommonJS 是社区标准，主要用于 Node.js 环境；而 ESM 是官方标准，浏览器和 Node.js 都支持。
2. **模块加载方式**：CommonJS 使用 `require` 函数来加载模块，ESM 使用 `import` 语句。
3. **模块导出方式**：CommonJS 使用 `module.exports` 导出模块，ESM 使用 `export` 语句。
4. **循环依赖**：CommonJS 规范中，循环依赖是允许的，但是 ESM 规范中，循环依赖是不允许的。
5. **动态依赖**：CommonJS 规范中，动态依赖是在运行时才确定的，所以不能静态分析。而 ESM 规范中，动态依赖是在编译时就确定了，不会动态改变。
6. **异步依赖**：CommonJS 规范中，动态依赖是同步的，而 ESM 规范中，动态依赖是异步的。
7. **符号绑定**：ESM 导入时有符号绑定，内存空间指向同一块。CMJ 只是普通的函数调用和赋值

### export 和 export default 的区别是什么？

答：`export` 和 `export default` 的区别主要体现在以下几个方面：

1. **导出方式**：`export` 用于导出多个命名的变量或函数，而 `export default` 用于导出一个默认的变量或函数。
2. **导入方式**：`export` 导入时需要使用花括号 `{}` 包裹导入的变量或函数，而 `export default` 导入时可以直接使用变量或函数名，不需要包裹。
3. **数量限制**：一个模块只能有一个 `export default`，但可以有多个 `export`。

### 代码题

```js
// module A
var count = 0;
export function increment() {
  count++;
}
export { count };

// module B
import { increment, count } from "./moduleA.js";
console.log(count); // 0
increment();
console.log(count); // 1

const c = count;
increment();
console.log(c); // 1
```
