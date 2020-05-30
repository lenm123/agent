<?php
namespace app\admin\controller;
use \think\Db;
use app\common\controller\Adminbase;
class Main extends Adminbase{
   //首页
   function home(){
	  /*
	  你好，我叫袁周成，湖南郴州人，今年17岁，我应聘的是php后台开发工程师一职，在学校学习php已有三年时间，期间开发过例如电子商城、小说网、个人博客等系统。并在期间担任过学习小组组长和副班长等职位，对自己这一次面试很有信心。
	  
	  问题1: 什么新技术是你们未来希望采用的?
	  遇到不会回答的问题:不好意思，这个单词/意思我忘了.
	  */
	  //php_sapi_name
/*for ($i=1; $i<20; $i++)
{
echo "<font size='10' color='red'>".$i."</font>";
echo '<br>';
ob_flush();
flush();
sleep(1);
}
ob_end_flush();
*/
	  $role = $this->select_low("role",['ro_id'=>$this->name['ro_id']],0);
      $config = $this->select_low("configure",'');
	  $data = [];
	  foreach($config as $k=>$v){
	     $data[$v['k']] = $v['v'];
	  }
      return $this->fetch('home',['name'=>$this->name,'role'=>$role,'sys_info'=>$this->get_sys_info(),'config'=>$data]);
   }

   
   //phpinfo信息 按需显示在前台
   public function get_sys_info()
   {
      $sys_info['os'] = PHP_OS; //操作系统
	  $sys_info['sapi'] = php_sapi_name();
      $sys_info['ip'] = GetHostByName($_SERVER['SERVER_NAME']); //服务器IP
      $sys_info['web_server'] = $_SERVER['SERVER_SOFTWARE']; //服务器环境
      $sys_info['phpv'] = phpversion(); //php版本
      $sys_info['fileupload'] = @ini_get('file_uploads') ? ini_get('upload_max_filesize') : 'unknown'; //文件上传限制
      //$sys_info['memory_limit'] = ini_get('memory_limit'); //最大占用内存
      $sys_info['set_time_limit'] = function_exists("set_time_limit") ? true : false; //最大执行时间
      //$sys_info['zlib'] = function_exists('gzclose') ? 'YES' : 'NO'; //Zlib支持
      //$sys_info['safe_mode'] = (boolean) ini_get('safe_mode') ? 'YES' : 'NO'; //安全模式
      //$sys_info['timezone'] = function_exists("date_default_timezone_get") ? date_default_timezone_get() : "no_timezone";
      //$sys_info['curl'] = function_exists('curl_init') ? 'YES' : 'NO'; //Curl支持
      //$sys_info['max_ex_time'] = @ini_get("max_execution_time") . 's';
      $sys_info['domain'] = $_SERVER['HTTP_HOST']; //域名
      $sys_info['remaining_space'] = round((disk_free_space(".") / (1024 * 1024)), 2) . 'M'; //剩余空间
      //$sys_info['user_ip'] = $_SERVER['REMOTE_ADDR']; //用户IP地址
      //$sys_info['beijing_time'] = gmdate("Y年n月j日 H:i:s", time() + 8 * 3600); //北京时间
      $sys_info['time'] = date("Y年n月j日 H:i:s"); //服务器时间
      //$sys_info['web_directory'] = $_SERVER["DOCUMENT_ROOT"]; //网站目录
      $mysqlinfo = Db::query("SELECT VERSION() as version");
      $sys_info['mysql_version'] = $mysqlinfo[0]['version'];
      if (function_exists("gd_info")) {
         //GD库版本
         $gd = gd_info();
         $sys_info['gdinfo'] = $gd['GD Version'];
      } else {
         $sys_info['gdinfo'] = "未知";
      }
      return $sys_info;
   }
}
?>