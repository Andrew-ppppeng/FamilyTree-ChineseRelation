function getDescendantRelations(node) {
    if (!node.children) return;
    node.children.forEach(child => {
        let relation = child.data.gender === 'm' ? '儿子' : '女儿';
        if (!child.data.chain) {
            child.data.chain = []; // 初始化为数组
        }
        child.data.chain = [...node.data.chain];
        child.data.chain.push(relation);
        getDescendantRelations(child); // 递归调用
    });
}

function getSiblings (node) {
    // 获取当前节点的直系同辈节点,不包括自己
    if (!node.parent) return; // 根节点没有兄弟节点
    return node.parent.children.filter (d => d !== node);
  }


function getSiblingRelations(node) {
    // 获取当前节点的直系同辈节点的关系
    if(getSiblings(node)){
        const siblings = getSiblings(node);
        siblings.forEach(sibling => {
            let relation = sibling.data.gender === 'm' ? '兄弟' : '姐妹';
            if (!sibling.data.chain) {
                sibling.data.chain = []; // 初始化为数组
            }
            sibling.data.chain = [...node.data.chain];
            sibling.data.chain.push(relation);
        });
    }
}

function calculateParentRelations(node){
    let relation = node.parent.data.gender === 'm'? '父亲':'母亲';
    if(!node.parent.data.chain){
        node.parent.data.chain = [];
    }
    node.parent.data.chain = [...node.data.chain]
    node.parent.data.chain.push(relation);
}



export {getDescendantRelations, getSiblings, getSiblingRelations, calculateParentRelations}