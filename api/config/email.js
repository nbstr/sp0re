//TODO set creds(auth) and from variable to send emails
module.exports.email = {
    from: 'hey@hey-hey.co',
    // to: 'nab.kml@gmail.com',
    // subject: 'Welcome to blooper',
    testMode: false,
    // alwaysSendTo: 'nabil.kamel@m4ke.it',
    transporter: {
        host: 'ssl0.ovh.net',
        name: 'smtp.hey-hey.co',
        auth: {
            user: 'hey@hey-hey.co',
            pass: 'M7XAC3@A(9'
        },
        port: 465,
        secure: true,
        debug: true
    }
};
