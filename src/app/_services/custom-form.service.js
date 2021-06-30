"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var environment_1 = require("../../environments/environment");
var CustomFormService = /** @class */ (function () {
    function CustomFormService(http, router) {
        this.http = http;
        this.router = router;
    }
    /// get custom form for webcast by form name
    CustomFormService.prototype.getForm = function (webcastId, formName) {
        return this.http.get(environment_1.environment.apiUrl + "/" + webcastId + "/form/" + formName)
            .pipe(operators_1.catchError(this.handleError('getForm')));
    };
    CustomFormService.prototype.handleError = function (operation, result) {
        if (operation === void 0) { operation = 'operation'; }
        return function (error) {
            console.error(error); // log to console instead
            return rxjs_1.of(result);
        };
    };
    return CustomFormService;
}());
exports.CustomFormService = CustomFormService;
//# sourceMappingURL=custom-form.service.js.map