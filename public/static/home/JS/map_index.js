( function(){
     var myChart = echarts.init(document.querySelector("#chart-panel"));

     var mapName = 'china'
var data = [
    {name:"北京",value:1},
    {name:"天津",value:1},
    {name:"河北",value:1},
    {name:"山西",value:1},
	{name:"湖南",value:1},
	{name:"湖北",value:1},
	{name:"福建",value:1},
	{name:"河南",value:1}
    ];
    
var geoCoordMap = {};
var toolTipData = [ 
    {name:"北京",value:[{name:"科技人才总数",value:95},{name:"理科",value:82}]},
    {name:"天津",value:[{name:"文科",value:22},{name:"理科",value:20}]},
    {name:"河北",value:[{name:"文科",value:60},{name:"理科",value:42}]},
    {name:"山西",value:[{name:"文科",value:40},{name:"理科",value:41}]},
    {name:"内蒙古",value:[{name:"文科",value:23},{name:"理科",value:24}]},
    {name:"辽宁",value:[{name:"文科",value:39},{name:"理科",value:28}]},
    {name:"吉林",value:[{name:"文科",value:41},{name:"理科",value:41}]},
    {name:"黑龙江",value:[{name:"文科",value:35},{name:"理科",value:31}]},
    {name:"上海",value:[{name:"文科",value:12},{name:"理科",value:12}]},
    {name:"江苏",value:[{name:"文科",value:47},{name:"理科",value:45}]},
    {name:"浙江",value:[{name:"文科",value:57},{name:"理科",value:57}]},
    {name:"安徽",value:[{name:"文科",value:57},{name:"理科",value:52}]},
    {name:"福建",value:[{name:"文科",value:59},{name:"理科",value:57}]},
    {name:"江西",value:[{name:"文科",value:49},{name:"理科",value:42}]},
    {name:"山东",value:[{name:"文科",value:67},{name:"理科",value:52}]},
    {name:"河南",value:[{name:"文科",value:69},{name:"理科",value:68}]},
    {name:"湖北",value:[{name:"文科",value:60},{name:"理科",value:56}]},
    {name:"湖南",value:[{name:"文科",value:62},{name:"理科",value:52}]},
    {name:"重庆",value:[{name:"文科",value:47},{name:"理科",value:44}]},
    {name:"四川",value:[{name:"文科",value:65},{name:"理科",value:60}]},
    {name:"贵州",value:[{name:"文科",value:32},{name:"理科",value:30}]},
    {name:"云南",value:[{name:"文科",value:42},{name:"理科",value:41}]},
    {name:"西藏",value:[{name:"文科",value:5},{name:"理科",value:4}]},
    {name:"陕西",value:[{name:"文科",value:38},{name:"理科",value:42}]},
    {name:"甘肃",value:[{name:"文科",value:28},{name:"理科",value:28}]},
    {name:"青海",value:[{name:"文科",value:5},{name:"理科",value:5}]},
    {name:"宁夏",value:[{name:"文科",value:10},{name:"理科",value:8}]},
    {name:"新疆",value:[{name:"文科",value:36},{name:"理科",value:31}]},
    {name:"广东",value:[{name:"文科",value:63},{name:"理科",value:60}]},
    {name:"广西",value:[{name:"文科",value:29},{name:"理科",value:30}]},
    {name:"海南",value:[{name:"文科",value:8},{name:"理科",value:6}]},
];

/*获取地图数据*/
myChart.showLoading();
var mapFeatures = echarts.getMap(mapName).geoJson.features;
myChart.hideLoading();
mapFeatures.forEach(function(v) {
    // 地区名称
    var name = v.properties.name;
    // 地区经纬度
    geoCoordMap[name] = v.properties.cp;

});

var max = 480,
    min = 9; // todo 
var maxSize4Pin = 100,
    minSize4Pin = 20;

var convertData = function(data) {
    var res = [];
    for (var i = 0; i < data.length; i++) {
        var geoCoord = geoCoordMap[data[i].name];
        if (geoCoord) {
            res.push({
                name: data[i].name,
                value: geoCoord.concat(data[i].value),
            });
        }
    }
    return res;
};
option = {
    geo: {
        show: true,
        map: mapName,
        label: {
            normal: {
                show: false
            },
            emphasis: {
                show: true,
                textStyle: {color: '#fff', fontSize: '7.5'}
            }
        },
        roam: false,
        itemStyle: {
            normal: {
                areaColor: '#fff',
                borderColor: '#24a4ff',
            },
            emphasis: {
                areaColor: '#fff',
			    textStyle: {color: '#000'}
            }
        }
    },
    series: [{
            name: '散点',
            type: 'scatter',
            coordinateSystem: 'geo',
            data: convertData(data),
            symbolSize: function(val) {
                return val[1] / 100;
            },
            label: {
                normal: {
                    formatter: '{b}',
                    position: 'right',
                    show: true,
					textStyle:{fontSize:"10.5",marginLeft: 10}//省份标签字体颜色
                },
                emphasis: {
                   show: true,
                   textStyle:{color:"#fff"},
				   areaColor:'skyblue'
                }
            },
            itemStyle: {
                normal: {
                    color: '#000',
                }
            }
        },
        {
            type: 'map',
            map: mapName,
            geoIndex: 0,
            aspectScale: 0.75, //长宽比
            showLegendSymbol: false, // 存在legend时显示
            label: {
                normal: {
                    show: true
                },
                emphasis: {
                    show: false,
                    textStyle: {
                        color: '#fff'
                    }
                }
            },
            roam: true,
            itemStyle: {
                normal: {
                    areaColor: '#000',
                    borderColor: '#000',
                },
                emphasis: {
                    areaColor: '#2B91B7'
                }
            },
            animation: false,
            data: data
        },
        {
            name: '点',
            type: 'scatter',
            coordinateSystem: 'geo',
            zlevel: 1,
        },
        {
            name: 'Top 5',
            type: 'effectScatter',
            coordinateSystem: 'geo',
            data: convertData(data.sort(function(a, b) {
                return b.value - a.value;
            }).slice(0, 100)),
            symbolSize: function(val,paras) {
                return val[1] / 4;
            },
            showEffectOn: 'render',
            rippleEffect: {
				period:10,               //动画的时间。
                scale:10,  
                brushType: 'stroke'
            },
            hoverAnimation: true,
            label: {
                normal: {
                    formatter: '{b}',
                    position: 'left',
                    show: false
                }
            },
            itemStyle: {
                normal: {
                    color: '#24a4ff',
                    shadowBlur: 4,
					fontSize: 5,
                    shadowColor: '#24a4ff',
                }
            },

            zlevel: 2
        },

    ]
};

    myChart.setOption(option);
    var str = "<div class=\"chart-bg\"><div class=\"chart-title\">覆盖广州，上海，北京等二百多个城市,";
    str += "<a>查看列表</a></div><div class=\"chart-sign\"><span></span>现有资源</div></div>";

    /*str += "<div class=\"chart-value\">";
    str += "<div class=\"text\"><h4>地区多</h4><span class=\"iconspan\"><svg class=\"icon\" aria-hidden=\"true\">";
    str += "<use xlink:href=\"#icon-icon--yes\"></use></svg></span></div>";
    str += "<div class=\"text\"><h4>地区多</h4><span class=\"iconspan\"><svg class=\"icon\" aria-hidden=\"true\">";
    str += "<use xlink:href=\"#icon-icon--yes\"></use></svg></span></div>";
    str += "<div class=\"text\"><h4>地区多</h4><span class=\"iconspan\"><svg class=\"icon\" aria-hidden=\"true\">";
    str += "<use xlink:href=\"#icon-icon--yes\"></use></svg></span></div>";
    str += "<div class=\"text\"><h4>地区多</h4><span class=\"iconspan\"><svg class=\"icon\" aria-hidden=\"true\">";
    str += "<use xlink:href=\"#icon-icon--yes\"></use></svg></span></div>";
    str += "<div class=\"text\"><h4>地区多</h4><span class=\"iconspan\"><svg class=\"icon\" aria-hidden=\"true\">";
    str += "<use xlink:href=\"#icon-icon--yes\"></use></svg></span></div>";
    str += "</div>";*/
    $("#chart-panel").append(str);
} )();