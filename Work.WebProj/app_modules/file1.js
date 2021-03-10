"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var JCIN = require("JCIN");
var Tips = (function (_super) {
    __extends(Tips, _super);
    function Tips() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Tips.prototype.render = function () {
        var ABC = JCIN.ContextComponent;
        return React.createElement("div", null,
            React.createElement(ABC, { id: 1 }));
    };
    return Tips;
}(React.Component));
