/*
 * This file is part of the SoureCode package.
 *
 * (c) chapterjason <jason.schilling@sourecode.de>
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

import {AbstractParameterStorage} from "../src/Components/Parameter/AbstractParameterStorage";

class ParameterStorage extends AbstractParameterStorage {
}

describe("Parameter", () => {

    it("get, set and has", () => {
        const storage = new ParameterStorage();
        storage.setParameter("foo", "bar");

        expect(storage.getParameter("foo")).toBe("bar");
        expect(storage.getParameter("bar")).toBe(null);
        expect(storage.hasParameter("foo")).toBeTruthy();
        expect(storage.hasParameter("bar")).toBeFalsy();
    });

});
