let adminId = localStorage.getItem('patronAdminId');
let adminToken = localStorage.getItem('patronAdminToken');
const id = document.getElementById('admin_id')
const password = document.getElementById('admin_password')

const homeRun = () => {
    $.ajax({
        type: "get",
        url: '/homerun',
        dataType: "json",
        contentType: "application/json;charset=UTF-8",
        headers: {
            'Authorization': adminToken
        },
        success: function(data){

        },
        error: function (request, status, error) {
            console.log("code = " + request.status + " message = " + request.responseText + " error = " + error);            alert('이메일주소와 비밀번호를 확인해주세요')
        },

    }).done(function (data) {
        //    1
        location.href = '/home'
    })
}
const adminLogin = () => {
    $.ajax({
        type: "POST",
        url: '/authenticate',
        dataType: "json",
        contentType: "application/json;charset=UTF-8",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        data: JSON.stringify({
            "username" : id.value,
            "password" : password.value
        }),
        error: function (request, status, error) {
            console.log("code = " + request.status + " message = " + request.responseText + " error = " + error);            alert('이메일주소와 비밀번호를 확인해주세요')

        },

    }).done(function (data) {
        localStorage.setItem('patronAdminId', data.email);
        localStorage.setItem('patronAdminToken', data.token);
        //auth(data.token)
        homeRun()
    })
}