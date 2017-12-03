module.exports.policies = {

    '*': false,

    ConnectionController: {
        "*": true,
    },

    UserController: {
        "*": "sessionAuth",
        create: true,
        resetPassword: true, //see README to see what needs to be done,
        validateEmail: true,
        resendConfirmation: true,
        uploadUserPicture: true,
        checkEmail: true
    },

    // LocationController: {
    //     "*": "sessionAuth",
    // },

    // PageController: {
    //     "*": "sessionAuth",
    //     "check": true,
    //     "getSite": true,
    //     "getSiteInfo": true,
    //     "getSiteData": true,
    // },

    // NotificationController: {
    //     "*": "sessionAuth",
    // },

    // HistoryController: {
    //     "*": "sessionAuth",
    // },

    // EntryController: {
    //     "*": "sessionAuth",
    //     create: true,
    //     reply: true,
    //     getQuestion: true,
    //     getComment: true,
    //     getReport: true,
    //     getEntry: true,
    //     searchEntry: true,
    // },

    // BugController: {
    //     "*": "sessionAuth",
    //     bugImg: true,
    // },

    // TrackersController: {
    //     "*": true,
    // },
    /** TODO Set to fase */
    TestController: true,
    BtrexController: true,
    /** TODO End set to false */

};
