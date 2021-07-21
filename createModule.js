const fs = require("fs");
const path = require("path");
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const { transformFromAst } = require("@babel/core");

let ID = 0;

// 该函数以文件名（包含路径）为参数，返回资源对象
function createModule(filename, rules) {
  // 保存的依赖
  const dependencies = [];

  let content = "";

  let jsReg = /\.js$/; //判断是否是js文件的正则
  if (jsReg.test(filename)) {
    // 读取js文件内容，获取到文件'utf-8'编码的字符串
    content = fs.readFileSync(filename, "utf-8");
  } else {
    //如果不是js文件则使用loader中的规则转化成js，然后才能使用babel进行parse
    for (let i = 0; i < rules.length; i++) {
      let rule = rules[i];

      //使用配置里面的test正则匹配文件名
      if (rule.test.test(filename)) {

        //引入loader
        let loaderFunc = require(rule.use);

        // 读取非js文件内容,判断loader是否导出了raw属性，如果导出了raw属性则将文件读取为Buffer,否则读取为utf-8字符串
        if (loaderFunc.raw) {
          content = fs.readFileSync(filename);
        } else {
          content = fs.readFileSync(filename, "utf-8");
        }

        content = loaderFunc(content); //执行loader导出的函数，并传入参数
      }
    }
  }

  // 根据文件内容生成AST
  let ast = parser.parse(content, { sourceType: "module" });

  traverse(ast, {
    ImportDeclaration: ({ node }) => {
      // 将依赖的值，也就是文件名添加到数组中
      dependencies.push(node.source.value);
    },
  });

  // 转译代码
  const transformedData = transformFromAst(ast, null, {
    presets: [path.join(__dirname, "./node_modules/@babel/preset-env")],
  });

  let code = transformedData.code;

  // 自增id代表模块资源的唯一标识
  const id = ID++;

  // 分析模块得到一个资源对象，包含id，文件名，转移后的代码以及依赖
  return { id, filename, code, dependencies };
}

module.exports = createModule;
