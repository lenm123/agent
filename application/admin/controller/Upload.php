<?php
namespace app\admin\controller;
use \think\Controller;

class upload extends Controller{
    function index(){
       $date = str_replace("-","",date('Y-m-d'));
	   $temporary = "upload/temporary";//临时图片目录
       $file_name = $_FILES['file']['name'];//获取缓存区图片,格式不能变
       $type = array("jpg", "gif", 'png', 'bmp', 'jpeg');//允许选择的图片类型
       $ext = explode(".", $file_name);//拆分获取图片名
       $ext = $ext[count($ext) - 1];//取图片的后缀名
       if (in_array($ext,$type)){
		  
		  if( !is_dir($temporary) ){
		     mkdir($temporary, 0700);
		  }
		  if( !is_dir($temporary.'/'.$date) ){
		     mkdir($temporary.'/'.$date, 0700);
		  }

          do{
             $new_name = $this->get_file_name(6).'.'.$ext;
             $path = $temporary.'/'.$date.'/'.$new_name;//upload为目标文件夹
          }while (file_exists($path));//检查图片是否存在文件夹，存在返回ture,否则false
          $temp_file=$_FILES['file']['tmp_name'];//获取服务器里图片

		  //移动临时文件到目标路径
          if (move_uploaded_file($temp_file,$path)){
             $arr['flag'] = 1;
             $arr['detail'] = [$path];
			 $arr['code'] = 0;
			 $arr['msg'] = '';
			 $arr['data'] = [];
			 $arr['data']['src'] = '/'.$path;
          }else{ 
			 //文件移动失败
             $arr['flag']=2;
          }
       }else{
		  //文件格式不正确
          $arr['flag']=3;
       }
       echo json_encode($arr);
	}

	public function get_file_name($len){//获取一串随机数字，用于做上传到数据库中文件的名字
	   $new_file_name = 'A_';
       $chars = "1234567890qwertyuiopasdfghjklzxcvbnm";//随机生成图片名
       for ($i = 0; $i < $len; $i++) {
          $new_file_name .= $chars[mt_rand(0, strlen($chars) - 1)];
       }
       return $new_file_name.time();
	}

	public function upload_img($data){
	   /*将图片存入正式区*/
	     if(!is_array($data)){
		    $data = explode(",",$data);
		 }
         $date = str_replace("-","",date('Y-m-d'));
		 $temporary = 'upload/img';//图片目录
		 $a = ''; //存储临时img名
		 $arr = []; 
		 foreach($data as $k=>$v){
			   $varibate = 0;
			   $x_data = $data[$k];
			   $compare = 3;
			   //若传入的图片地址第一个字符是“/”则需要匹配4次
			   if($x_data[0] == '/'){
			      $compare = 4;
			   }
			   for($j=0; $j<strlen($x_data); $j++){
			      if($x_data[$j] == '/'){
			         $varibate++;
				     if($varibate == $compare){
						//从$j+1开始截取
				        $a = substr($x_data, $j+1);
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
			   //判断文件是否存在
			   if(file_exists($path)){
				  //图片已存在
			      $ext = explode(".", $x_data);//拆分获取图片名
                  $ext = $ext[count($ext) - 1];//取图片的后缀名
			      do{
                     $new_name = $this->get_file_name(6).'.'.$ext;
                     $path = $temporary.'/'.$date.'/'.$new_name;//upload为目标文件夹
                  }while (file_exists($path));
                  if(copy(trim($x_data,'/'),$path)){
				     $arr[] = $path;
                  }else{
				     $this->error("图片上传失败！");
			      }
               }else{
			      if(copy(trim($x_data,'/'),$path)){
				     $arr[] = $path;
                  }else{
				     $this->error("图片上传失败！");
			      }
			   }
		 }
		 if(empty($arr)){
		    $this->error("图片上传失败！");
		 }
		 return $arr;
	}

}
?>