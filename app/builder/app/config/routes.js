//  █████╗ ██████╗ ██╗      ██████╗  ██████╗ ██╗   ██╗████████╗███████╗███████╗
// ██╔══██╗██╔══██╗██║      ██╔══██╗██╔═══██╗██║   ██║╚══██╔══╝██╔════╝██╔════╝
// ███████║██████╔╝██║      ██████╔╝██║   ██║██║   ██║   ██║   █████╗  ███████╗
// ██╔══██║██╔═══╝ ██║      ██╔══██╗██║   ██║██║   ██║   ██║   ██╔══╝  ╚════██║
// ██║  ██║██║     ██║      ██║  ██║╚██████╔╝╚██████╔╝   ██║   ███████╗███████║
// ╚═╝  ╚═╝╚═╝     ╚═╝      ╚═╝  ╚═╝ ╚═════╝  ╚═════╝    ╚═╝   ╚══════╝╚══════╝
// you can list here all the routes and methods used to call requests on the backend.

var api_routes = {
    // GENERAL
    config: {
        productionServer: config.app.production,
        common: {
            googleMapsApi: "https://maps.googleapis.com/maps/api",
            local: ""
        },
        production: {
            url: "https://hey-hey.co/api/v1"
        },
        development: {
            url: "http://localhost:1337/api/v1"
        },
        localUrl: ""
    },
    // USER
    user: {
        login: {
            method: 'POST',
            url: 'login'
        },
        me: {
            method: 'GET',
            url: 'me'
        },
        handshake: {
            method: 'GET',
            url: 'handshake'
        },
        resendEmail: {
            method: 'POST',
            url: 'users/resendConfirmation'
        },
        notifications: {
            method: 'GET',
            url: 'notifications'
        },
        update_notifications: {
            method: 'GET',
            url: 'notifications/read'
        },
        get: {
            method: 'GET',
            url: 'user/:id'
        },
        logout: {
            method: 'GET',
            url: 'logout'
        },
        update: {
            method: 'PATCH',
            url: 'me'
        },
        register: {
            method: 'POST',
            url: 'users'
        },
        forgotPassword: {
            method: 'POST',
            url: 'password/reset'
        },
        reset_password: {
            method: 'POST',
            url: 'user/resetPassword'
        },
        picture: {
            method: 'POST',
            url: 'picture/users',
            headers: {
                "Content-Type": "image/*",
            }
        },
        sites_managed: {
            method: 'GET',
            url: 'user/site/managed'
        },
        site_manage: {
            method: 'POST',
            url: 'user/site/manage'
        },
        verify_site_managed: {
            method: 'GET',
            url: 'user/site/verify/:id'
        },
        user_role: {
            method: 'GET',
            url: 'user/role/:id'
        },
        update_user_role: {
            method: 'PUT',
            url: 'user/role/:id'
        }
    },
    // QUESTION
    question: {
        get: {
            method: 'GET',
            url: 'entry/question/:id'
        },
        create: {
            method: 'POST',
            url: 'entry'
        },
        reply: {
            method: 'POST',
            url: 'entry'
        },
        helpful: {
            method: 'POST',
            url: 'entry/helpful/answer/:id'
        },
    },
    // COMMENT
    comment: {
        get: {
            method: 'GET',
            url: 'entry/comment/:id'
        },
        create: {
            method: 'POST',
            url: 'entry'
        },
        reply: {
            method: 'POST',
            url: 'entry'
        }
    },
    // REPORT
    report: {
        get: {
            method: 'GET',
            url: 'entry/report/:id'
        },
        create: {
            method: 'POST',
            url: 'entry'
        },
        reply: {
            method: 'POST',
            url: 'entry'
        }
    },
    // ENTRY
    entry: {
        get: {
            method: 'GET',
            url: 'entry/:id'
        },
        search: {
            method: 'GET',
            url: 'entry/search/:text'
        },
        page: {
            method: 'POST',
            url: 'page'
        },
        create: {
            method: 'POST',
            url: 'entry'
        },
        upvote: {
            method: 'POST',
            url: 'entry/upvote'
        },
        reply: {
            method: 'POST',
            url: 'entry/reply'
        },
        hide: {
            method: 'GET',
            url: 'entry/hide/:id'
        },
        hideAnswer: {
            method: 'GET',
            url: 'entry/answer/hide/:id'
        },
        delete: {
            method: 'GET',
            url: 'entry/delete/:id'
        },
        deleteAnswer: {
            method: 'GET',
            url: 'entry/answer/delete/:id'
        },
        answer_parent: {
            method: 'GET',
            url: 'entry/answer/:id'
        },
    },
    // PAGE
    page: {
        check: {
            method: 'POST',
            url: 'page'
        },
        site: {
            method: 'GET',
            url: 'site'
        }
    },
    // SITE
    site: {
        get: {
            method: 'GET',
            url: 'site/:domain'
        },
        getInfo: {
            method: 'GET',
            url: 'site/nfo/:hostname'
        },
        update: {
            method: 'PUT',
            url: 'site/:id'
        }
    },
    // TRACKERS
    trackers: {
        site_visit: {
            method: 'POST',
            url: 'track/site_visit'
        },
        get_started: {
            method: 'GET',
            url: 'onboarding/get_started'
        },
    },
    // GOOGLE
    googleTimezone: {
        method: 'GET',
        serv: 'googleMapsApi',
        url: 'timezone/json'
    }
};