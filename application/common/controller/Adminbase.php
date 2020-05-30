<?php
namespace app\common\controller;
use \think\Db;
use app\common\controller\Base;
use app\admin\model\Administrators as user;
//全局函数
class Adminbase extends Base{
   protected $name='';

   function _initialize(){
     parent::_initialize();
     //判断用户是否登录
	 $uid=session('uid');

	 if(!isset($uid)){
        $uid = "";
     }
     
     if($uid == null || $uid == "" || $uid == "null" || $uid == 0){
        //PATH_INFO
		return $this->error('请先登录！',url('login/index'), 0);
     }
     
	 //判断权限
	 /*if(session("limit") != 1 && request()->isPost()){
		$url = substr($_SERVER['PATH_INFO'],1,-5);
		$res = $this->select_low("jurisdiction",["s_address"=>$url]);
		//判断该请求是否为操作请求
		if($res){
		   $limit = session("limit");
	       if(!in_array($url,$limit) || empty($limit)){
	          $this->error("您的权限不足");
	       }
		}
	 }*/
     
	 //判断登录是否有效
	 if($this->adminuser() == false){
	    $this->error("请先登录！", url("login/index"));
	 }
     //echo $_SERVER['REQUEST_METHOD'];
	 //$this->assign('cls',strtolower($controller));
	 //$this->assign('act',strtolower($action));
   }

   private function adminuser(){
	  if($this->name == ''){
		 //查看uid是否有效
		 $row = new user();
		 $this->name = $row->find(session('uid'));
	     if(empty($this->name)){
			session('uid',NULL);
		    return false;
		 }
	  }
      //账号是否被停用
	  if(!$this->name['ai_cid']){
	     $this->error('您的帐号已经被锁定！', url('login/index'));
         return false;
	  }
	  return $this->name;
   }
   
   //退出登陆
   public function logout(){
     //销毁session
     session("uid", NULL);
	 session("limit", NULL);
	 $this->DeleteAllCookies();
     //跳转页面
     $this->redirect(url('login/index'));
   }
   
   protected function logic($func){
     try{
	   $function =$func;
	   return $function();
	 } catch(Exception $e){
	    if($e->getMessage()){
	      die(json_encode(['status'=>'系统繁忙,请稍后再试...']));
	    }
	 }
   }

   //验证数据是否正常被处理
   protected function die_all($res,$error='',$status=[],$data=[], $parameter = false){
      if($error == ''){
	     $error = '系统繁忙,请稍后再试...';
	  }
     
	  if($res !== $parameter){
		 $status['status'] = 'ok';
         die(json_encode($status));			      
	  }
	  die(json_encode(['status'=>$error,'data'=>$data]));
   }

   protected function judge_one($res,$success='',$error='',$url='',$data=[], $parameter = false){
      //success == 1,赋值给$data
	  if(empty($success) || $success == 1){
	   	 if($success == 1){
            $data = $res;
	     }
	     $success = '操作成功';
	  }
      if(empty($error) || $error == 1){
		 if($error == 1){
            $data = $res;
	     }
	     $error = '操作失败';
	  }

	  if($res !== $parameter){
		 $this->success($success,$url,$data);	      
	  }
	  $this->error($error,$url,$data);
   }

   //删除
   protected function delete_low($table,$id,$idAll){
      return Db::name($table)->where($id,'in',$idAll)->delete();
   }

   //修改
   protected function update_low($table, $id=[],$data){
      return Db::name($table)->where($id)->update($data);
   }
   
   //添加
   protected function insert_low($table,$data){
      return Db::name($table)->insert($data);
   }
   
   protected function select_low($table,$where='',$mo=1,$field='*'){
	  if($mo == 1){
	     return Db::name($table)->field($field)->where($where)->select();
	  }else{
	     return Db::name($table)->field($field)->where($where)->find();
	  }
   }
   
   //删除所有cookie
   public function DeleteAllCookies()
   {
    foreach ($_COOKIE as $key => $value) {
        setcookie($key, null);
    }
	return true;
   }

   /**
     * 清除日志 
$path = glob(LOG_PATH . '*');
foreach ($path as $item) {
//dump(glob($item .DS. '*.log'));
array_map('unlink', glob($item . DS . '*.log'));
rmdir($item);
}
   **/
   function clear_cache(){
	    //需要清除redis在$value加上CACHE_PATH
        $values = "TEMP_PATH,LOG_PATH";
        $values = explode(",", $values);
        foreach ($values as $item) {
            if ($item == 'LOG_PATH') {
                $dirs = (array) glob(constant($item) . '*');
                foreach ($dirs as $dir) {
                    array_map('unlink', glob($dir . '/*.log'));
                }
				if(!is_array($dirs)){
				   array_map('rmdir', $dirs);
				}
            } else {
                array_map('unlink', glob(constant($item) . '/*.*'));
            }
        }
		//清除redis
        //Cache::clear();        
        //$this->success('清空成功');
		return true;
   }
}
?>