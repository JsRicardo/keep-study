# VUE3 整体变化

主要有以下几个方面的变化：

1. 源码上的变化
2. 性能上的变化
3. 语法 API 的变化
4. 引入 RFC 规范

## 源码优化

### 1. Monorepo

Vue2 的源码是托管在 src 目录下，然后根据功能拆分出了

- core：平台无关的运行时代码
- compiler：编译器相关
- platforms： 平台专用代码
- server：服务端渲染相关代码
- sfc： 单文件组件相关代码
- shared： 共享工具库代码

但是各模块无法单独分离出来下载安装，也无法针对单个模块进行发布、测试等

而 Vue3 的源码工程搭建改为了 Monorepo 的形式，将模块拆分到了不同的包里面，每个包有各自的 API、类型定义和测试等。这样一来粒度更细，每个包的体积也更小，发布也更快，也方便开发者引用单独的包。

### 2 类型系统的变化 Typescript

- Vue 1.x: 纯 JS 开发，无类型系统
- Vue2.x： 引入了 Flow 类型系统
- Vue3.x： 引入了 Typescript 类型系统

## 性能变化

### 1. 源码体积缩小

- 移除了冷门功能： 如 filter、inline-template、$listeners 等
- 生产环境采用 rollup 进行构建，利用 tree-shaking 减少打包体积

### 2. 数据劫持优化

- Vue2.x： 采用 Object.defineProperty 进行数据劫持，初始化递归所有属性，存在性能问题
- Vue3.x： 采用 Proxy 进行数据劫持，性能更优，直接代理整个对象更方便，懒代理性能更优

### 3. 编译优化

- Vue3.x： 模板编译时生成渲染函数，运行时直接执行渲染函数，减少了 VNode 的创建和 diff 的开销
- 静态提升： 编译器优化了静态节点的提升，减少了运行时的开销
- 预字符串化： 编译器将多个连续静态节点转换为字符串
- 缓存事件处理函数： 缓存模板上声明的内联函数 `<div @click="count++">click</div>`
- Block Tree：编译器模板编译为 block tree，每一个 block 都是一个函数
- PatchFlags：用于标记变化类型，优化 diff 算法

### 4. diff 算法优化

- Vue2.x： diff 算法是基于双端比较的，性能较差
- Vue3.x： diff 算法是 双端对比 + 最长递增子序列算法（贪心+二分查找），性能更优

### 5. 组件实例化优化

- Vue2.x： 组件实例化时会创建一个空的 VNode 作为占位符
- Vue3.x： 组件实例化时会创建一个 Proxy 对象，代理组件实例，实现响应式

## 语法 API 变化

### 1. 优化逻辑组织

- Vue2.x： 组件的逻辑组织是基于 Options 的，如 data、methods、watch 等
- Vue3.x：Composition API，如 setup、ref、reactive 等， 同样也支持 Options API 的风格。但是更推荐 Composition API

### 2. 优化逻辑复用

- Vue2.x： 逻辑复用是基于 mixins 的，但是 mixins 的问题是：
  - 命名冲突
  - 数据来源不清晰
  - 组合顺序不固定
- Vue3.x： 逻辑复用是基于 Composition API

### 3. 创建 APP

- Vue2.x： 创建 Vue 实例是通过`new Vue({})`，
- Vue3.x： 创建 Vue 实例是通过`createApp({})`，返回一个应用实例，可以挂载多个组件

## 引入 RFC 规范

RFC 全称是 Request for Comments，中文意思是请求评论，是一种互联网上的讨论和改进的机制。Vue3 引入了 RFC 规范，用于对 Vue 进行改进和优化。

通过 RFC，Vue 社区可以对 Vue 进行讨论和改进，例如：

- 新增新的 API
- 优化现有 API
- 修复 bug
- 改进性能
- 改进文档

实际上，`defineProps` 、 `defineEmits`等 API 都是来自于这里

---

## 面试题

### 为什么 Vue3 中去掉了 Vue 构造函数

答：Vue3 中去掉了 Vue 构造函数，改为使用`createApp`创建应用实例，这样做的好处是：

1. 更符合现代 JavaScript 的模块化思想，避免全局污染
2. 可以创建多个应用实例，每个实例有自己的状态、插件、组件等，互不干扰
3. Vue 的构造器函数集成了太多功能，不利于 tree-shaking
4. Vue2 没有把组件实例和 Vue 应用两个概念区分开，`new Vue`创建的既是一个 Vue 应用，又是一个特殊的 Vue 组件，而 Vue3 则把组件实例和 Vue 应用两个概念区分开，`createApp`创建的是一个 Vue 应用

### Vue3 相比于 Vue2 有什么变化？

答：Vue3 相比于 Vue2 的整体变化，可以分为好几大类

1. 源码上的变化
2. 性能上的变化
3. 语法 API 的变化
4. 引入 RFC 规范

**源码的优化**体现在使用`typescript`重构了整个源码，对冷门的功能进行了删除，并且整个源码的结构变为了使用`Monorepo`进行管理，这样粒度更细，不同的包可以独立测试发布，用户也可以单独引入某一个包使用，而不用必须引入 Vue

**性能上的优化**是整个 Vue3 最核心的变化，通过优化响应式、diff 算法、模板编译，Vue3 的性能相比 Vue2 也有了质的飞跃，在渲染速度、内存占用、启动时间等方面都有了显著的改进。

不过性能层面的优化，开发者无法直接感知，开发者能够直接感知的是**语法 API** 的变化，Vue3 中的`Composition API`的出现，使得开发者可以更方便的组织代码，逻辑复用更方便，代码更清晰，更符合现代 JavaScript 的模块化思想。

在 Vue3 中，`Options API`也可以正常使用，它变成了一种编码风格

另外就是引入了`RFC`，Evan You 团队也是应用 RFC 规范，对 Vue 的重大功能改进进行讨论
