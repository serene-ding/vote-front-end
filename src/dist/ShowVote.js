"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var axios_1 = require("axios");
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var Loading_1 = require("./Loading");
var lodash_1 = require("lodash");
require("./ShowVote.css");
var antd_1 = require("antd");
var icons_1 = require("@ant-design/icons");
function ShowVote() {
    var params = react_router_dom_1.useParams();
    var voteId = params.voteId;
    var _a = react_1.useState(), voteInfo = _a[0], setVoteInfo = _a[1];
    var _b = react_1.useState(), currentUser = _b[0], setCurrentUser = _b[1];
    // console.log(voteId);
    // console.log(voteInfo, "voteInfo");
    react_1.useEffect(function () {
        axios_1["default"].get("/vote/" + voteId).then(function (res) {
            setVoteInfo(res.data.result);
        });
    }, [voteId]);
    var host = window.location.host;
    react_1.useEffect(function () {
        var ws = new WebSocket("ws://" + host + "/realtime-voteinfo/" + voteId);
        ws.onmessage = function (e) {
            var realTimeVoteInfo = JSON.parse(e.data);
            console.log(realTimeVoteInfo, "websocket");
            setVoteInfo(function (voteInfo) {
                return __assign(__assign({}, voteInfo), { userVotes: realTimeVoteInfo });
            });
        };
        ws.onopen = function () {
            console.log("open", ws.readyState);
        };
        ws.onclose = function (e) {
            console.log("websocket 断开: " + e.code + " " + e.reason + " " + e.wasClean);
            console.log(e);
        };
        return function () {
            // ws.close();
            ws.onmessage = null;
        };
    }, [voteId, host]);
    react_1.useEffect(function () {
        axios_1["default"].get("/account/current-user").then(function (res) {
            setCurrentUser(res.data.result);
            // console.log(res.data.result, "current-user");
        });
    }, []);
    function VoteForThis(option) {
        return __awaiter(this, void 0, void 0, function () {
            var optionId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        optionId = option.optionId;
                        return [4 /*yield*/, axios_1["default"].post("/vote/" + voteId, {
                                optionIds: [optionId]
                            })];
                    case 1:
                        _a.sent();
                        console.log({
                            optionIds: [optionId]
                        }, "投票成功");
                        return [2 /*return*/];
                }
            });
        });
    }
    if (!voteInfo) {
        return React.createElement(Loading_1["default"], null);
    }
    else {
        var UsersPerOption_1 = lodash_1["default"].groupBy(voteInfo.userVotes, "optionId");
        return (React.createElement("div", { className: "ShowVoteContainer" },
            React.createElement("div", { className: "VoteHeader" },
                React.createElement("h2", null, voteInfo.vote.title),
                React.createElement("span", null, voteInfo.vote.title.desc),
                React.createElement("span", { className: "voteKind" },
                    "[",
                    voteInfo.vote.title.multiple === 0 ? "单选" : "多选",
                    "]")),
            React.createElement("div", { className: "VoteBody" }, voteInfo.options.map(function (option, index) {
                var _a, _b, _c;
                var usersForOption = (_a = UsersPerOption_1[option.optionId]) !== null && _a !== void 0 ? _a : [];
                var optionCount = (_c = (_b = UsersPerOption_1[option.optionId]) === null || _b === void 0 ? void 0 : _b.length) !== null && _c !== void 0 ? _c : 0;
                // console.log(typeof optionCount);
                var optionCountPercentage;
                var showChecked = false;
                if (voteInfo.userVotes.length === 0) {
                    optionCountPercentage = 0;
                    showChecked = false;
                }
                else {
                    var p = ((optionCount / voteInfo.userVotes.length) * 100).toFixed(2);
                    optionCountPercentage = Number(p);
                    if (currentUser) {
                        showChecked = usersForOption.find(function (it) {
                            return it.userId === currentUser.userId;
                        });
                    }
                }
                return (React.createElement("div", { className: "CardContainer", key: index },
                    React.createElement("div", { className: "VoteOptionCard", onClick: function () {
                            VoteForThis(option);
                        } },
                        React.createElement("div", { className: "content" },
                            option.content,
                            showChecked ? (React.createElement(icons_1.CheckCircleTwoTone, { style: { fontSize: "20px", color: "#1890ff" } })) : ("")),
                        React.createElement("div", { className: "stat" },
                            React.createElement("span", { className: "voteCount" },
                                optionCount,
                                "\u7968"),
                            React.createElement("span", { className: "optionId" }, option.optionId),
                            React.createElement("span", { className: "votePercentage" },
                                optionCountPercentage,
                                "%"))),
                    React.createElement(antd_1.Progress, { percent: optionCountPercentage, showInfo: false }),
                    React.createElement("div", { className: "avatarContainer" }, usersForOption.map(function (info, index) {
                        return (React.createElement("img", { className: "avatar", src: info.avatar, alt: "avatar", key: index }));
                    }))));
            }))));
    }
}
exports["default"] = ShowVote;
