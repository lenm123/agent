var _={
    'm':function(name='',icon=null,time='1000',huidiao=function(){}){
		  layer.msg(name,{icon:icon,time:time},huidiao);
	    },
	'o':function(title='',number='',url='',width='500',height='400'){
          layer.open( {
            title: title,
            type:number, //type:2,显示的是窗口样式
            area:[width+'px', height+'px'],
            content:url
           });
	    },
	 'x':function(text){
		   layer.alert(text, {
             skin: 'layui-layer-lan',
             closeBtn: 1,
             //anim: 2 //动画类型
           });
		},
	 't':function(title,text,width='600',height='300'){
		   layer.tab({
             area: [width+'px', height+'px'],
             tab: [{
               title: title, 
               content: text
             }]
           });
		  },
	 p:function(url, data, callback){
          $.post(url, data, callback, 'json');
       },
     a:function(url,data,callback,async=true,methods='post'){
	      $.ajax({
		     type:methods,
             url:url,
			 data:data,
			 async:async,
			 dataType:'json',
			 success:callback,
			 error:function(a,b,c){
			    _.m(c,2,2000);
			 }
		  })
	   },
     q:function(){
          layer.closeAll();
     },

     ts:function(title,func,func2=function(){ _.q(); }){
	      layer.confirm(title, {
            btn:['确定','取消'],
            btn1:func, //function1
            btn2:func2 //function2
          })
       }	
};

/*var showimg = document.getElementById('show_img');
    var fileBtn = document.getElementById('img');
    // 获取上传文件信息
    fileBtn.onchange = function () {
        var file = this.files[0]; 
        if(window.FileReader) {
            var fr = new FileReader();
            fr.readAsDataURL(file);
            fr.onload = function(e) {
                console.log(e.target); // e.target返回FileReader对象,里面包含：事件，状态，属性，结果等
                console.log(this); // 同e.target返回结果一样,两者等价
                console.log(e.target.result); // 读取的结果，dataURL格式的
                showimg.src = this.result; // 图片可显示出来
            };
        } else {
            alert('暂不支持FileReader');
        }
};*/


