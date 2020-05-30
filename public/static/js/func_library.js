var __={
	 white:'',
     tebie:function(tid,menu){
		     _.m('安全检查中...',4,20000);
			 //default_navs表示页面cookie初次加载
			 if(tid == __.getCookie('default_nav') && __.getCookie('default_navs')>0 ){
				
			    str=__.getCookie('default_menuku');
		        //$('.sign').remove();//清除sign这个元素
                $('.target').html(str);//向类cells里面添加元素
                if(__.getCookie('default_level')>0){
				      $(".left .target dd").hide();//隐藏所有dd
					  __.level();
				}
                
				__.addClass(__.getCookie('default_menu'));

				__.target();//将这条菜单添加到任务栏
			 }else{
			  if(__.getCookie('default_navs') <= '0'){
			     tid=menu;
			  }
	          _.a("/admin.php/admin/back_find",{tid:tid},function(res){
	             if(res.status=='ok'){
			       var str='';
				   var len = (res.data).length;
                   __.setCookie('default_level','0');//检测是否存在二级菜单
			       for( var i=0; i<len; i++ ){
			         var p = res.data[i];
                     
					 if(p.sy_name.length<2){
						//显示一级与二级菜单
						lev=__.getCookie('default_level');
						lev++;
						__.setCookie('default_level',lev);//遇到二级菜单改default_level值
	                    str += "<dl class='sign dt' data-src='"+p.sy_name+p.sy_id+"'><dt style='display:block;'><a><i class='layui-icon "+p.sy_icon+"'></i> &nbsp<span> "+p.sy_title+"</span><i class='layui-icon layui-icon-tabs' style='float:right;margin-right:15px;font-size:12px;'></i></a></dt>";
				        var variable=0;
						
						for(var a in res.data[i]){
						   if(parseInt(a) || parseInt(a)==0){
						      variable++;
						   }
						}
                        
						for( j=0; j<=variable; j++){
                          if(res.data[i][j] != undefined){
						    //var lens = Object.keys(res.data[i]).length;
							var ps=res.data[i][j];
							var cla='';
							if(j==0){
							  cla='darkerlishadow';
							}else if(j == variable-1){
							  cla='darkerlishadowdown';
							}
							str +="<dd data-src='"+ps.sy_name+"' class='"+cla+"'><a><i class='layui-icon "+ps.sy_icon+"'></i> &nbsp<span> "+ps.sy_title+"</span></a></dd>";
					      }
					    }
						str +="</dl>";
					 }else{
						//只显示一级菜单
					    str += "<li class='sign li' data-src='"+p.sy_name+"'><a><i class='layui-icon "+p.sy_icon+"'></i> &nbsp<span> "+p.sy_title+"</span></a></li>";
                     }
				   }
                   
				   __.setCookie('default_menuku',str);
		           $('.sign').remove();//清除sign这个元素
                   $('.target').append(str);//向类cells里面添加元素

                   //检测二级菜单是否存在
				   if(__.getCookie('default_level')>0){
				      $(".left .target dd").hide();//隐藏所有dd
					  __.level();
				   }

				   //_.q();
                   __.addClass(__.getCookie('default_menu'));
				   
                   __.target();

                   __.setCookie('default_nav',tid);
				   //初次没有cookie的时候用于判断
				   __.setCookie('default_navs',__.getCookie('default_navs')+1);
				   
		         }else if(res.msg){
					    //__.clearAllCookie();
					    parent.login_top();
						
			     }else{
		            _.m(res.status,3,3000);
		         }
			    
	          })  
             }
			 _.q();
	       },
   	 setCookie:function(name,value){ 
                  //var Days = 2; //一天
                  var exp = new Date(); 
                  exp.setTime(exp.getTime() + 10*60*60*24); 
                  document.cookie = name+"="+ escape (value) +";expires="+60*60*24; 
				  //console.log(exp.toGMTString());
                  //document.cookie = name+"="+escape (value);
                },
	 getCookie:function(name){ 
                  var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
 
                  if(arr=document.cookie.match(reg))
 
                     return unescape(arr[2]); 
                  else 
                     return null; 
               },
	 addClass:function(value){
			     $(".left li[data-src='"+value+"'],.left dd[data-src='"+value+"']").addClass('menus');
				 /*$(".left li[data-src='"+__.white+"'] a,.left dd[data-src='"+__.white+"'] a" ).css('color','#8a8a8a');
				 __.white=value;
				 $(".left li[data-src='"+value+"'] a,.left dd[data-src='"+value+"'] a" ).css('color','#fff');*/
			  },
	 delCookie:function(name){
                  document.cookie = name+"=;expires="+(new Date(0)).toGMTString();
               },
	 clearAllCookie:function() {
				var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
				if(keys) {
				   for(var i = keys.length; i--;)
				      document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString()
				}
			},
	 target:function(){
			  //连接iframe
                   var arr_target=['首页'];
				   var arr_target2=['main/home'];
				   var target=document.cookie.indexOf("default_target=");
				   var target2=document.cookie.indexOf("default_target2=");
				   if(target<0){
				      __.setCookie("default_target",arr_target.join(','));
				   }
				   if(target2<0){
				      __.setCookie("default_target2",arr_target2.join(','));
				   }
				   
			       $(".target li,.target dd,.menu ul li").click(function(){
					  var address = $(this).attr("data-src");
					  if(address.length<2){
					     return;
					  }
					  _.m('正在加载...',16,20000);
					  
					  
					  var b=1;
                      
					  var selDom = $("#ul_option li[data-src='" + address + "']");
		              var s =$(this).text();
					  if(selDom.length === 0){  
		                 $('.right .r_target ul').append("<li data-src='"+address+"' id='i_judge"+__.getCookie('default_gaga')+"'><span onclick=\"back('"+address+"')\">"+s+"</span><i class='layui-icon layui-icon-close' onclick=\"i_dele('i_judge"+__.getCookie('default_gaga')+"','"+s+"','"+address+"')\"></i></li>");
		                 var ling=__.getCookie('default_gaga');
		                 ling++;
		                 __.setCookie('default_gaga',ling);
					     parent.createmove();
					  }else{
					     parent.move(selDom);
					  }
					  var zhuanze = parent.back(address);//显示内容
					  //判断显示内容无误之后再添加 地址 和 地名 
					  if(zhuanze !== 0 && selDom.length === 0){
					     __.setCookie("default_target",__.getCookie('default_target')+","+s);
					     __.setCookie("default_target2",__.getCookie('default_target2')+","+address);
					  }
			       })	   
			 },
	 level:function(){
			  var b=0;
		      $(".left .target dt").click(function(){
                 if(b){
	                return;
	             }
                 b=1;
                 $(this).parent().find('dd').removeClass("menu_chioce");
                 $(".menu_chioce").slideUp();
                 $(this).parent().find('dd').slideToggle();
                 $(this).parent().find('dd').addClass("menu_chioce");
	             setTimeout(function(){
	                b=0;
	             },300);
				 
			  });
			  $('dd[data-src="'+__.getCookie("default_menu")+'"]').parent('dl').find('dd').each(function(){
			     $(this).css("display","block");
			  });
		   },
     timestampToTime:function(timestamp) {
        var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
        Y = date.getFullYear() + '-';
        M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        D = (date.getDate() < 10 ? '0'+ date.getDate() : date.getDate() ) + ' ';
        h = (date.getHours() < 10 ? '0'+ date.getHours() : date.getHours() ) + ':';
        m = (date.getMinutes() < 10 ? '0'+ date.getMinutes() : date.getMinutes() ) + ':';
        miao = (date.getSeconds() < 10 ? '0'+ date.getSeconds() : date.getSeconds() ) ;
        return Y+M+D+h+m+miao;
     }
}
