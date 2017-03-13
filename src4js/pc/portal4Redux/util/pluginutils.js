export function loginCheck(router) {
    $.ajax({
        url: "/wui/theme/ecology9/page/loginCheck.jsp",
        type: "POST",
        cache: false,
        async: true,
        dataType: "json",
        success: (data) => {
            if (!data.state) {
                router.push({pathname: '/'});
            }
        },
        error: () => {
            router.push({pathname: '/'});
        }
    });
}

// 加载插件
export function pluginLoad() {
    setTimeout(function () {
        $.ajax({
            url: "/wui/common/page/pluginManage.jsp",
            type: "POST",
            cache: false,
            async: true,
            dataType: "html",
            success: (data) => {
                $("head").append(data);
            },
            error: () => {
            }
        })
    }, 500);
}