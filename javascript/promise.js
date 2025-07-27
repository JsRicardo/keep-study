const PENDING = "pending";
const RESOLVED = "resolved";
const REJECTED = "rejected";

function runMicroTask(callback) {
  if (globalThis?.process?.nextTick) {
    process.nextTick(callback);
  } else if (globalThis.MutationObserver) {
    const ele = document.createElement("p");
    const observer = new MutationObserver(callback, { childList: true });
    observer.observe(ele);
    ele.innerHTML = "1";
  } else {
    setTimeout(callback, 0);
  }
}

// promise A+ 规范
function isPromiseLike(obj) {
  return obj && typeof obj === "object" && typeof obj.then === "function";
}

class MP {
  constructor(fn) {
    this.status = PENDING;
    this.value = undefined;
    this.tasks = [];

    try {
      fn(this._resolve.bind(this), this._reject.bind(this));
    } catch (e) {
      this._reject(e);
    }
  }

  _changeState(newStatus, newValue) {
    if (this.status !== PENDING) return;
    this.status = newStatus;
    this.value = newValue;

    this._runTasks();
  }

  _runTasks() {
    if (this.status === PENDING) return;

    while (this.tasks.length) {
      const handler = this.tasks.shift();

      if (handler.status === this.status) {
        this._run(handler);
      }
    }
  }

  _run(handler) {
    runMicroTask(() => {
      const { executor, status, resolve, reject } = handler;
      if (typeof executor !== "function") {
        this.status === REJECTED ? reject(this.value) : resolve(this.value);
        return;
      }

      try {
        const res = executor(this.value);
        if (isPromiseLike(res)) {
          res.then(resolve, reject);
        } else {
          resolve(res);
        }
      } catch (e) {
        reject(e);
      }
    });
  }

  _resolve(data) {
    this._changeState(RESOLVED, data);
  }

  _reject(reason) {
    this._changeState(REJECTED, reason);
  }

  then(onResolved, onRejected) {
    return new MP((resolve, reject) => {
      this.tasks.push({
        status: RESOLVED,
        executor: onResolved,
        resolve,
        reject,
      });
      this.tasks.push({
        status: REJECTED,
        executor: onRejected,
        resolve,
        reject,
      });

      this._runTasks(); // 假设执行then时  promise状态已决
    });
  }

  catch(onRejected) {
    return this.then(null, onRejected);
  }

  finally(onSettled) {
    return this.then(
      (data) => {
        onSettled();
        return data;
      },
      (err) => {
        onSettled();
        return err;
      }
    );
  }

  static resolve(data) {
    if (data instanceof MP) {
      return data;
    }

    return new MP((res, rej) => {
      if (isPromiseLike(data)) {
        data.then(res, rej);
      } else {
        res(data);
      }
    });
  }

  static reject(reason) {
    return new MP((res, rej) => {
      rej(reason);
    });
  }

  static all(proFns) {
    return new MP((resolve, reject) => {
      try {
        const results = [];
        const len = proFns.length;
        let count = 0;
        if (len === 0) resolve(results);

        for (let index = 0; index < len; index++) {
          const fn = proFns[index];

          MP.resolve(fn).then((data) => {
            count++;
            results[index] = data;

            if (count === len) {
              resolve(results);
            }
          }, reject);
        }
      } catch (e) {
        reject(e);
      }
    });
  }

  static race(proFns) {
    return new MP((resolve, reject) => {
      for (const fn of proFns) {
        MP.resolve(p).then(resolve, reject);
      }
    });
  }
}

const p = new MP((res, rej) => {
  res(1);
});

p.then(
  (res) => {
    console.error("log by Ricardo M Lee rocket res", res);
  },
  (err) => console.error("log by Ricardo M Lee rocket err", err)
);

console.error("log by Ricardo M Lee rocket", p);
