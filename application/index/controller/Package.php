<?php
namespace app\index\controller;

use app\common\controller\Indexbase;
//套餐购买
class Package extends Indexbase
{
				/*
				   八大板块之一
				*/
				public function choice()
				{
								$this->assign("active","package");
								return $this->fetch("index");
				}
}
