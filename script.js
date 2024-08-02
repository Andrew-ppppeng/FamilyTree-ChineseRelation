
import {options} from './data.js';
import { showLoading, hideLoading } from './util.js';
import { getDescendantRelations, getSiblings, getSiblingRelations, calculateParentRelations} from '/relation.js'
import {node, root, fitToScreen } from './SVG.js';







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
    .attr("dy",55)
    .attr("x",0)
    .attr("class", "relation")
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
    // const options = extractNames(data); 
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
