<?php
namespace app\common\controller;
use \think\Db;
use app\common\controller\Base;
//全局函数
class Indexbase extends Base{
   
   //退出登陆
   public function logout(){
     //销毁session
     session("user_id", NULL);
	    session("user_name", NULL);
     //跳转页面
     $this->redirect(url('login/index'));
   }
}
?>