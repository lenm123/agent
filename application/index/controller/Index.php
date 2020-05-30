<?php
namespace app\index\controller;

use app\common\controller\Indexbase;
//首页
class Index extends Indexbase
{
				/*
				   八大板块之一
				*/
    public function choice()
    {
								$this->assign("active","index");
        return $this->fetch("index");
    }

    public function map()
				{
        return $this->fetch();
				}
}
