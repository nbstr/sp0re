//Resource Question
var Question = angular.module("QuestionModule", []);

Question.factory("Question", ['$rootScope', 'ApiService', '$q', 'Entry', function($rootScope, ApiService, $q, Entry) {

    var QuestionResource = {};

    /****************************************************************************
     *                                                                          *
     * Resource Question                                                        *
     *                                                                          *
     ***************************************************************************/

    QuestionResource.get = function(id, user_id) {

        return Entry.get({
            route: 'question.get',
            data: {
                type: 'question',
                id: id,
                user_id: user_id
            }
        });

    };

    QuestionResource.create = function(content) {

        return Entry.create({
            route: 'question.create',
            data: {
                location: $rootScope.GLOBAL.location,
                type: 'question',
                content: content
            }
        });

    };

    QuestionResource.upvote = function(id, downvote) {

        return Entry.upvote({
            type: 'question',
            id: id,
            upvote: !(downvote === true)
        });

    };

    QuestionResource.helpful = function(id, question_id) {

        var q = $q.defer();

        ApiService.request('question.helpful', {
                location: $rootScope.GLOBAL.location,
                question_id: question_id,
                id: id
            })
            .then(function(data) {

                if (data && data.success) {

                    var next = function() {
                        // UPDATE HOME PAGE
                        for (var e in $rootScope.GLOBAL.page_data.entries) {
                            if ($rootScope.GLOBAL.page_data.entries[e].id === question_id) {
                                $rootScope.GLOBAL.page_data.entries[e].helpful_answer = data.result.helpful_answer;
                            }
                        }

                        q.resolve(data.result);
                    };

                    // adding new data to the global object
                    // change message for self maybe
                    if (data.result && data.result.earnedPoints && false) {
                        $rootScope.openModal('earnedPoints', {
                            amount: data.result.earnedPoints,
                            text: 'Great ! We are glad to see that someone could help you.'
                        }, next, next);
                    } else {
                        next();
                    }

                } else {
                    $rootScope.showErrorModal('An error occured, please excuse us..');
                    q.reject();
                }

            });

        return q.promise;

    };

    QuestionResource.upvoteAnswer = function(entry_id, id, downvote) {

        return Entry.upvote({
            type: 'answer',
            id: id,
            entry_id: entry_id,
            upvote: !(downvote === true)
        });

    };

    QuestionResource.reply = function(text, entry_id, author_data, no_modal) {

        var q = $q.defer();
        var next = function(answer) {

            Entry.reply({
                route: 'question.reply',
                data: {
                    action: 'answer',
                    type: 'question',
                    answer: answer,
                    entry_id: entry_id,
                    author_id: author_data && author_data.id ? author_data.id : null,
                }
            }).then(q.resolve);
        };

        if (no_modal) {
            next(text);
        } else {
            $rootScope.openModal('response', {
                location: $rootScope.GLOBAL.location,
                title: 'Respond to question',
                response: '',
                reminder: text
            }, next);
        }

        return q.promise;

    };

    return QuestionResource;

}]);
