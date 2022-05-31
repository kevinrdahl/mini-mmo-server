"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const NameGen_1 = require("../Util/NameGen");
describe("Names", () => {
    it("Generate some names", () => {
        (0, chai_1.expect)((0, NameGen_1.GenerateName)().length).to.be.greaterThan(0);
    });
});
