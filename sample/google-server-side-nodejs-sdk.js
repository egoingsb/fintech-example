var http = require('http');
var url = require('url');
var fetch = require('node-fetch');
var formData = require('form-data');
var googleCredential = require('./google-credential.json');
var httpServer = http.createServer(function (req, res) {
    var pathname = url.parse(req.url).pathname;
    if (pathname === '/') {
        res.write(`
            <html>
                <body>
                    <a href="https://accounts.google.com/o/oauth2/v2/auth?scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fcalendar&access_type=offline&include_granted_scopes=true&state=state_parameter_passthrough_value&redirect_uri=http%3A%2F%2Foauth4u.tk%3A8080%2Fgoogle-nodejs-callback&response_type=code&client_id=228386482034-5phqabbcv9bes20608gms98qh7mp8jj9.apps.googleusercontent.com">login with Google</a>
                </body>
            </html>
        `);
    } else if(pathname === '/google-nodejs-callback') {
        var query = url.parse(req.url, true).query;
        var formParam = new url.URLSearchParams();
        formParam.append('client_id', googleCredential.web.client_id);
        formParam.append('client_secret',googleCredential.web.client_secret);
        formParam.append('redirect_uri','http://oauth4u.tk:8080/google-nodejs-callback'); // authorization code를 받는 주소와 access token을 받는 주소가 다르면 오류가 발생한다.  
        formParam.append('grant_type','authorization_code');
        formParam.append('code',query.code);
        fetch('https://www.googleapis.com/oauth2/v4/token',{
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body:formParam,
            method:'POST'
        }).then(function(response){
            return response.json();
        }).then(function(result){
            console.log('access_token',result.access_token);
        });
    }
    res.end();
});
httpServer.listen(8080);    