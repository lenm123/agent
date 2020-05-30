<?php
// +----------------------------------------------------------------------
// | ThinkPHP [ WE CAN DO IT JUST THINK ]
// +----------------------------------------------------------------------
// | Copyright (c) 2006~2018 http://thinkphp.cn All rights reserved.
// +----------------------------------------------------------------------
// | Licensed ( http://www.apache.org/licenses/LICENSE-2.0 )
// +----------------------------------------------------------------------
// | Author: liu21st <liu21st@gmail.com>
// +----------------------------------------------------------------------

return [
    '__pattern__' => [
        'name' => '\w+',
    ],
    '[hello]'     => [
        ':id'   => ['index/hello', ['method' => 'get'], ['id' => '\d+']],
        ':name' => ['index/hello', ['method' => 'post']],
    ],
				/** 菜单栏选项 **/
				//默认设置choice为首页
				//'/index' => ['Index/choice',['method' => 'get|post']],
				'/' => ['Index/choice',['method' => 'get|post']],
				'/package' => ['Package/choice',['method' => 'get|post']],
				'/download' => ['Download/choice',['method' => 'get|post']],
				'/citylist' => ['Citylist/choice',['method' => 'get|post']],
				'/usehelp' => ['Usehelp/choice',['method' => 'get|post']],
				/** 菜单栏选项 end **/
];
