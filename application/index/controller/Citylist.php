<?php
namespace app\index\controller;

use app\common\controller\Indexbase;
//PPTP线路
class Citylist extends Indexbase
{
				/*
				   八大板块之一
				*/
				public function choice()
				{
								$this->assign("active","citylist");
								return $this->fetch("index");
				}
}
