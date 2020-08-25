var container = document.getElementById('mynetwork');
var network = null;
var options;

var nodes = null;
var edges = null;
var network = null;

var DIR = 'assets/refresh-cl/';
var EDGE_LENGTH_MAIN = 100;
var EDGE_LENGTH_SUB = 50;

// Create a data table with nodes.
  nodes = [];

  // Create a data table with links.
  edges = [];
  nodesVis = null;
  edgesVis = null;
  nodeTile = '<div style="padding:15px;"><h5 style="margin-bottom:10px;">Quidway(192.168.2.230)</h5>'
  +'<h5 style="margin-bottom:10px;">在离线：<span title="在线">在线</span></h5><h5 style="margin-bottom:10px;">电压：20V</h5><h5 style="margin-bottom:10px;">电流：20A</h5><h5>线损：10%</h5></div>';
  nodes.push({id: 1, label: '变压器', image: DIR + '变压器.png', shape: 'image', opacity: 1,title:nodeTile});
  nodes.push({id: 2, label: '智能网关1',image: DIR + '智能网关.png', shape: 'image', opacity: 1,title:nodeTile,shadow:{enabled: true,color: 'rgba(255,0,0,0.5)',size:18,x:0,y:0}})
  nodes.push({id: 3, label: '集中器1', image: DIR + '集中器.png', shape: 'image',title:nodeTile});
  edges.push({from: 1, to: 2, length: EDGE_LENGTH_MAIN,color:'red'});
  edges.push({from: 1, to: 3, length: EDGE_LENGTH_MAIN});
  
  nodes.push({id: 4, label: '断路器1', image: DIR + '断路器.png', shape: 'image', group: 'computer', opacity: 1,title:nodeTile});
  edges.push({from: 3, to: 4, length: EDGE_LENGTH_MAIN});
  
  nodes.push({id: 5, label: '断路器2', image: DIR + '断路器.png', shape: 'image', group: 'computer', opacity: 1,title:nodeTile});
  nodes.push({id: 6, label: '智能表箱1', image: DIR + '表箱.png', shape: 'image', opacity: 1,title:nodeTile});
  nodes.push({id: 7, label: '智能电表1', image: DIR + '电表.png', shape: 'image', opacity: 1,title:nodeTile});
  edges.push({from: 4, to: 5, length: EDGE_LENGTH_MAIN});
  edges.push({from: 4, to: 6, length: EDGE_LENGTH_MAIN});
  edges.push({from: 4, to: 7, length: EDGE_LENGTH_MAIN});
  
  nodes.push({id: 8, label: '断路器3', image: DIR + '断路器.png', shape: 'image', group: 'computer', opacity: 1,title:nodeTile});
  nodes.push({id: 9, label: '智能表箱2', image: DIR + '表箱.png', shape: 'image', opacity: 1,title:nodeTile});
  nodes.push({id: 10, label: '智能电表2', image: DIR + '电表.png', shape: 'image', opacity: 1,title:nodeTile});
  edges.push({from: 5, to: 8, length: EDGE_LENGTH_MAIN});
  edges.push({from: 5, to: 9, length: EDGE_LENGTH_MAIN});
  edges.push({from: 5, to: 10, length: EDGE_LENGTH_MAIN});
  var j = 3;
  for (var i = 11; i <= 18; i++) {
	nodes.push({id: i, label: '智能电表'+j, image: DIR + '电表.png', shape: 'image', group: 'computer', opacity: 1,title:nodeTile});
	edges.push({from: 6, to: i, length: EDGE_LENGTH_SUB});
	j++;
  }
  
  var options = {
	autoResize: true,
	height: '100%',
	width: '100%',
	nodes : {
		font:{
			color: "#595959",
			size: 13
		}
	},
	edges: {
		smooth: false, //是否显示方向箭头
		color: "#c8c8c8" // 线条颜色
	},
	layout: {
		improvedLayout:false
	},
	interaction: {
		navigationButtons: false, // 如果为真，则在网络画布上绘制导航按钮。这些是HTML按钮，可以使用CSS完全自定义。
		keyboard: {
			enabled: false,
		} // 启用键盘快捷键
	},
	physics: {
		stabilization: false,
		barnesHut:{
			theta: 0.2,//合并的远程力和各个短程力之间的边界较高的值会更快，但是会产生更多的错误，较低的值会很慢，但是会减少错误
			centralGravity: 0.3, // 中心重力吸引器将整个网络拉回中心
			springLength: 80, // 边缘被建模为弹簧。这个弹簧长度是弹簧的剩余长度
			gravitationalConstant: -80000, // 重力吸引。我们喜欢排斥 所以价值是负数。如果你想要排斥力更强，减小值（所以-10000，-50000）。
			avoidOverlap: 1, // 接受范围：[0 .. 1]。当大于0时，会考虑节点的大小。该距离将由重力模型的节点的包围圆的半径计算。值1是最大重叠避免。
			damping: 1,//*弹簧抖动 值越小则抖动越厉害
			springConstant: 0.5
		},
		timestep: 0.1,//如果您在网络中看到大量的抖动，可以稍微降低这个值。
		minVelocity: 2 // 一旦达到所有节点的最小速度，我们假设网络已经稳定，仿真停止。 值越大停止的越早
	},
	interaction: {
		hover: true
	},
  };

// Called when the Visualization API is loaded.
function draw() {
	nodesVis = new vis.DataSet(nodes);
	edgesVis = new vis.DataSet(edges);
	var data = {
	  nodes: nodesVis,
	  edges: edgesVis
	};
  network = new vis.Network(container, data, options);
  
  //动画稳定后的处理事件
	var stabilizedTimer;
	network.on("stabilized", function (params) { // 会调用两次？
		exportNetworkPosition(network);
		window.clearTimeout(stabilizedTimer);
		stabilizedTimer = setTimeout(function(){
			options.physics.enabled = false; // 关闭物理系统
			network.setOptions(options);
			network.fit({animation:true});
		},100);
	});

	// 右键
	network.on("oncontext",function(params){});

	//选中节点
	network.on("selectNode", function (params) {
		
		
	});

	//单击节点
	network.on("click", function (params) {});

	//双击节点 隐藏或者显示子节点
	network.on("doubleClick", function (params) {
		if(params.nodes.length != 0){
			options.physics.enabled = true;
			for(var i in nodes){
				nodes[i].fixed = false
				if(nodes[i].id == params.nodes[0]){
					nodes[i].x=0;
					nodes[i].y=0;
					nodes[i].fixed=true;
				}
			}
			draw();
		}
		
	});

	//拖动节点
	network.on("dragging", function (params) {//拖动进行中事件
		if (params.nodes.length != 0 ) {
			nodeMoveFun(params);
		}
	});

	//拖动结束后
	network.on("dragEnd", function (params) {
		if (params.nodes.length != 0 ) {
			var arr = nodeMoveFun(params);
			exportNetworkPosition(network,arr);
		}
	});

	// 缩放
	network.on("zoom", function (params) {});
	network.on("hoverNode",function(params){
		
	})
	
}

$(function (){
	draw();
});

/*
 *获取所有子节点
 * network ：图形对象
 * _thisNode ：单击的节点（父节点）
 * _Allnodes ：用来装子节点ID的数组
 * */
function getAllChilds(network,_thisNode,_Allnodes){
	var _nodes = network.getConnectedNodes(_thisNode,"to");
	if(_nodes.length > 0){
		for(var i=0;i<_nodes.length;i++){
			getAllChilds(network,_nodes[i],_Allnodes);
			_Allnodes.push(_nodes[i]);
		}
	}
	return _Allnodes
};

// 节点移动
function nodeMoveFun(params){
	var click_node_id = params.nodes[0];
	var allsubidsarr = getAllChilds(network,click_node_id,[]); // 获取所有的子节点

	if(allsubidsarr){ // 如果存在子节点
		var positionThis = network.getPositions(click_node_id);
		var clickNodePosition = positionThis[click_node_id]; // 记录拖动后，被拖动节点的位置
		var position = JSON.parse(localStorage.getItem("position"));
		var startNodeX,startNodeY; // 记录被拖动节点的子节点，拖动前的位置
		var numNetx,numNety; // 记录被拖动节点移动的相对距离
		var positionObj={}; // 记录移动的节点位置信息， 用于返回

		positionObj[click_node_id] =  {x:clickNodePosition.x, y:clickNodePosition.y}; // 记录被拖动节点位置信息
		numNetx = clickNodePosition.x - position[click_node_id].x; // 拖动的距离
		numNety = clickNodePosition.y - position[click_node_id].y;

		for(var j =0;j<allsubidsarr.length;j++){
			if(position[allsubidsarr[j]]) {
				startNodeX = position[allsubidsarr[j]].x; // 子节点开始的位置
				startNodeY = position[allsubidsarr[j]].y;
				network.moveNode(allsubidsarr[j], (startNodeX + numNetx), (startNodeY + numNety)); // 在视图上移动子节点
				positionObj[allsubidsarr[j]] =  {x:(startNodeX + numNetx), y:(startNodeY + numNety)}; // 记录子节点位置信息
			}
		}
	}
	return positionObj;
};

/*
 *节点位置设置
 * network ：图形对象
 * arr ：本次移动的节点位置信息
 * */
function exportNetworkPosition(network,arr){
	if(arr){ // 折叠过后  getPositions() 获取的位置信息里不包含隐藏的节点位置信息，这时候调用上次存储的全部节点位置，并修改这次移动的节点位置，最后保存
		var localtionPosition = JSON.parse(localStorage.getItem("position"));
		for(let index in arr ){
			localtionPosition[index] = {
				x:arr[index].x,
				y:arr[index].y
			}
		}
		setLocal(localtionPosition);

	}else{
		var position = network.getPositions();
		setLocal(position);
	}
};
//处理本地存储，这里仅仅只能作为高级浏览器使用，ie9以下不能处理
function setLocal(position) {
	localStorage.removeItem("position");
	localStorage.setItem("position",JSON.stringify(position));
}