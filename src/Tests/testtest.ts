import { expect } from "chai"
import { GenerateName } from "../Util/NameGen"

describe("Names", () => {
    it("Generate some names", () => {
        expect(GenerateName().length).to.be.greaterThan(0)
    })
})