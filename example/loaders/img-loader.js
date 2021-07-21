function getBase64(buffer) {
  let imgBase64Str = buffer.toString("base64");
  return `data:image/png;base64,${imgBase64Str}`; //buffer转base64
}

function imgLoader(source) {
  const content = getBase64(source); //这是buffer格式的source 转为base64格式的内容
  return `export default \`${content}\``;
}

module.exports = imgLoader;
module.exports.raw = true;
