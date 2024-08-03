import data from './data.js'


function getContainerSize() {
    const container = d3.select("body").node().getBoundingClientRect();
    return {
        width: container.width,
        height: window.innerHeight
    };
}

let width = getContainerSize().width;
let height = getContainerSize().height;
// 创建SVG容器
const svg = d3.select("body")
    .append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("width", "100%")
    .attr("height", "100vh")
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
    .separation((a, b) => a.parent === b.parent ? 1 : 1.2) // 添加separation方法,调整节点间距
    .nodeSize([140, 220]);

// 创建层次结构
const root = d3.hierarchy(data[0]);

// 生成树布局
tree(root);
root.x0 = height / 2;
root.y0 = 0;

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
;

// 绘制节点的卡片
node.append("rect")
    .attr("width", 80) // 调整宽度
    .attr("height", 130) // 调整高度
    .attr("x", -40)
    .attr("y", -65);

// 添加照片
node.append("image")
    .attr("xlink:href", d => d.data.pic || (d.data.gender === 'm' ? 'default-M.png' : 'default-F.jpg'))
    .attr("width", 70)
    .attr("height", 70)
    .attr("x", -35)
    .attr("y", -60)

// 添加姓名
node.append("text")
    .attr("dy", 25)
    .attr("x", 0)
    // .attr("y", 10)
    .attr("class", "name")
    .style("font", "0.875rem sans-serif") // 调整字体大小
    .style("fill", "#000000") // 调整字体颜色
    .text(d => d.data.name);

// 添加生日
node.append("text")
    .attr("dy", 40)
    .attr("x", 0)
    // .attr("y", 25)
    .attr("class", "birthday")
    .style("font", "0.6rem sans-serif") // 调整字体大小
    .style("fill", "#000000") // 调整字体颜色
    .text(d => "🎂 " + (d.data.birthday || "生日未知"));



function fitToScreen() {
    const bounds = svg.node().getBBox();
    const fullWidth = bounds.width;
    const fullHeight = bounds.height;
    const width = getContainerSize().width;
    const height = getContainerSize().height-30;
    const midX = bounds.x + fullWidth / 2;
    const midY = bounds.y + fullHeight / 2 -100;

    const scale = 0.9 / Math.max(fullWidth / width, fullHeight / height);
    const translate = [width / 2 - scale * midX, height / 2 - scale * midY];

    d3.select("svg").transition()
        .duration(750)
        .call(zoom.transform, d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale))
}



export {node, root, fitToScreen}