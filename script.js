
import data from './data.js';
import update from './update.js';
const width = 960;
const height = 900;

// 创建SVG容器
const svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(40,0)");

// 添加缩放功能
const zoom = d3.zoom()
.scaleExtent([0.1, 3])
.on("zoom", (event) => {
    svg.attr("transform", event.transform);
});

d3.select("svg").call(zoom);

// 创建树布局
const tree = d3.tree()
    .size([null, width - 160])
    .separation((a, b) => a.parent === b.parent ? 1 : 1.5) // 添加separation方法,调整节点间距
    //.nodeSize([200, 200])
    ;

// 创建层次结构
const root = d3.hierarchy(data[0]);

// 生成树布局
tree(root);

// 创建连线
const link = svg.selectAll(".link")
    .data(root.links())
    .enter().append("path")
    .attr("class", "link")
    .attr("d", d3.linkHorizontal()
        .x(d => d.y)
        .y(d => d.x));

// 创建节点
const node = svg.selectAll(".node")
    .data(root.descendants())
    .enter().append("g")
    .attr("class", "node")
    .attr("transform", d => `translate(${d.y},${d.x})`)
    .on("click", (event, d) => {
        d.children = d.children ? null : d._children;
        update(d);
    });

// 绘制节点的卡片
node.append("rect")
    .attr("width", 50) // 调整宽度
    .attr("height", 50) // 调整高度
    .attr("x", -50)
    .attr("y", -50);

// 添加照片
node.append("image")
    .attr("xlink:href", d => d.data.pic || "default-pic.png")
    .attr("width", 50)
    .attr("height", 50)
    .attr("x", -25)
    .attr("y", -45)

// 添加姓名
node.append("text")
    .attr("dy", 30)
    .attr("x", 0)
    // .attr("y", 10)
    .style("text-anchor", "middle")
    .style("font", "14px sans-serif") // 调整字体大小
    .style("fill", "#333") // 调整字体颜色
    .text(d => d.data.name);

// 添加生日
node.append("text")
    .attr("dy", 25)
    .attr("x", 0)
    // .attr("y", 25)
    .style("text-anchor", "middle")
    .style("font", "14px sans-serif") // 调整字体大小
    .style("fill", "#333") // 调整字体颜色
    .text(d => d.data.birthday || "未知");



// 更新函数


// 初始化
root.descendants().forEach(d => {
  d._children = d.children;
  if (d.depth === 0) {
      d.children = d._children; // 仅展开根节点的子节点
  } else {
      d.children = null;
  }
});
root.x0 = height / 2;
root.y0 = 0;
// update(root);