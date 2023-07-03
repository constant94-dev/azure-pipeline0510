/*
* config_url : 지니용
* cookieDomain : Cookies domain
* defaultDomain, enDomain, jaDomain : black 페이지 url
*/

var ser_type;
var config_url;
var cookieDomain;
var defaultDomain;
var enDomain;
var jaDomain;
//TODO 배포시 체크
ser_type = 'developed';
if(ser_type == 'main'){
	config_url = 'https://tvpatron.com/';
	cookieDomain = '.tvpatron.com';
	defaultDomain = 'https://tvpatron.com/ko';
	enDomain = 'https://tvpatron.com/en';
	jaDomain = 'https://tvpatron.com/ja';
}else if(ser_type == 'developed'){
	config_url = location.origin + '/';
	cookieDomain = '';
	defaultDomain = location.origin + '/ko';
	enDomain = location.origin + '/en';
	jaDomain = location.origin + '/ja';
}

