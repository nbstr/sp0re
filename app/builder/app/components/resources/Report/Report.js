//Resource Report
var Report = angular.module("ReportModule", []);

Report.factory("Report", ['$rootScope', 'ApiService', '$q', 'Entry', function($rootScope, ApiService, $q, Entry) {

    var ReportResource = {};

    /****************************************************************************
     *                                                                          *
     * Resource Report                                                          *
     * Explain what the method of the resource does here                        *
     *                                                                          *
     ***************************************************************************/

    ReportResource.get = function(id, user_id) {

        return Entry.get({
            route: 'report.get',
            data: {
                type: 'report',
                id: id,
                user_id: user_id
            }
        });

    };

    ReportResource.create = function(content) {

        return Entry.create({
            route: 'report.create',
            data: {
                location: $rootScope.GLOBAL.location,
                type: 'report',
                content: content
            }
        });

    };

    ReportResource.upvote = function(id, downvote) {

        return Entry.upvote({
            type: 'report',
            id: id,
            upvote: !(downvote === true)
        });

    };

    ReportResource.upvoteAnswer = function(entry_id, id, downvote) {

        return Entry.upvote({
            type: 'answer',
            id: id,
            entry_id: entry_id,
            upvote: !(downvote === true)
        });

    };

    ReportResource.reply = function(text, entry_id, author_data, no_modal) {

        var q = $q.defer();
        var next = function(answer) {

            Entry.reply({
                route: 'report.reply',
                data: {
                    action: 'rereport',
                    type: 'report',
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
                title: 'Reply to report',
                response: '',
                reminder: text
            }, next);
        }


        return q.promise;

    };

    return ReportResource;

}]);
