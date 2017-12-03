//Directive uniquemail
var uniquemail = angular.module("uniquemailModule", []);
uniquemail.directive("uniquemail", ['$q', '$http', function($q, $http) {
        return {
            require: 'ngModel',
            scope: {
                required: "=uniquemail"
            },
            link: function(scope, elm, attrs, ctrl) {

                ctrl.$asyncValidators.uniquemail = function(modelValue, viewValue) {

                    if (ctrl.$isEmpty(modelValue)) {
                        // consider empty model valid
                        return $q.when();
                    }

                    var def = $q.defer();

                    scope.required = (scope.required === false) ? false : true;

                    var cb = function(response) {
                        // console.log(r)
                        console.log('cb', response.data)
                        if (!(response.data.error === false || response.data.error === "false") && scope.required) {
                            def.reject();
                        } else {
                            def.resolve();
                        }

                    };

                    $http.get(helper.u('users/checkEmail'), {
                        params: {
                            email: modelValue
                        }
                    }).then(cb, cb);

                    return def.promise;
                };
            }
        };
    }]);