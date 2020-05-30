<?php
// +----------------------------------------------------------------------
// | 公共控制模块
// +----------------------------------------------------------------------
namespace app\common\controller;

class Base extends \think\Controller{
   function _empty(){
      $this->error("该页面不存在！");
   }
}
?>