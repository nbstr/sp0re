//Resource Comment
var Comment = angular.module("CommentModule", []);

Comment.factory("Comment", ['$rootScope', 'ApiService', '$q', 'Entry', function($rootScope, ApiService, $q, Entry) {

    var CommentResource = {};

    /****************************************************************************
     *                                                                          *
     * Resource Comment                                                         *
     * Explain what the method of the resource does here                        *
     *                                                                          *
     ***************************************************************************/

    CommentResource.get = function(id, user_id) {

        return Entry.get({
            route: 'comment.get',
            data: {
                type: 'comment',
                id: id,
                user_id: user_id
            }
        });

    };

    CommentResource.create = function(content) {

        return Entry.create({
            route: 'comment.create',
            data: {
                location: $rootScope.GLOBAL.location,
                type: 'comment',
                content: content
            }
        });

    };

    CommentResource.upvote = function(id, downvote) {

        return Entry.upvote({
            type: 'comment',
            id: id,
            upvote: !(downvote === true)
        });

    };

    CommentResource.upvoteAnswer = function(entry_id, id, downvote) {

        return Entry.upvote({
            type: 'answer',
            id: id,
            entry_id: entry_id,
            upvote: !(downvote === true)
        });

    };

    CommentResource.reply = function(text, entry_id, author_data, no_modal) {

        var q = $q.defer();
        var next = function(answer) {

            Entry.reply({
                route: 'comment.reply',
                data: {
                    action: 'recomment',
                    type: 'comment',
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
                title: 'Reply to comment',
                location: $rootScope.GLOBAL.location,
                response: '',
                reminder: text
            }, next);
        }

        return q.promise;

    };

    return CommentResource;

}]);
