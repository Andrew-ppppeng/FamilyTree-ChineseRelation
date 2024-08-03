function update(source) {
    // 重新生成树布局
    tree(root);

    // 更新连线
    const link = svg.selectAll(".link")
        .data(root.links(), d => d.target.id);

    // Enter新的连线
    const linkEnter = link.enter().insert("path", "g")
        .attr("class", "link")
        .attr("d", d3.linkHorizontal()
            .x(d => source.y0)
            .y(d => source.x0));
      // 更新连线
    const linkUpdate = linkEnter.merge(link);

    linkUpdate.transition()
        .duration(750)
        .attr("d", d3.linkHorizontal()
            .x(d => d.y)
            .y(d => d.x));

    // 移除退出的连线
    const linkExit = link.exit().transition()
        .duration(750)
        .attr("d", d3.linkHorizontal()
            .x(d => source.y)
            .y(d => source.x))
        .remove();

      root.eachBefore(d => {
        d.x0 = d.x;
        d.y0 = d.y;
    });

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

    const nodeSize = d3.scaleLinear()
      .domain([0, root.height])
      .range([10, 5]);


    node.selectAll("rect")
      .attr("width", d => nodeSize(d.depth))
      .attr("height", d => nodeSize(d.depth));
      node.on("click", (event, d) => {
        if (d.children) {
            d._children = d.children;
            d.children = null;
        } else {
            d.children = d._children;
            d._children = null;
        }
        update(d);
    });

    nodeEnter.append("rect")
        .attr("width", 100)
        .attr("height", 100)
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
        .duration(750)
        .attr("transform", d => `translate(${d.y},${d.x})`);
    
        // 更新SVG容器高度
    const containerHeight = root.descendants().length * 150; // 根据节点数量计算高度
    svg.attr("height", containerHeight); // 设置SVG容器高度

    node.exit().remove();
}

export default update;