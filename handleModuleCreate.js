const path = require("path");

const createModule = require("./createModule.js");

//这个函数用于从入口文件开始分析，生成依赖图
function handleModuleCreate(entry,rules) {
  // 从入口文件开始
  const entryModule = createModule(entry,rules);

  // 我们使用一个队列来依次分析模块，刚开始队列中只有一个模块
  const modules = [entryModule];

  // 遍历队列中的模块，刚开始只有一个模块，随后会添加进新的模块，然后继续遍历，直到剩余为空
  for (const module of modules) {
    // 模块的依赖
    const { dependencies } = module;

    // 这个对象用于保存依赖的模块名字于id的映射关系，便于追踪
    module.dependences = {};

    // 因为本地模块的依赖是相对于当前模块导入的，这步是得到当前模块的目录
    const dirname = path.dirname(module.filename);

    // 遍历模块的依赖
    dependencies.forEach((relativePath) => {
      // 结合当前模块目录和依赖相对路径得到依赖的绝对路径
      const absolutePath = path.join(dirname, relativePath);

      // 创建依赖的资源对象
      const child = createModule(absolutePath,rules);

      // 将依赖对象的id添加到dependences对象上，方便后期查找
      module.dependences[relativePath] = child.id;

      // 最后，将依赖资源对象加入到队列中。
      modules.push(child);
    });
  }
  return modules;
}

module.exports = handleModuleCreate;
