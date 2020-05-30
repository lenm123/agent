
jQuery(document).ready(function() {
	var variable=0;
    window.handle=function(arr){
       
	    if( arr.status == 'ok' ){
	   	    setTimeout(function(){
		        layer.msg('<p style="color:black;">'+arr.error+'</p>',{icon:1,time:20000});
		    },'100');
            setTimeout(function(){
	            location.href="/admin.php/Admin";
		    },'1500');
	    }else if( arr.status == 'no' ){
			variable=0;
		    setTimeout(function(){
		        layer.msg('<p style="color:black;">'+arr.error+'</p>',{icon:2,time:1000});
		    },'200');
	    }else{
			variable=0;
		    setTimeout(function(){
		        layer.msg('<p style="color:black;">'+arr.error+'</p>',{icon:2,time:1000});
		    },'200');
	    }
	}   
        
    $('.page-container form').submit(function(){
        var username = $(this).find('.username').val();
        var password = $(this).find('.password').val();
        if(username == '') {
            $(this).find('.error').fadeOut('fast', function(){
                $(this).css('top', '27px');
            });
            $(this).find('.error').fadeIn('fast', function(){
                $(this).parent().find('.username').focus();
            });
            return false;
        }
        if(password == '') {
            $(this).find('.error').fadeOut('fast', function(){
                $(this).css('top', '96px');
            });
            $(this).find('.error').fadeIn('fast', function(){
                $(this).parent().find('.password').focus();
            });
            return false;
        }
		if(variable) {
            return false;
		}
		variable=1;
		layer.msg('<p style="color:black;">正在提交</p>',{icon:16,time:200000});
    });

    $('.page-container form .username, .page-container form .password').keyup(function(){
        $(this).parent().find('.error').fadeOut('fast');
    });

});
