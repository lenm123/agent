<?php
namespace app\admin\controller;
use app\common\controller\Base;
use \think\Db;
use \think\Session;//引入session
class login extends Base{
   function index(){
	 if(request()->isGet()){
	   return $this->fetch();
	 }elseif(request()->isPost()){
	   $data = request()->post();
       //验证码
       if (!captcha_check($data['verify'])) {
          $this->error('验证码输入错误！');
       }
	   // 验证数据
       $rule = [
          'username' => 'require|alphaDash|length:3,20',
          'password' => 'require|length:3,20',
       ];
       $result = $this->validate($data, $rule);

       if (true !== $result) {
          $this->error($result);
       }

	   $res = Db::name('administrators')->where(["ai_user"=>$data['username'],'ai_pass'=>md5($data['password'])])->find();

	   if($res){
         if($res['ai_cid']==0){//判断账号是否被停用
		    $this->error('您的账号已被禁用');
	     }else{
			
			//修改管理员最后登录的时间和ip地址
			$last['last_login_ip'] = GetHostByName($_SERVER['SERVER_NAME']);
			$last['last_login_time'] = time();
			$update_admin = Db::name("administrators")->where("ai_id",$res['ai_id'])->update($last);
			if($update_admin){
			   //使用SESSION判断登录
		       Session::set('uid',$res['ai_id']);
	           $this->success('恭喜您，登陆成功', url('admin/index'));
	        }else{
			   $this->error("系统繁忙，请重试~");
			}
		 }
	   }else{
	      $this->error("用户名或者密码错误，登陆失败！");
	   }
	 }
   }
}
?>