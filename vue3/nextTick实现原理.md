# nextTick 实现原理

### 面试题：vue 的 nextTick 是怎么实现的

> 参考答案：
> nextTick 的本质是将回调函数包装为一个微任务放到微任务队列中，这样浏览器在完成渲染任务后会优先执行微任务
> Vue3 和 Vue2 在实现上也有一些差异：
>
> 1. vue2 为了兼容浏览器版本，会根据不同的环境采用不同的包装策略
>    - 优先使用 promise
>    - 如果 promise 不存在，则使用 MutationObserver，这是浏览器实现的另一种微任务机制
>    - 如果以上两者都不存在，则使用 setTimeout 作为最后的 fallback
>    - 在旧 IE 中则使用 setImmediate
> 2. vue3 统一使用 Promise 包装回调函数，这样就不需要根据环境来判断了。因为 Vue3 只考虑现代浏览器环境，这样的实现代码更加简洁，性能也高
>
> 整体来讲，vue3 的 nextTick 实现和 vue2 的差异不大，都是采用微任务的方式来实现的。但是 vue3 的实现更加简单，性能也更好
