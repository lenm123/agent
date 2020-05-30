function popUp(n) {
    var t = $(window.top.document).find('[data-role="dialog-page"]')
      , i = t.find("iframe");
    i.attr("src", $(n).attr("data-detail-link"));
    t.show()
}
function canclePopUp() {
    var n = $(window.parent.document).find(".popupBackground");
    n.hide();
    n.find("iframe").attr("src", "")
}
function isCurrentPage(n) {
    var t = location.href;
    return new RegExp(n).test(t)
}
function mobileLength(n) {
    return /^\d{11}$/.test(n)
}
function emailCheck(n) {
    return !n ? !1 : /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(n)
}
function inputErrorMessage(n, t) {
    var r = '<div id="inputErrorTip">' + t + "<\/div>", i;
    window.tipTimeout = null;
    i = n.parent().find("#inputErrorTip");
    i.length >= 1 && i.remove();
    n.after(r);
    window.setTimeout(function() {
        n.parent().find("#inputErrorTip").remove()
    }, 5e3);
    return
}
function displayLoading(n, t, i) {
    i = i || "__progressbar__";
    var u = '<div class="UpdateProgressBar" id="' + i + '"><div><img src="/web_portal_newVersion/imgs/loading.gif" class="loading" /><img src="/web_portal_newVersion/imgs/trust.png" class="trust" /><div style="color:white;">' + (n || "") + "<\/div><\/div><\/div>", f = window.location.href.indexOf("target=MobileApply") >= 0, r;
    r = f ? $(window.top.document).find("#mobileApply") : $(window.top.document).find("#applyPopUp");
    r.find("#" + i).length || (t ? r.parents("body").append(u) : r.find(".applyTable").append(u))
}
function getImageCode() {
    $("#vetifyCode").attr("src", "/Home/GetVerifyImg/?random=" + Math.random())
}
function initMap() {
    createMap();
    setMapEvent();
    addMapControl();
    addMarker()
}
function createMap() {
    var t = new BMap.Map("map"), n = "", i;
    $(".location-icon").hasClass("selected") && (n = $(".selected").data("point"));
    i = new BMap.Point(n.split(",")[0],n.split(",")[1]);
    t.centerAndZoom(i, 17);
    window.map = t
}
function setMapEvent() {
    map.enableDragging();
    map.enableScrollWheelZoom();
    map.enableDoubleClickZoom();
    map.enableKeyboard()
}
function addMapControl() {
    var t = new BMap.NavigationControl({
        anchor: BMAP_ANCHOR_TOP_LEFT,
        type: BMAP_NAVIGATION_CONTROL_LARGE
    }), n;
    map.addControl(t);
    n = new BMap.ScaleControl({
        anchor: BMAP_ANCHOR_BOTTOM_LEFT
    });
    map.addControl(n)
}
function addMarker() {
    for (var u = $(".selected").data("point"), f = $(".add-detail").text(), n, t = 0; t < markerArr.length; t++) {
        n = markerArr[t];
        n.point = u;
        n.content = f;
        var e = n.point.split(",")[0]
          , o = n.point.split(",")[1]
          , s = new BMap.Point(e,o)
          , h = createIcon(n.icon)
          , r = new BMap.Marker(s,{
            icon: h
        })
          , c = createInfoWindow(t)
          , i = new BMap.Label(n.title,{
            offset: new BMap.Size(n.icon.lb - n.icon.x + 10,-20)
        });
        r.setLabel(i);
        map.addOverlay(r);
        i.setStyle({
            borderColor: "#808080",
            color: "#333",
            cursor: "pointer"
        }),
        function() {
            var e = t
              , u = createInfoWindow(t)
              , f = r;
            f.addEventListener("click", function() {
                this.openInfoWindow(u)
            });
            u.addEventListener("open", function() {
                f.getLabel().hide()
            });
            u.addEventListener("close", function() {
                f.getLabel().show()
            });
            i.addEventListener("click", function() {
                f.openInfoWindow(u)
            });
            !n.isOpen || (i.hide(),
            f.openInfoWindow(u))
        }()
    }
}
function createInfoWindow(n) {
    var t = markerArr[n];
    return new BMap.InfoWindow("<b class='iw_poi_title' title='" + t.title + "'>" + t.title + "<\/b><div class='iw_poi_content'>" + t.content + "<\/div>")
}
function createIcon(n) {
    return new BMap.Icon("/web_portal_newVersion/imgs/mapcircle.png",new BMap.Size(n.w,n.h))
}
function showInfo() {
    initMap()
}
var param, container, txtTrue = !1, cheTrue = !1, ua = navigator.userAgent.toLowerCase(), isWechat = ua.match(/MicroMessenger/i) == "micromessenger", markerArr;
$(function() {
    function n() {
        for (var r = navigator.userAgent, t = ["Android", "iPhone", "SymbianOS", "Windows Phone"], i = !0, n = 0; n < t.length; n++)
            if (r.indexOf(t[n]) > 0) {
                i = !1;
                break
            }
        return i
    }
    var t = n();
    t || $("#application").parents("body").find(".footer").hide();
    $("#application_mes input").keyup(function() {
        var n = 0;
        container = $(window.top.document).find("#application_mes");
        param = container.find("[data-param]");
        $.each(param, function() {
            var t = $.trim($(this).val()) != "";
            $(this).attr("data-required") && t && (n += 1)
        });
        n == container.find("[data-required]").length ? (txtTrue = !0,
        cheTrue && txtTrue ? $("#submitApply").removeClass("disable") : $("#submitApply").addClass("disable")) : (txtTrue = !1,
        cheTrue && txtTrue ? $("#submitApply").removeClass("disable") : $("#submitApply").addClass("disable"))
    });
    $(".application_content input[name='customerType']").click(function() {
        var n = $("#application_content input:checkbox[name=customerType]:checked").length;
        n > 0 && (cheTrue = !0,
        cheTrue && txtTrue ? $("#submitApply").removeClass("disable") : $("#submitApply").addClass("disable"))
    });
    $("#submitApply").unbind("click").bind("click", function() {
        var f = $("#applyPopUp"), n = $(f).find(".application_mes"), e = n.find("[data-param]"), t = {}, i, r, u;
        $(this).hasClass("disable") || (i = [],
        n.find('[name="customerType"]:checked').each(function() {
            i.push($(this).val())
        }),
        r = n.find('[data-param="phone"]'),
        u = n.find('[data-param="email"]'),
        mobileLength(r.val()) || inputErrorMessage(r, "手机格式错误"),
        emailCheck(u.val()) || inputErrorMessage(u, "邮件格式格式错误"),
        $.each(e, function() {
            t[$(this).attr("data-param")] = $.trim($(this).val()) || ""
        }),
        isWechat && (t.from = "第三方平台"),
        n.find("#inputErrorTip").length >= 1) || (t.BusinessScope = i.join().replace(/,/g, "、"),
        displayLoading("正在提交,请稍候...", !0),
        $.ajax({
            url: "/Home/SubmitApply/",
            type: "post",
            contentType: "application/json",
            data: JSON.stringify(t),
            success: function(t) {
                t && (f.parents("body").find("#__progressbar__").remove(),
                t.retCode == "-10" || t.retCode == "-1" ? (inputErrorMessage(n.find("#vetifyCodeInput"), "验证码错误"),
                getImageCode()) : $(document.body).find("#application").html(t))
            }
        }))
    });
    $(function() {
        var n = $("#Index .flexslider:eq(0) li img")
          , t = function() {
            var i = $("#Index .flexslider:eq(0) .flex-active-slide"), t, r, u;
            for (n.css("display", "block"),
            i.find(".left").css("display", "block"),
            t = 0; t < 3; t++)
                r = $(i.find("img"))[t],
                u = "imgAnimation_kv" + (t + 1),
                $(r).addClass(u);
            i.find(".left").addClass("textAnimation")
        }
          , i = function() {
            var t = $("#Index .flexslider:eq(0) .flex-active-slide .left");
            t.removeClass("textAnimation");
            t.css("display", "none");
            n.css("display", "none");
            $(n).attr("class", "")
        };
        window.slider = $("#Index .flexslider:eq(0)").flexslider({
            animation: "fade",
            pauseOnAction: !1,
            pauseInvisible: !1,
            pauseOnHover: !0,
            directionNav: !1,
            animationLoop: $("#Index .flexslider:eq(0) .slides li").length > 1,
            slideshowSpeed: 4e3,
            animationSpeed: 100,
            before: function() {
                i()
            },
            after: function() {
                t()
            }
        })
    });
    $(".page-tab .first-menu>li").hover(function() {
        var n = this.id;
        $("#" + n).find("ul").hasClass("second-menu") && $("#" + n).find(".second-menu").stop().slideDown(300);
        $("#" + n).find(".text").css("color", "#219ed9")
    }, function() {
        $(".second-menu").stop().slideUp(300);
        $(".text").css("color", "#fff")
    });
    $(".page-tab .first-menu>li").unbind("click").bind("click", function() {
        $(this).index() != 4 && $(this).addClass("active").siblings("li").removeClass("active")
    });
    $("#ballRotation .ballArea .ball").hover(function() {
        $("#Solution .autobiographyArea").addClass("animationPaused")
    }, function() {
        $("#Solution .autobiographyArea").removeClass("animationPaused")
    });
    $("#ballRotation .ballArea .ball").unbind("click").bind("click", function() {
        $("#ballRotation .ballArea>.ball").removeClass("active");
        $(this).addClass("active");
        $("#Solution .autobiographyArea").addClass("animationPaused");
        $("#Solution .ballDetail").show();
        var n = $(this).attr("data-index") * 1
          , t = ".detail" + n;
        $("#Solution .ballDetail").find(t).addClass("active").siblings().removeClass("active")
    })
});
$(function() {
    $("#productionAndService .productionLists >li").hover(function() {
        var i = $(this), r = $(i).attr("index"), t = $("#productionAndService .productionLists >li"), n;
        for ($(i).removeClass("liNoHover"),
        n = 0; n < t.length; n++)
            n > r * 1 ? $(t[n]).addClass("liNoHover") : $(t[n]).removeClass("liNoHover")
    }, function() {
        $("#productionAndService .productionLists li").removeClass("liNoHover")
    });
    $("#logo_box img").hover(function() {
        var n = $(this).attr("src")
          , t = n.split("/")
          , i = t[t.length - 1]
          , r = "h_" + t[t.length - 1];
        n = n.replace(i, r);
        $(this).attr("src", n)
    }, function() {
        var t = $(this).attr("src"), n = t.split("/"), i = n[n.length - 1], r;
        n = i.split("h_");
        r = n[n.length - 1];
        t = t.replace(i, r);
        $(this).attr("src", t)
    });
    $("#Index .flexslider:eq(1)").flexslider({
        animation: "slide",
        prevText: "Previous",
        nextText: "Next",
        slideshow: !0,
        pauseOnHover: !0,
        controlNav: !1,
        directionNav: !0,
        slideshowSpeed: 5e3,
        animationSpeed: 800
    })
});
$(function() {
    var t = $(window).height()
      , n = n = $(document).scrollTop();
    window.onscroll = function() {
        n = $(document).scrollTop();
        $(".productContent .children .longitudinal").each(function() {
            var i = $(this).offset().top;
            n >= i - t && ($(this).children(".comeFormRight").animate({
                left: "55%"
            }, 1e3),
            $(this).children(".comeFormLeft").animate({
                left: "12%"
            }, 1e3))
        });
        try {
            var i = $(".flexibleAccess .main").offset().top;
            n >= i - t && ($(".flexibleAccess .main img").animate({
                top: "0"
            }, 1e3),
            setTimeout(function() {
                $(".flexibleAccess .flexbox").fadeIn(500)
            }, 1e3))
        } catch (r) {
            return !1
        }
    }
    ;
    $(".productContent .children .longitudinal").each(function() {
        var i = $(this).offset().top;
        n >= i - t && ($(this).children(".comeFormRight").animate({
            left: "55%"
        }, 1e3),
        $(this).children(".comeFormLeft").animate({
            left: "12%"
        }, 1e3))
    })
});
$(function() {
    function n(n) {
        switch (n) {
        case "sh":
            $(".add-detail").text("上海市长宁区江苏路369号兆丰世贸大厦19楼G座");
            break;
        case "sz":
            $(".add-detail").text("深圳市南山区科苑中路8号迅美科技广场1号楼6楼6203室");
            break;
        case "bj":
            $(".add-detail").text("北京市海淀区丹棱街1号院1号楼3层306室")
        }
    }
    $(".more .txt").hover(function() {
        $(this).parents(".timeLine-date").addClass("active")
    }, function() {
        $(this).parents(".timeLine-date").removeClass("active")
    });
    $(".sh").on("click", function() {
        n("sh");
        $(this).addClass("active").parent().addClass("selected").siblings().removeClass("selected").children(".city").removeClass("active");
        $(this).siblings(".city-title").addClass("city-hover").parent().siblings().children(".city-title").removeClass("city-hover");
        showInfo()
    });
    $(".sz").on("click", function() {
        n("sz");
        $(this).addClass("active").parent().addClass("selected").siblings().removeClass("selected").children(".city").removeClass("active");
        $(this).siblings(".city-title").addClass("city-hover").parent().siblings().children(".city-title").removeClass("city-hover");
        showInfo()
    });
    $(".bj").on("click", function() {
        n("bj");
        $(this).addClass("active").parent().addClass("selected").siblings().removeClass("selected").children(".city").removeClass("active");
        $(this).siblings(".city-title").addClass("city-hover").parent().siblings().children(".city-title").removeClass("city-hover");
        showInfo()
    })
});
$(function() {
    $(".childDl dl").hover(function() {
        $(this).addClass("dlHover").siblings("dl").removeClass("dlHover");
        $(this).children("dd").addClass("dlHoverDd");
        $(this).siblings("dl").children("dd").removeClass("dlHoverDd");
        $(this).parents(".childDl").siblings(".childDl").children("dl").removeClass("dlHover");
        $(this).parents(".childDl").siblings(".childDl").children("dl").children("dd").removeClass("dlHoverDd");
        $(this).attr("id") == "c111" ? $(this).children(".imgContent").css("background-position", "-570px -150px ") : $(this).attr("id") == "c222" ? $(this).children(".imgContent").css("background-position", "10px -150px") : $(this).attr("id") == "c333" ? $(this).children(".imgContent").css("background-position", "-380px -150px") : $(this).attr("id") == "c444" ? $(this).children(".imgContent").css("background-position", "-178px -150px") : $(this).attr("id") == "c555" ? $(this).children(".imgContent").css("background-position", "-785px -140px") : $(this).attr("id") == "c666" && $(this).children(".imgContent").css("background-position", "-980px -150px");
        $(this).children(".imgContent").show();
        $(this).siblings("dl").children(".imgContent").hide();
        $(this).parent().siblings(".childDl").children("dl").children(".imgContent").hide()
    })
});
$(function() {
    $(".flexibleAccess .flexbox").mouseenter(function() {
        $(this).children("div").children(".box").animate({
            top: "28px"
        }, 100, function() {
            $(this).animate({
                top: "30px"
            }, 100)
        });
        $(this).css({
            "background-color": "rgba(33,157,233,0.2)",
            border: "2px dashed rgba(33,157,233,1)"
        })
    }).mouseleave(function() {
        $(this).css({
            "background-color": "",
            border: "2px dashed rgba(33,157,233,0.5)"
        })
    });
    $(".flexibleAccess .flexbox div").mouseenter(function() {
        return !1
    });
    $(".advantage .mouseHover").mouseover(function() {
        $(this).siblings(".title").css("color", "#fff");
        $(this).siblings(".cont").css("color", "#fff");
        $(this).parent(".tage1").css("background-position", "-423px -42px");
        $(this).parent(".tage2").css("background-position", "-423px -450px");
        $(this).parent(".last").css("background-position", "-423px -863px")
    }).mouseout(function() {
        $(this).siblings(".title").css("color", "#219ed9");
        $(this).siblings(".cont").css("color", "#838383");
        $(this).parent(".tage1").css("background-position", "-35px -42px");
        $(this).parent(".tage2").css("background-position", "-35px -450px");
        $(this).parent(".last").css("background-position", "-35px -863px")
    });
    $(".advantage .tage .mouseHover .top").mouseover(function() {
        return !1
    });
    $(".advantage .tage .mouseHover .left").mouseover(function() {
        return !1
    });
    $(".advantage .tage .mouseHover .bottom").mouseover(function() {
        return !1
    });
    $(".advantage .tage .mouseHover .right").mouseover(function() {
        return !1
    })
});
$(function() {
    var n = function() {
        var n = navigator.userAgent
          , t = n.indexOf("MSIE") > -1
          , i = t ? /\d+/.exec(n.split(";")[1]) : "no ie";
        return i < 8
    }();
    n && ($(".mask").show(),
    $("html").css({
        "overflow-x": "hidden",
        "overflow-y": "hidden"
    }),
    $("body").css({
        "overflow-x": "hidden",
        "overflow-y": "hidden"
    }))
});
$(function() {
    var n = window.location.href;
    index = n.indexOf("AboutUs");
    index != -1 && initMap()
});
markerArr = [{
    title: "",
    content: "",
    point: "",
    isOpen: 0,
    icon: {
        w: 16,
        h: 12,
        l: 46,
        t: 21,
        x: 9,
        lb: 12
    }
}];
window.theLocation = function() {
    var n, t;
    map.clearOverlays();
    n = "";
    $(".location-icon").hasClass("selected") && (n = $(".selected").data("point"));
    t = new BMap.Point(n.split(",")[0],n.split(",")[1]);
    map.panTo(t);
    addMarker()
}
;
$(function() {
    var n = "";
    $(window).scroll(function() {
        var n = $(window).scrollTop();
        n > 300 ? $("#backTop").show() : $("#backTop").hide()
    });
    $("#backTop").click(function() {
        n = setInterval(function() {
            $(window).scrollTop($(window).scrollTop() - 1e3);
            $(window).scrollTop() <= 0 && clearInterval(n)
        }, 1)
    })
})
