"use strict";
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
var events_1 = require("./enums/events");
var message_1 = require("./enums/message");
var endpoints_1 = require("./enums/endpoints");
// Load the .env file from the root directory.
require('dotenv').config({ path: '.env' });
var NWQueueBot = /** @class */ (function () {
    function NWQueueBot() {
        var _this = this;
        this.discord = require('discord.js');
        this.client = new this.discord.Client();
        this.axios = require('axios');
        this.config = {
            headers: {
                'Authorization': "Bearer " + process.env.NW_BEARER
            }
        };
        this.client.login(process.env.TOKEN);
        this.client.on(events_1.DISCORD_EVENTS.READY, function () {
            console.log("Logged in as " + _this.client.user.tag);
        });
        this.client.on(events_1.DISCORD_EVENTS.MESSAGE, function (msg) { return __awaiter(_this, void 0, void 0, function () {
            var serverName, serverInfo, _a, _b;
            var _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        // Early return which will prevent the bot from replying to himself.
                        if (msg.author.id in [(_c = this.client.user) === null || _c === void 0 ? void 0 : _c.id])
                            return [2 /*return*/];
                        if (!msg.content.includes(message_1.MESSAGE.QUEUE)) return [3 /*break*/, 2];
                        serverName = msg.content.split(' ').length > 1
                            ? msg.content.split(' ')[1]
                            : 'inferni';
                        _b = (_a = JSON).stringify;
                        return [4 /*yield*/, this.getWorld(serverName.toLocaleLowerCase())];
                    case 1:
                        serverInfo = _b.apply(_a, [_d.sent()]);
                        msg.reply(serverInfo);
                        _d.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        }); });
    }
    /**
     * Get information about a specific world.
     * @param worldName
     * @returns NWStatusResponse
     */
    NWQueueBot.prototype.getWorld = function (worldName) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.axios.get(endpoints_1.ENDPOINTS.NEW_WORLD_STATUS + "/" + worldName, this.config)
                            .then(function (res) {
                            var response = res.data.message;
                            var worldNameCapitalized = _this.capitalizeName(worldName);
                            return response.players_current < response.players_maximum
                                ? worldNameCapitalized + " has " + response.players_current + " active players out of " + response.players_maximum + "."
                                : worldNameCapitalized + " is currently FULL with " + response.queue_current + " players waiting. Current waiting time is " + response.queue_wait_time_minutes + " minutes.";
                        })["catch"](function (err) {
                            console.error(err.response.statusText);
                            return "Server " + worldName + " not found!";
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Capitalize a World Name.
     * @param name
     * @returns
     */
    NWQueueBot.prototype.capitalizeName = function (name) {
        return name.charAt(0).toUpperCase() + name.slice(1, name.length);
    };
    return NWQueueBot;
}());
new NWQueueBot();
