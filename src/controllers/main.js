let fs = require('fs');
module.exports = {
    motd: function(req, res){
        let motd=fs.readFileSync('public/motd.txt').toString()
        res.render('main', {appTitle: 'MOTD', loggedIn: true,role: req.session.role, motd: motd});
    }
}