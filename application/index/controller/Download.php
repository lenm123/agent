<?php
namespace app\index\controller;

use app\common\controller\Indexbase;
//软件下载
class Download extends Indexbase
{
				/*
				   八大板块之一
				*/
				public function choice()
				{
								$this->assign("active","download");
								return $this->fetch("index");
				}

}
