/**
 * Entry configuration
 */

module.exports.entry = {

    /***************************************************************************
     *                                                                          *
     * List                                                                     *
     *                                                                          *
     ***************************************************************************/
    list: [{
        model: 'EntryComment',
        model_key: 'comment',
        action: 'comment',
        version: 1,
        notification: {
            create: 'comment.create',
            upvote: 'comment.upvote'
        },
        history: {
            create: 'comment.create',
            upvote: 'comment.upvote'
        }
    }, {
        model: 'EntryQuestion',
        model_key: 'question',
        action: 'question',
        version: 1,
        notification: {
            create: 'question.create',
            upvote: 'question.upvote'
        },
        history: {
            create: 'question.create',
            upvote: 'question.upvote'
        }
    }, {
        model: 'EntryReport',
        model_key: 'report',
        action: 'report',
        version: 1,
        notification: {
            create: 'report.create',
            upvote: 'report.upvote'
        },
        history: {
            create: 'report.create',
            upvote: 'report.upvote'
        }
    }, {
        model: 'EntryAnswer',
        model_key: 'answer',
        model_key_parent: 'question',
        action: 'answer',
        version: 1,
        notification: {
            create: 'answer.question.create',
            upvote: 'answer.question.upvote'
        },
        history: {
            create: 'answer.question.create',
            upvote: 'answer.question.upvote'
        }
    }, {
        model: 'EntryAnswer',
        model_key: 'answer',
        model_key_parent: 'comment',
        action: 'recomment',
        version: 1,
        notification: {
            create: 'answer.comment.create',
            upvote: 'answer.comment.upvote'
        },
        history: {
            create: 'answer.comment.create',
            upvote: 'answer.comment.upvote'
        }
    }, {
        model: 'EntryAnswer',
        model_key: 'answer',
        model_key_parent: 'report',
        action: 'rereport',
        version: 1,
        notification: {
            create: 'answer.report.create',
            upvote: 'answer.report.upvote'
        },
        history: {
            create: 'answer.report.create',
            upvote: 'answer.report.upvote'
        }
    }]

};
