
import data, {extractNames} from './data.js';
import { showLoading, hideLoading } from './util.js';
import { getDescendantRelations, getSiblings, getSiblingRelations, calculateParentRelations} from '/relation.js'

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
    .nodeSize([120, 200])
    ;

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
    .attr("width", 60) // 调整宽度
    .attr("height", 100) // 调整高度
    .attr("x", -30)
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
    .attr("dy", 15)
    .attr("x", 0)
    // .attr("y", 10)
    .attr("class", "name")
    .style("text-anchor", "middle")
    .style("font", "0.875rem sans-serif") // 调整字体大小
    .style("fill", "#000000") // 调整字体颜色
    .text(d => d.data.name);

// 添加生日
node.append("text")
    .attr("dy", 30)
    .attr("x", 0)
    // .attr("y", 25)
    .attr("class", "birthday")
    .style("text-anchor", "middle")
    .style("font", "0.6rem sans-serif") // 调整字体大小
    .style("fill", "#000000") // 调整字体颜色
    .text(d => d.data.birthday || "生日未知");


function calculateRelations(node) {
    let tier = node.data.tier;
    node.data.chain = [];
    node.data.chain.push('自己');
    let current = node;
    getDescendantRelations(node,tier);


    while(current !== root) {
        getSiblingRelations(current);
        let sibling = getSiblings(current);
        sibling.forEach(node => {
            getDescendantRelations(node,tier);
        });
        calculateParentRelations(current);
        current = current.parent;
    }
}

function updateRelation(name){
    const targetNode = root.descendants().find(d => d.data.name === name);
    calculateRelations(targetNode);
    
    // 清除之前算的文本
    node.selectAll('text.relation').remove();

    node.append('text')
    .attr("dy",45)
    .attr("x",0)
    .attr("class", "relation")
    .style("text-anchor","middle")
    .style("font","0.6rem sans-serif")
    .style("fill","#000000")
    .text(d=>{
        let options = {
            text:'',		// 目标对象：目标对象的称谓汉字表达，称谓间用‘的’字分隔
            target:'',	    	// 相对对象：相对对象的称谓汉字表达，称谓间用‘的’字分隔，空表示自己
            sex:-1,			// 本人性别：0表示女性,1表示男性
            type:'default',		// 转换类型：'default'计算称谓,'chain'计算关系链,'pair'计算关系合称
            reverse:false,		// 称呼方式：true对方称呼我,false我称呼对方
            mode:'default',		// 模式选择：使用setMode方法定制不同地区模式，在此选择自定义模式
            optimal:false,       	// 最短关系：计算两者之间的最短关系
        };
        // if (!d.data.chain) {
        //     d.data.chain = []
        // }
        options.text = d.data.chain.join('的');
        options.sex = d.data.gender === 'm' ? 1 : 0;
        console.log(relationship(options));
        if(targetNode.data.tier === d.data.tier){
            if(targetNode.data.birthday && d.data.birthday){
                let targetAge = new Date(targetNode.data.birthday);
                let relativeAge = new Date(d.data.birthday);
                if(relativeAge<targetAge){
                    // target的年纪小，亲属年纪大。亲属为哥哥姐姐
                    return relationship(options).filter(item => item.includes('姐') || item.includes('哥')) || "错误";
                }else{
                    return relationship(options).filter(item => item.includes('弟') || item.includes('妹')) || "错误";
                }
            }
        }
        return relationship(options) || "错误";
    })
}



function fitToScreen() {
    const bounds = svg.node().getBBox();
    const fullWidth = bounds.width;
    const fullHeight = bounds.height;
    const width = getContainerSize().width;
    const height = getContainerSize().height-30;
    const midX = bounds.x + fullWidth / 2;
    const midY = bounds.y + fullHeight / 2 -200;

    const scale = 0.9 / Math.max(fullWidth / width, fullHeight / height);
    const translate = [width / 2 - scale * midX, height / 2 - scale * midY];

    d3.select("svg").transition()
        .duration(750)
        .call(zoom.transform, d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale))
}

document.addEventListener('DOMContentLoaded', function() {
    const updateButton = document.getElementById('update');
    updateButton.addEventListener('click', function(){
        const selectedName = document.getElementById('dropdownInput').value; // 获取dropdown的值
        showLoading();
        setTimeout(() => {
            updateRelation(selectedName);
            hideLoading();
        }, 100);
    });
    fitToScreen();
});






document.addEventListener('DOMContentLoaded', () => {
    const dropdownInput = document.getElementById('dropdownInput');
    const dropdownList = document.getElementById('dropdownList');
  
    // Your options array
    const options = extractNames(data); 
    // Function to create and display dropdown items
    function createDropdownItems(options) {
        dropdownList.innerHTML = '';
        options.forEach(option => {
          const item = document.createElement('div');
          item.className = 'dropdown-item';
          item.textContent = option;
          dropdownList.appendChild(item);
    
          item.addEventListener('click', function() {
            dropdownInput.value = this.textContent;
            dropdownList.style.display = 'none';
          });
        });
      }
  
    // Initially create all dropdown items
    createDropdownItems(options);
  
    dropdownInput.addEventListener('input', () => {
        const filter = dropdownInput.value.toLowerCase();
        const filteredOptions = options.filter(option => option.toLowerCase().includes(filter));
        createDropdownItems(filteredOptions);
        dropdownList.style.display = 'block';
      });
    
      dropdownInput.addEventListener('focus', () => {
        dropdownList.style.display = 'block';
      });
    
      document.addEventListener('click', (event) => {
        if (!event.target.matches('#dropdownInput')) {
          dropdownList.style.display = 'none';
        }
      });
    });
