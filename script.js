// script.js
let data = [
  {
    "name":"root",
    "gender":"",
    "tier":0,
    "birthday": null,
    "pic": null,
    "parentID": null,
    "children":[    
      {
      "name": "尤俸祥",
      "gender": "m",
      "tier": 1,
      "birthday": null,
      "pic": null,
      "partnerID": null,
      "children": [
        {
          "name": "尤玉凤",
          "gender": "f",
          "tier": 2,
          "birthday": null,
          "pic": null,
          "partnerID": null,
          // "spouse":{
          //   "name": "尤俸祥",
          //   "gender": "m",
          //   "tier": 2,
          //   "birthday": null,
          //   "pic": null,
          //   "partnerID": null,
          // },
          "children": [
            {
              "name": "田晓光",
              "gender": "m",
              "tier": 3,
              "birthday": null,
              "pic": null,
              "partnerID": null,
              "children": [
                {
                  "name": "田雨阳",
                  "gender": "f",
                  "tier": 4,
                  "birthday": null,
                  "pic": null,
                  "partnerID": null,
                  "children":[]
                }
              ]
            },
            {
              "name": "田漫莉",
              "gender": "f",
              "tier": 3,
              "birthday": null,
              "pic": null,
              "partnerID": 44.0,
              "children": [
                {
                  "name": "彭博",
                  "gender": "m",
                  "tier": 4,
                  "birthday": "1999-01-11",
                  "pic": null,
                  "partnerID": null,
                  "children":[]
                }
              ]
            }
          ]
        },
        {
            "Name": "尤启栋",
            "Gender": "男",
            "birthday": null,
            "pic": null,
            "parent": "尤俸祥",
            "partner": null,
            "partnerID": null,
            "children": [
              {
                "Name": "尤维杰",
                "Gender": "男",
                "birthday": null,
                "pic": null,
                "parent": "尤启栋",
                "partner": null,
                "partnerID": null,
                "children": [
                  {
                    "Name": "尤惠娟",
                    "Gender": "女",
                    "birthday": null,
                    "pic": null,
                    "parent": "尤维杰",
                    "partner": null,
                    "partnerID": null
                  }
                ]
              },
              {
                "Name": "尤维忠",
                "Gender": "男",
                "birthday": null,
                "pic": null,
                "parent": "尤启栋",
                "partner": null,
                "partnerID": null
              }
            ]
          }
      ]
    },
    {
      "name": "N1A",
      "gender": "f",
      "tier": 1,
      "birthday": null,
      "pic": null,
      "partnerID": null,
      "children": [
        {
          "name": "尤玉坤",
          "gender": "f",
          "tier": 2,
          "birthday": null,
          "pic": null,
          "partnerID": null,
          "children": [
            {
              "name": "于航",
              "gender": "m",
              "tier": 3,
              "birthday": null,
              "pic": null,
              "partnerID": null,
              "children": [
                {
                  "name": "于童",
                  "gender": "m",
                  "tier": 4,
                  "birthday": null,
                  "pic": null,
                  "partnerID": null,
                  "children":[]
                }
              ]
            },
            {
              "name": "于红",
              "gender": "f",
              "tier": 3,
              "birthday": null,
              "pic": null,
              "partnerID": null,
              "children": [
                {
                  "name": "田振雨",
                  "gender": "m",
                  "tier": 4,
                  "birthday": null,
                  "pic": null,
                  "partnerID": null,
                  "children":[]
                }
              ]
            }
          ]
        }
      ]
    }]
  }
  ]

// 判断是否有根节点，如果没有，添加一个（适配D3.JS）
// const data = Array.isArray(familyData) ? { name: "root", children: familyData } : familyData;

// console.log("Data structure:", data);
// 设置SVG容器的宽度和高度

const width = 960;
const height = 600;

// 创建SVG容器
const svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(40,0)");

// 创建树布局
const tree = d3.tree()
    .size([height, width - 160])
    //.nodeSize([200, 200])
    ;

// 创建层次结构
const root = d3.hierarchy(data, d => d.children);
console.log("Hierarchy structure:", root);
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
    .attr("width", 120) // 调整宽度
    .attr("height", 120) // 调整高度
    .attr("rx", 5)
    .attr("ry", 5)
    .attr("stroke", "#999")
    .attr("stroke-width", 1.5)
    .attr("fill", "#f9f9f9") // 添加背景色
    .attr("x", -60)
    .attr("y", -60);

// 添加照片
node.append("image")
    .attr("xlink:href", d => d.data.pic || "default-pic.png")
    .attr("width", 50)
    .attr("height", 50)
    .attr("x", -25)
    .attr("y", -45)
    .attr("clip-path", "circle(25px at 25px 25px)");

// 添加姓名
node.append("text")
    .attr("dy", 10)
    .attr("x", 0)
    .attr("y", 10)
    .style("text-anchor", "middle")
    .style("font", "14px sans-serif") // 调整字体大小
    .style("fill", "#333") // 调整字体颜色
    .text(d => d.data.name);

// 添加生日
node.append("text")
    .attr("dy", 25)
    .attr("x", 0)
    .attr("y", 25)
    .style("text-anchor", "middle")
    .style("font", "14px sans-serif") // 调整字体大小
    .style("fill", "#333") // 调整字体颜色
    .text(d => d.data.birthday || "未知");

// 添加配偶连线
root.descendants().forEach(d => {
    if (d.data.spouse) { // 检查是否存在spouse数据
        const spouseNode = {
            data: d.data.spouse,
            x: d.x + 150, // 配偶节点在附属节点的下方
            y: d.y // 保持水平位置不变
        };
        svg.append("path")
            .attr("class", "link spouse-link")
            .attr("d", d3.linkHorizontal()
                .x(d => d.y)
                .y(d => d.x)({
                    source: { x: d.x, y: d.y },
                    target: { x: spouseNode.x, y: spouseNode.y }
                }));
        // 绘制配偶节点
        const spouse = svg.append("g")
            .attr("class", "node spouse")
            .attr("transform", `translate(${spouseNode.y},${spouseNode.x})`);
        spouse.append("rect")
            .attr("width", 120) // 调整宽度
            .attr("height", 120) // 调整高度
            .attr("rx", 5)
            .attr("ry", 5)
            .attr("stroke", "#999")
            .attr("stroke-width", 1.5)
            .attr("fill", "#f9f9f9") // 添加背景色
            .attr("x", -60)
            .attr("y", -60);
        spouse.append("image")
            .attr("xlink:href", spouseNode.data.pic || "default-pic.png")
            .attr("width", 50)
            .attr("height", 50)
            .attr("x", -25)
            .attr("y", -45)
            .attr("clip-path", "circle(25px at 25px 25px)");
        spouse.append("text")
            .attr("dy", 10)
            .attr("x", 0)
            .attr("y", 10)
            .style("text-anchor", "middle")
            .style("font", "14px sans-serif") // 调整字体大小
            .style("fill", "#333") // 调整字体颜色
            .text(spouseNode.data.name);
        spouse.append("text")
            .attr("dy", 25)
            .attr("x", 0)
            .attr("y", 25)
            .style("text-anchor", "middle")
            .style("font", "14px sans-serif") // 调整字体大小
            .style("fill", "#333") // 调整字体颜色
            .text(spouseNode.data.birthday || "未知");
    }
});

// 更新函数
function update(source) {
    // 重新生成树布局
    tree(root);

    // 更新连线
    const link = svg.selectAll(".link")
        .data(root.links(), d => d.target.id);

    link.enter().append("path")
        .attr("class", "link")
        .attr("d", d3.linkHorizontal()
            .x(d => d.y)
            .y(d => d.x))
        .merge(link);

    link.exit().remove();

    // 更新节点
    const node = svg.selectAll(".node")
        .data(root.descendants(), d => d.id);

    const nodeEnter = node.enter().append("g")
        .attr("class", "node")
        .attr("transform", d => `translate(${d.y},${d.x})`)
        .on("click", (event, d) => {
            d.children = d.children ? null : d._children;
            update(d);
        });

    nodeEnter.append("rect")
        .attr("width", 120)
        .attr("height", 120)
        .attr("rx", 5)
        .attr("ry", 5)
        .attr("stroke", "#999")
        .attr("stroke-width", 1.5)
        .attr("fill", "#f9f9f9")
        .attr("x", -60)
        .attr("y", -60);

    nodeEnter.append("image")
        .attr("xlink:href", d => d.data.pic || "default-pic.png")
        .attr("width", 50)
        .attr("height", 50)
        .attr("x", -25)
        .attr("y", -45)
        .attr("clip-path", "circle(25px at 25px 25px)");

    nodeEnter.append("text")
        .attr("dy", 10)
        .attr("x", 0)
        .attr("y", 10)
        .style("text-anchor", "middle")
        .style("font", "14px sans-serif")
        .style("fill", "#333")
        .text(d => d.data.name);

    nodeEnter.append("text")
        .attr("dy", 25)
        .attr("x", 0)
        .attr("y", 25)
        .style("text-anchor", "middle")
        .style("font", "14px sans-serif")
        .style("fill", "#333")
        .text(d => d.data.birthday || "未知");

    node.merge(nodeEnter).transition()
        .attr("transform", d => `translate(${d.y},${d.x})`);

    node.exit().remove();
}

// 初始化
root.descendants().forEach(d => {
  d._children = d.children;
  if (d.depth === 0) {
      d.children = d._children; // 仅展开根节点的子节点
  } else {
      d.children = null;
  }
});
update(root);