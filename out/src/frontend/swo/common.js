"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PacketType;
(function (PacketType) {
    PacketType[PacketType["HARDWARE"] = 1] = "HARDWARE";
    PacketType[PacketType["SOFTWARE"] = 2] = "SOFTWARE";
    PacketType[PacketType["TIMESTAMP"] = 3] = "TIMESTAMP";
})(PacketType = exports.PacketType || (exports.PacketType = {}));
var TimestampType;
(function (TimestampType) {
    TimestampType[TimestampType["CURRENT"] = 0] = "CURRENT";
    TimestampType[TimestampType["DELAYED"] = 1] = "DELAYED";
    TimestampType[TimestampType["EVENT_DELAYED"] = 2] = "EVENT_DELAYED";
    TimestampType[TimestampType["EVENT_TIME_DELAYED"] = 3] = "EVENT_TIME_DELAYED";
})(TimestampType = exports.TimestampType || (exports.TimestampType = {}));
//# sourceMappingURL=common.js.map