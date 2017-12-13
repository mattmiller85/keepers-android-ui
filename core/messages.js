"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var MessageType;
(function (MessageType) {
    MessageType[MessageType["error"] = 1] = "error";
    MessageType[MessageType["queue_for_indexing"] = 2] = "queue_for_indexing";
    MessageType[MessageType["indexing_finished"] = 3] = "indexing_finished";
    MessageType[MessageType["search_for_keeper"] = 4] = "search_for_keeper";
    MessageType[MessageType["search_results"] = 5] = "search_results";
})(MessageType = exports.MessageType || (exports.MessageType = {}));
function getTypedMessage(messageObj) {
    if (!messageObj || !messageObj.type) {
        throw new Error("Not a message");
    }
    switch (messageObj.type) {
        case MessageType.error:
            return new ErrorMessage(messageObj);
        case MessageType.queue_for_indexing:
            return new QueueForIndexingMessage(messageObj);
        case MessageType.indexing_finished:
            return new IndexingFinishedMessage(messageObj);
    }
}
exports.getTypedMessage = getTypedMessage;
var MessageBase = (function () {
    function MessageBase(messageObj) {
        Object.assign(this, messageObj);
    }
    return MessageBase;
}());
exports.MessageBase = MessageBase;
var ErrorMessage = (function (_super) {
    __extends(ErrorMessage, _super);
    function ErrorMessage() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = MessageType.error;
        return _this;
    }
    return ErrorMessage;
}(MessageBase));
exports.ErrorMessage = ErrorMessage;
var SearchRequestMessage = (function (_super) {
    __extends(SearchRequestMessage, _super);
    function SearchRequestMessage() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = MessageType.search_for_keeper;
        return _this;
    }
    return SearchRequestMessage;
}(MessageBase));
exports.SearchRequestMessage = SearchRequestMessage;
var SearchResultsMessage = (function (_super) {
    __extends(SearchResultsMessage, _super);
    function SearchResultsMessage(results) {
        var _this = _super.call(this, { results: results }) || this;
        _this.type = MessageType.search_results;
        return _this;
    }
    return SearchResultsMessage;
}(MessageBase));
exports.SearchResultsMessage = SearchResultsMessage;
var QueueForIndexingMessage = (function (_super) {
    __extends(QueueForIndexingMessage, _super);
    function QueueForIndexingMessage() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = MessageType.queue_for_indexing;
        return _this;
    }
    return QueueForIndexingMessage;
}(MessageBase));
exports.QueueForIndexingMessage = QueueForIndexingMessage;
var IndexingFinishedMessage = (function (_super) {
    __extends(IndexingFinishedMessage, _super);
    function IndexingFinishedMessage() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = MessageType.indexing_finished;
        return _this;
    }
    return IndexingFinishedMessage;
}(MessageBase));
exports.IndexingFinishedMessage = IndexingFinishedMessage;
//# sourceMappingURL=messages.js.map