<?php
namespace app\admin\controller;
use \think\Db;
use \think\Request;
use app\common\controller\Adminbase;

class Admin extends Adminbase{
   private $menu;//选项栏数据
   private $menu2;//菜单栏数据
   private $menu3;//二级菜单栏数据
   
   function __construct(){
      parent::__construct();
	  //设置缓存文件地址
	  $url="static/cache/menu.php";
	  $url2="static/cache/menu2.php";
	  $url3="static/cache/menu3.php";
	  if( is_file($url) ){
	     //文件存在直接读取
	     $this->menu=include $url;
	  }else{
		 //查询数据库并生成缓存文件
		 $this->menu=Db::name("system")->where("sy_cid is null")->select();
	     file_put_contents($url,"<?php return ".var_export($this->menu,true)."?>");
	  }

	  if( is_file($url2) ){
	     //文件存在直接读取
	     $this->menu2=include $url2;
	  }else{
	 	 //查询数据库并生成缓存文件
		 $this->menu2=Db::name("system")->where("sy_cid",">=","1")->select();
	     file_put_contents($url2,"<?php return ".var_export($this->menu2,true)."?>");
	  }

	  if( is_file($url3) ){
	     //文件存在直接读取
	     $this->menu3=include $url3;
	  }else{
	     //查询数据库并生成缓存文件
		 $this->menu3=Db::name("system")->where("sy_bran",">=","1")->select();
	     file_put_contents($url3,"<?php return ".var_export($this->menu3,true)."?>");
	  }

	  //$controller = \think\Request::instance()->controller();
      //$action = \think\Request::instance()->action();
	  //显示默认导航标签
	  $page=$this->menu[0]['sy_id'];

	  $this->assign('page',$page);
	  $this->assign('menu',$this->menu);
	  $this->assign('menu2',$this->menu2);
   	  $this->assign('menu3',$this->menu3);
   }
   
   //获取全局菜单
   function menu_all(){
   	  $this->logic(function(){
        $menu=$this->menu2;
		foreach($menu as $k=>$v){
		  if(strlen($v['sy_name'])<2){
		    foreach($this->menu3 as $j=>$m){
			  if($v['sy_id']==$m['sy_bran']){
			    $menu[$k][]=$m;
			  }
		   	}
		  }
		}
	    if($menu){
	      die(json_encode(['status'=>'ok','data'=>$menu]));
	    }
	    throw new Exception('file is not exists');
   	  });
   }

      //返回菜单数据以及二级菜单数据
   function back_find(){
      $this->logic(function(){
        $tid=isset($_POST['tid'])?$_POST['tid']:'1';
	    $arr=[];
      
	    //首先定义一级菜单默认数据，遇到uid时更改为二级菜单默认数据
	    $count=$this->menu2;
	    $sy='sy_cid';

		foreach( $count as $k=>$v ){
		  if($v[$sy]==$tid){
			if($v['sy_name']=='#'){
			  foreach( $this->menu3 as $j=>$m ){
			    if($v['sy_id']==$m['sy_bran']){
			  	  $v[]=$m;
			  	}
			  }
			}
			$arr[]=$v;
		  }
		}

	    if($arr){
	      die(json_encode(['status'=>'ok','data'=>$arr]));
        }
	    throw new Exception('file is not exists');
   	 });
   }

   //主页
   function index(){
	  $config = $this->select_low("configure");
	  $data = [];
	  foreach($config as $k=>$v){
	     $data[$v['k']] = $v['v'];
	  }
      return $this->fetch('index',['name'=>$this->name,'config'=>$data]);
   }

   //网站配置
   function config(){
	     if(request()->isGet()){
		       $config = $this->select_low("configure");
		       $data = [];
		       foreach($config as $k=>$v){
		          $data[$v['k']] = $v['v'];
		       }
         return $this->fetch("config",['data'=>$data]);
      }else if(request()->isPost()){
	        $arr = input("post.data/a");
		       $data = [];
		       $bool = true;//验证,若等于false则立即跳出循环返回错误信息
		       $date = str_replace("-","",date('Y-m-d'));
		       $temporary = 'upload/img';//图片目录
		       $a = ''; //存储临时img名
		 
		       foreach($arr as $k=>$v){
			      //判断数据是否已存在，存在则执行修改，反之执行添加
			      $existence = $this->select_low("configure",["k"=>$k],0);
			      if($k == "config_logo" || $k == "website_logo"){
			         $varibate = 0;
			         for($i=0; $i<strlen($v); $i++){
			            if($v[$i] == '/'){
			               $varibate++;
				              if($varibate == 3){
				                 $a = substr($v, $i+1);
			               }
			            }
	           }
			         //数据处理阶段,添加
												if( !is_dir($temporary) ){
		             mkdir($temporary, 0700);
		          }
		          if( !is_dir($temporary.'/'.$date) ){
		             mkdir($temporary.'/'.$date, 0700);
		          }
            $path = $temporary.'/'.$date.'/'.$a;//upload为目标文件夹

			         if($v == $existence['v']){
			            break;
			         }
            //判断文件是否存在
            if(!file_exists($path)){
		             if (!copy($v,$path)){
                  $this->error("图片上传失败！");
		             }
		          }
            $v = $path;
			      }
			      if($existence) $res = $this->update_low('configure',['k'=>$k],['v'=>$v]); else{
			         $data['k'] = $k;
			         $data['v'] = $v;
			         $res = $this->insert_low('configure',$data);
			      }
			      if($res === false){
			         $bool = false;
			         break;
		 	     }
		       }
         if($bool !== false){
		          $this->success("操作成功~");
		       }else{
		          $this->error("操作失败！");
         }
	     }
   }

   //菜单设置
   function menu(){
	  if(request()->isGet()){
		 //导航栏内容
		 $navigation = $this->select_low('system','sy_cid is null');
		 $menu = $this->select_low('system','sy_cid>0');
	     return $this->fetch('menu',['navigation'=>$navigation,'menu'=>$menu]);
	  }
   }

   //权限归属列表
   function power(){
      if(request()->isGet()){
	     return $this->fetch();
	  }else if(request()->isPost()){
		 $page = input("post.page");
		 $limit = input("post.limit");
	     $res = Db::name('jurisdiction')->limit(($page-1)*$limit,$limit)->order("s_address asc")->select();
		 //替换所属列表ID为文字
		 $ress = $this->select_low('system',"sy_cid is not null and sy_name<>'#'");
		 foreach($res as $k=>$v){
		    foreach($ress as $m=>$j){
			   if($v['sy_id'] == $j['sy_id']){
			      $res[$k]['sy_id'] = $j['sy_title'];
			   }
			}
		 }
		 return json(['msg'=>'','code'=>0,'count'=>count($this->select_low('jurisdiction')),'data'=>$res]);
	  }
   }

   //管理员列表
   function admination(){
      if(request()->isGet()){
		 return $this->fetch();
	  }else if(request()->isPost()){
	     $admin_user = $this->select_low("administrators");
		 $role = $this->select_low("role");
		 //分组，总共有几个分类
		 $jur = Db::name("jurisdiction")->group("sy_id")->select();
         foreach($admin_user as $k=>$v){
			$admin_user[$k]['ai_time'] = date("Y-m-d H:i:s",$v['ai_time']);
			$admin_user[$k]['last_login_time'] = date("Y-m-d H:i:s",$v['last_login_time']);
			$admin_user[$k]['power'] = 0;
			foreach($role as $j){
		       if($v['ro_id'] == $j['ro_id']){
			      $admin_user[$k]['ro_id'] = $j['ro_name'];
			   }
			   
			   if(count($jur) == count(explode(',',$j['ro_limit'])) && $v['ro_id'] == $j['ro_id']){
			      $admin_user[$k]['power'] = 1;
			   }
			}
		 }
		 return json(['msg'=>'','code'=>0,'count'=>count($admin_user),'data'=>$admin_user]);
	  }
   }

   //角色管理
   function role(){
      if(request()->isGet()){
	     return $this->fetch();
	  }else if(request()->isPost()){
	     $page = input("post.page");
		 $limit = input("post.limit");
	     $res = Db::name('role')->limit(($page-1)*$limit,$limit)->order("ro_id desc")->select();
         $jur = Db::name("jurisdiction")->group("sy_id")->select();
            
         foreach($res as $k=>$v){
			//$jur和$v['ro_limit']说明该角色拥有全部权限
			if(count($jur) == count(explode(',',$v['ro_limit']))){
			   $res[$k]['ro_limit'] = "<b>拥有所有权限</b>";
			}else{
		       $variable = Db::name("system")->where("sy_id",'in',$v['ro_limit'])->select();
			   $str = "";
			   if($variable){
				  //将已有的权限拼接
			      foreach($variable as $j){
			         $str .= $j['sy_title']." ";  
			      }
			   }else{
			      $str = "NULL";
			   }
			   //重新给ro_limit赋值
			   $res[$k]['ro_limit'] = $str;
		    }
		 }
		 return json(['msg'=>'','code'=>0,'count'=>count($this->select_low('role')),'data'=>$res]);
	  }
   }
   
   //导航栏设置
   function navigation(){
      if(request()->isGet()){
	     return $this->fetch();
	  }else if(request()->isPost()){
	     $data = $this->select_low('system','sy_cid is null');
		 return json(['code'=>0, 'msg'=>'', 'count'=>count($data), 'data'=>$data]);
	  }
   }
                                          /*   菜单栏设置逻辑代码   */

   function menujsondata_all(){//菜单栏列表数据获取
      return $this->logic(function(){	 
	   	 $res = Db::name("system")->where("sy_cid is not null")->order("sy_cid","acs")->select(); 
	     if($res !== false){
		    return json(['code'=>0,'msg'=>'','count'=>count($res),'data'=>$res]); 
         }
	  });
   }

   function addclass_all(){//添加菜单选项
      if(request()->isGet()){
		 $id = input('get.id');
		 if(input("get.x_id")){
		    $id = input("get.x_id");
			//修改时
			$this->assign("menu_update",1);
		 }
		 //查找单条
		 $data = Db::name("system")->where('sy_id',$id)->find();
         
		 //判断单条是否为二级菜单
		 if($data['sy_cid'] == 0){
		    $id = $data['sy_bran'];
		 }

		 //查找导航栏选项
		 $navigation = $this->select_low("system","sy_cid is null");
		 //查找一级菜单
		 $res = $this->select_low('system',"sy_cid is not null and sy_bran<0");

		 return $this->fetch("menu_tool",['id'=>$id,'res'=>$res,'navigation'=>$navigation,'data'=>$data]);
	  }else if(request()->isPost()){
	     //$this->logic(function(){
		    $data = input('post.');
            if(!isset($data['sy_cid'])){
			   $data['sy_cid'] = 0;
			}
			//添加数据
			$res = $this->insert_low("system",$data);

			//
			if($res != false){
			   $this->menu_unlink();
			}
			$this->judge_one($res);
		 //});
	  } 
   }

   function menu_dele(){//菜单栏删除,判断并删除子菜单
      if(request()->isPost()){
	     $idAll = input('post.id_all');
		 $variable = Db::name("system")->where("sy_bran","in",$idAll)->select();
         
		 /* 
		    两个if目的
			1.判断该菜单是否存在子菜单,返回数据供用户选择
			2.判断用户是否同意删除,tid:1为同意
		 */
		 if($variable){
			if(input('post.tid')){
			   $del = $this->delete_low('system','sy_bran',$idAll);
			   if($del == false){
			      return json(['msg'=>'系统繁忙,请稍后再试...']);
			   }
			}else{
			   return json(['code'=>'mail']);
			}
		 }
		 //Menu函数
		 $res = $this->delete_low('system','sy_id',$idAll);
         
		 if($res){
		    $this->menu_unlink();
		 }
		 return $this->judge_one($res);
	  }
   }

   function menu_update(){//菜单栏修改
      if(request()->isPost()){
		 if(input("post.del") == 1){
		    $del = $this->delete_low('system','sy_bran',input("post.id"));
			if($del == false){
			   return json(['msg'=>'系统繁忙,请稍后再试...']);
			}
		 }

	     $id = input('post.id');
		 $data = input('post.data/a');

		 //调用方发处理数据
		 $res = $this->update_low('system',['sy_id'=>$id],$data);
         
		 if($res){
		    $this->menu_unlink();
		 }
		 //返回
		 return $this->judge_one($res);
	  }
   }

   function menu_unlink(){//删除缓存文件
      $url = "static/cache/";
	  unlink($url.'menu.php');
	  unlink($url.'menu2.php');
	  unlink($url.'menu3.php');
   }

                                    /*   菜单栏设置逻辑代码   结束   */
   
		                            /*   导航栏设置    */
   
   function navigation_tool(){// 导航栏添加/修改
      if(request()->isGet()){
		 if(input("get.tid")){
			$res = $this->select_low('system',['sy_id'=>input('get.tid')],0);

			$this->assign('tid',input('get.tid'));
			$this->assign('res',$res);
		 }
	     return $this->fetch();
	  }else if(request()->isPost()){
		 /*
		    判断 添加/修改
		 */
	     $data = input("post.data/a");
		 
		 if( input("post.tid") ){
		    $res = $this->update_low("system", ['sy_id'=>input("post.tid")], $data);
		 }else{
		    $res = $this->insert_low("system",$data);
		 }
         $this->menu_unlink();
		 return $this->judge_one($res);
	  }
   }

   function navigation_dele(){//导航栏删除
      if(request()->isPost()){
	     $id = input("post.id");    
		 $res = $this->select_low("system",["sy_cid"=>$id]);

		 if($res){
		    return json(['msg'=>'请先删除栏目下的属性']);
		 }
         $res = $this->delete_low("system","sy_id",$id);
		 $this->menu_unlink();
		 return $this->judge_one($res);
	  }
   }
									/*   导航栏设置    结束    */
									
									/*     权限归属      */
   function power_tool(){
      if(request()->isGet()){
		 if(input("get.tid")){
			$jur = $this->select_low('jurisdiction',['s_id'=>input('get.tid')],0);

			$this->assign('tid',input('get.tid'));
			$this->assign('res',$jur);
		 }
		 $res = $this->select_low('system',"sy_cid is not null and sy_name<>'#'");
	     return $this->fetch('power_tool',['data'=>$res]);
	  }else if(request()->isPost()){
	     /*
		    判断 添加/修改
		 */
	     $data = input("post.data/a");
		 $data['s_address'] = trim($data['s_address']); 
		 if( input("post.tid") ){
		    $res = $this->update_low("jurisdiction", ['s_id'=>input("post.tid")], $data);
		 }else{
		    $res = $this->insert_low("jurisdiction",$data);
		 }

		 return $this->judge_one($res);
	  }
   }

   function power_dele(){
      if(request()->isPost()){
	     $id = input("post.id");    
         $res = $this->delete_low("jurisdiction","s_id",$id);
		 return $this->judge_one($res);
	  }
   }

									/*     权限归属     结束   */

									/*     角色管理            */
  
   function role_tool(){
      if(request()->isGet()){
		 $jurisdictionID = Db::name("jurisdiction")->group("sy_id")->select();
		 $str = '';
		 //获取上级ID
		 foreach($jurisdictionID as $k=>$v){
		    if($k == count($jurisdictionID)-1){
			   $str .= $v['sy_id'];
			}else{
			   $str .= $v['sy_id'].',';
			}
		 }
		 //查询权限用于循环
		 $system = $this->select_low("system","sy_id in($str)");
		 //查询所有权限内容匹配权限
		 $jurisdiction = $this->select_low("jurisdiction");
		 
		 //修改判断
		 if(input("get.tid")){
			$jur = $this->select_low('role',['ro_id'=>input('get.tid')],0);
			$jur['ro_limit'] = explode(',',$jur['ro_limit']);

			$this->assign('tid',input('get.tid'));
			$this->assign('res',$jur);
			//判断用户权限等于所有权限时传入 check
			if(count($jur['ro_limit']) == count($jurisdictionID)){
			   $this->assign('check',1);
			}
		 }
		 
	     return $this->fetch('role_tool',['data'=>$jurisdiction,'datas'=>$system]);
	  }else if(request()->isPost()){
	     /*
		    判断 添加/修改
		 */
	     $data = input("post.data/a");
		 
		 if( input("post.tid") ){
		    $res = $this->update_low("role", ['ro_id'=>input("post.tid")], $data);
		 }else{
		    $res = $this->insert_low("role",$data);
		 }

		 return $this->judge_one($res);
	  }
   }

   function role_dele(){
      if(request()->isPost()){
	     $id = input("post.id");    
         $res = $this->delete_low("role","ro_id",$id);
		 return $this->judge_one($res);
	  }
   }
									/*     角色管理     结束       */

									/*     管理员列表          */
   function admin_tool(){
      if(request()->isGet()){
		 //角色选择
		 $role = $this->select_low("role");
         if(input("get.tid")){
		    $admin_user = $this->select_low('administrators',['ai_id'=>input("get.tid")],0);
			$this->assign("res",$admin_user);
			$this->assign("tid",input("get.tid"));
		 }
	     return $this->fetch('admination_tool',['role'=>$role]);
	  }else if(request()->isPost()){
	     /*
		    判断 添加/修改
		 */
	     $data = input("post.data/a");
		 
		 if( input("post.tid") ){
		    $res = $this->update_low("administrators", ['ai_id'=>input("post.tid")], $data);
		 }else{
			$data['ai_time'] = time();
			$data['ai_pass'] = md5($data['ai_pass']);
		    $res = $this->insert_low("administrators",$data);
		 }

		 return $this->judge_one($res);
	  }
   }

   function admin_dele(){
      if(request()->isPost()){
	     $id = input("post.id");    
         $res = $this->delete_low("administrators","ai_id",$id);
		 return $this->judge_one($res);
	  }
   }

   function admin_upper(){//停用|启用
      if(request()->isPost()){
	     $res = $this->update_low("administrators",['ai_id'=>input("post.ai_id")],['ai_cid'=>input('post.ai_cid')]);
		 return $this->judge_one($res);
	  }
   }

									/*     管理员列表   结束       */
   
   function hardware_cache(){
      if(request()->isPost()){
		 sleep(1);
	     $variable = trim(input("post.name"));
		 if($variable == 'DeleteAllCookies'){
		    $this->menu_unlink();
			$variable = true;
		 }else{
		    $variable = $this->$variable();
		 }
		 if($variable){
		    $this->success("操作成功",'');
		 }
         $this->error("操作失败");
	  }
   }
}
?>