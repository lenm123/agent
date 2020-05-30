<?php
namespace app\admin\model;
use \think\Model;
use \think\Db;
class administrators extends Model{
  
   function find($id){
      $res=$this->where('ai_id','=',$id)->find()->toArray();
	  if($res == false){
	     return false;
	  }
	  return $res;
   }
}
?>