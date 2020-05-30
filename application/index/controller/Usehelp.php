<?php
namespace app\index\controller;

use app\common\controller\Indexbase;
//使用帮助
class Usehelp extends Indexbase
{
				/*
				   八大板块之一
				*/
				public function choice()
				{
								$this->assign("active","usehelp");
								return $this->fetch("index");
				}

}
