// 根据依赖图生成合并文件内容
function bundle(graph) {
  let modules = "";

  // 拼接模块字符串，将模块转译后代码包含在函数中，做到变量隔离
  graph.forEach((item, index) => {
    modules += `${item.id}:[
        function(require,module,exports){
          ${item.code}
        },
        ${JSON.stringify(item.dependences)}
      ],
      `;
  });

  // require函数的作用是根据模块id得到模块的导出对象（即module.exports）
  let result = `
    (function(modules){
      function require(id){
        // 第一个是模块代码，第二个是模块依赖
        const [fn,dependences] = modules[id];
  
        function localRequire(name){
          return require(dependences[name]);
        }
  
        const module = { exports:{} };
  
        fn(localRequire,module,module.exports);
  
        // 将模块接口暴露出去
        return module.exports;
      }
      require(0);
    })({${modules}})
    `;

  return result;
}

module.exports = bundle;
