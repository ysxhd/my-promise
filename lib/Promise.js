// 自定义Promise函数模块
(function(window) {

    const PENDING = 'pending'
    const RESOLVED = 'resolved'
    const REJECTED = 'rejected'
    /**
     * Promise 够早函数
     * excutor: 执行器函数（同步执行）
     */
    function Promise(excutor) {
        const self = this;

        self.status = PENDING  // 给promise队形指定status属性，初始值为pending
        self.data = undefined // 给promise对象指定一个用于存储结果数据的属性
        self.callbacks = [] // 每个元素的结构：{ onResolved() {}, onRejected() {} }

        function resolve(value){
            // 如果当前状态不是pending，直接结束
            if (self.status !== PENDING) {
                return
            }
            // 将状态改为resolved
            self.status = RESOLVED
            // 保存value数据
            self.data = value
            // 如果有待执行callback函数，立即异步执行回调函数
            if (self.callbacks.length > 0) {
                self.callbacks.forEach(callbacksObj => {
                    setTimeout(() => { // 放入队列中执行所有成功的回调
                        callbacksObj.onResolved(value);
                    })
                });
            }
        }

        function reject(reason){
            // 如果当前状态不是pending，直接结束
            if (self.status !== PENDING) {
                return
            }
            // 将状态改为rejected
            self.status = REJECTED
            // 保存value数据
            self.data = reason
            // 如果有待执行callback函数，立即异步执行回调函数
            if (self.callbacks.length > 0) {
                self.callbacks.forEach(callbacksObj => {
                    setTimeout(() => { // 放入队列中执行所有成功的回调
                        callbacksObj.onRejected(reason);
                    })
                });
            }
        }
        // 立即同步执行excutor
        try {
            excutor(resolve, reject)
        } catch (error) {
            reject(error)
        }
    }

    /*
        Promise原型对象的then()
        指定成功和失败的回调函数
        返回一个新的promise对象
    */
    Promise.prototype.then = function(onResolved, onRejected) {
        const self = this;
        // 返回一个新的promise对象
        return new Promise((resolve, reject) => {
            if(self.status === PENDING){
                // 假设当前状态还是pending状态，将回调函数保存起来
                self.callbacks.push({
                    onResolved,
                    onRejected
                })
            }else if(self.status === RESOLVED){
                setTimeout(() => {
                    /*
                     1. 如果抛出异常，return的promise就会失败， reason就是error  
                     2. 如果回调函数执行返回非promise， return 的promise就会成功，value就是返回的值
                     3. 如果回调函数执行返回是promise， return的promise结果就是这个promise的结果
                    */
                   try {
                      const result = onResolved(self.data)
                      if(result instanceof Promise){
                        //  3. 如果回调函数执行返回是promise， return的promise结果就是这个promise的结果
                        // result.then(
                        //     value => resolve(value), // 当result成功时，return 的promise也成功
                        //     reason => reject(reason)// 当result失败时，return 的promise也失败
                        // )
                        result.then(resolve, reject)
                      }else {
                        //   2. 如果回调函数执行返回非promise， return 的promise就会成功，value就是返回的值
                        resolve(result)
                      }
                   } catch (error) {
                    //    1. 如果抛出异常，return的promise就会失败， reason就是error  
                        reject(error)
                   }
                })
            }else{
                setTimeout(() => {
                    onRejected(self.data)
                })
            }
        })
    }

    /*
        Promise原型对象的catch()
        指定失败的回调函数
        返回一个新的promise对象
    */
    Promise.prototype.catch = function(onRejected) {

    }

    /*
        Promise函数对象的resolve
        返回制定结果一个成功的promise
    */
    Promise.resolve = function(value) {

    }

    /*
        Promise函数对象的reject
        制定一个reason 失败的promise
    */
    Promise.reject = function(reason) {
        
    }
    /*
        Promise函数对象的all方法
        返回一个promise，只有当所有promise都成功时才成功，否则只要有一个失败的就失败
    */
    Promise.all = function(promises) {
        
    }
    /*
        Promise函数对象的all方法
        返回一个promise,其结果由第一个完成的promise决定
    */
    Promise.race = function(promises) {
            
    }
    // 向外暴漏Promise函数
    window.Promise = Promise;
})(window)