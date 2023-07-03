var ipAddress;

//deviceID, deviceName, provider setting
$.ajax({
    url: '/api/device-data',
    type: 'post',
    dataType: 'json',
    data: {},
    error: function (error) {
    },
    success: function (data) {
        document.getElementById('deviceId').innerText == '' ? document.getElementById('deviceId').innerText = data['deviceId'] : '';
        document.getElementById('deviceName').innerText == '' ? document.getElementById('deviceName').innerText = data['deviceName'] : '';
        document.getElementById('provider').innerText == '' ? document.getElementById('provider').innerText = data['modelType'] : '';
        //TODO 배포전

        if (data['deviceName'] == null || data['deviceName'] == '') {
            location.href = 'https://tvpatron.com' + '/smartTvLogin?duid=' + giga_DevId + '&deviceName=' + giga_DevType + '&provider=Kt';
        }
    }
})

//home에서 이전버튼으로 다시 login페이지에 왔을때
//kt일때 최초로 회원가입,로그인 한 후 뒤로가기로 conf
var checkFirstSignup = sessionStorage.getItem('checkFirstSignup');
if (checkFirstSignup) {
    gigagenie.voice.svcFinished()
}
$.ajax({
    url: '/api/country-code',
    method: 'post',
    data: {},
    success: function (e) {
        ipAddress = e.toUpperCase();
        if (urlLanguage != '/ko' && urlLanguage != '/en' && urlLanguage != '/ja') {
            switch (ipAddress) {
                case 'KR':
                    urlLanguage = '/ko';
                    break
                case 'JP':
                    urlLanguage = '/ja';
                    break
                default:
                    urlLanguage = '/en';
                    break
            }
        }

        Cookies.remove('ownerAddress');
        Cookies.remove('sKlaytnLength');
        Cookies.remove('sKlaytnLength');
        Cookies.remove('klipdrops');
        $.ajax({
            url: '/advertisement?name=tvOngoingEvent',
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                if (Cookies.get('promotion') != data.file.toString()) {
                    Cookies.remove('promotion');
                }
            }
        })
        setTimeout(function () {
            provider = document.getElementById('provider').innerText;
            deviceId = provider == 'kt' ? giga_DevId : document.getElementById('deviceId').innerText;
            deviceName = provider == 'kt' ? giga_DevType : document.getElementById('deviceName').innerText;

            Cookies.remove('deviceId');
            Cookies.remove('deviceName');
            Cookies.remove('provider');

            Cookies.set('deviceId', deviceId, {
                domain: cookieDomain
            });
            Cookies.set('deviceName', deviceName, {
                domain: cookieDomain
            });
            Cookies.set('provider', provider, {
                domain: cookieDomain
            });

            setTimeout(function () {
                $.ajax({
                    url: '/login/check-status',
                    type: 'post',
                    dataType: 'text',
                    data: {
                        deviceId: deviceId,
                        deviceName: deviceName,
                        provider: provider,
                    },
                    success: function (email) {
                        if (email == '') {
                            Cookies.set('searchKeywordArray', '');
                            location.href = urlLanguage + '/home';
                        } else {
                            $.ajax({
                                url: '/session',
                                type: 'post',
                                contentType: 'application/json',
                                data: JSON.stringify({
                                    email: email,
                                    deviceId: deviceId
                                }),
                                success: function (result) {
                                    urlLanguage = '/' + result;
                                    if (document.getElementById('provider').innerText == 'lg') {
                                        if (localStorage.getItem('lgLogin') == null) {
                                            $.ajax({
                                                url: '/login/logout',
                                                type: 'post',
                                                dataType: 'json',
                                                error: function (error) {
                                                },
                                                success: function (data) {
                                                    Cookies.remove('klipdrops');
                                                    Cookies.remove('ownerAddress');
                                                    Cookies.remove('sKlaytnLength');
                                                    Cookies.remove('language');
                                                    Cookies.remove('prevSound');
                                                    Cookies.remove('searchKeywordArray');
                                                    localStorage.setItem('lgLogin', 'true')
                                                    setTimeout(function () {
                                                        location.href = location.pathname.replace(/^\/(en|ko|ja)\//, urlLanguage + '/') + location.search;

                                                    }, 1000)
                                                }
                                            });
                                        } else {
                                            localStorage.setItem('lgLogin', 'true')
                                            if (result != '') {
                                                urlLanguage = '/' + result;
                                                location.href = urlLanguage + '/home';
                                            } else {
                                                exitPatron();
                                            }
                                        }
                                    } else {
                                        if (result != '') {
                                            urlLanguage = '/' + result;
                                            location.href = urlLanguage + '/home';
                                        } else {
                                            exitPatron();
                                        }
                                    }
                                }
                            });
                        }
                    }
                });
            }, 1000)
        }, 1000)
    }
});