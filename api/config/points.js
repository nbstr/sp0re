/**
 * Points configuration
 */

module.exports.points = {

    /***************************************************************************
     *                                                                          *
     * Attribution                                                              *
     *                                                                          *
     ***************************************************************************/
    attrs: {
        helpfulAnswer: 10,
        acceptAnswer: 2,
        notifications: {
            custom: {
                'user.register': 1
            },
            create: {
                'comment.create': 1,
                'question.create': 1,
                'report.create': 1,
                'answer.question.create': 1,
                'answer.comment.create': 1,
                'answer.report.create': 1,
            },
            upvote: {
                'comment.upvote': 1,
                'question.upvote': 1,
                'report.upvote': 1,
                'answer.question.upvote': 1,
                'answer.comment.upvote': 1,
                'answer.report.upvote': 1,
            }
        },
        history: {
            create: {
                'comment.create': 0,
                'question.create': 0,
                'report.create': 0,
                'answer.question.create': 0,
                'answer.comment.create': 0,
                'answer.report.create': 0,
            },
            upvote: {
                'comment.upvote': 0,
                'question.upvote': 0,
                'report.upvote': 0,
                'answer.question.upvote': 0,
                'answer.comment.upvote': 0,
                'answer.report.upvote': 0,
            }
        }
    }
};
