module.exports = function(req){
    'use strict'
    let session = req.session,
        ip = req.headers['x-forwarded-for'],
        ips = req.session.ips || [];
    
    if(!ips[ip]){
        ips[ip] = true;
        req.session.ips = ips;
    }
    return req;
}