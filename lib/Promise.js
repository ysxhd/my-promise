// 自定义Promise函数模块
(function(window) {
    /**
     * Promise 够早函数
     * excutor: 执行器函数（同步执行）
     */
    function Promise(excutor) {
        this.status = 'pending'  // 给promise队形指定status属性，初始值为pending
        this.data = undefined // 给promise对象指定一个用于存储结果数据的属性
        this.callbacks = [] // 每个元素的结构：{ onResolved() {}, onRejected() {} }

        function resolve(value){
            // 如果当前状态不是pending，直接结束
            if (this.status !== 'pending') {
                return
            }
            // 将状态改为resolved
            this.status = 'resolved'
            // 保存value数据
            this.data = value
            // 如果有待执行callback函数，立即异步执行回调函数
            if (this.callbacks.length > 0) {
                this.callbacks.forEach(callbacksObj => {
                    setTimeout(() => { // 放入队列中执行所有成功的回调
                        callbacksObj.onResolved(value);
                    })
                });
            }
        }

        function reject(reason){
            // 如果当前状态不是pending，直接结束
            if (this.status !== 'pending') {
                return
            }
            // 将状态改为rejected
            this.status = 'rejected'
            // 保存value数据
            this.data = reason
            // 如果有待执行callback函数，立即异步执行回调函数
            if (this.callbacks.length > 0) {
                this.callbacks.forEach(callbacksObj => {
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