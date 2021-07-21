#!/usr/bin/env node

const path = require("path");
const fs = require("fs");

const handleModuleCreate = require("./handleModuleCreate.js");
const bundle = require("./bundle.js");

let config = {
  entry: "./src/entry.js",
  output: {
    path: "./dist/",
    fileName: "bundle.js",
  },
  module: {
    rules: [],
  },
};

const configPath = path.resolve(process.cwd(), "mypack.config.js");

if (fs.existsSync(configPath)) {
  //如果configPath存在，则使用configPath作为配置
  config = require(configPath);
}

const absEntry = path.resolve(process.cwd(), config.entry);
const absOutputPath = path.resolve(process.cwd(), config.output.path);

console.log("开始解析依赖，生成代码模块...");
const graph = handleModuleCreate(absEntry, config.module.rules);
console.log("解析依赖完成...");

console.log("根据依赖图，开始打包...");
const result = bundle(graph);
console.log("打包完成....");

console.log("开始写入文件...");
if (!fs.existsSync(absOutputPath)) {
  //判断输出的目录是否存在，如果不存在就创建该目录
  fs.mkdirSync(absOutputPath);
}
fs.writeFileSync(path.resolve(absOutputPath, config.output.fileName), result);
console.log("写入文件完成...");
