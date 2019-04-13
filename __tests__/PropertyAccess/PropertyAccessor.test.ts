/*
 * This file is part of the SoureCode package.
 *
 * (c) chapterjason <jason.schilling@sourecode.de>
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

import {PropertyAccessor} from "../../src/Components/PropertyAccess/PropertyAccessor";

describe("PropertyAccess", () => {

    const propertyAccessor = new PropertyAccessor();

    it("getValue", () => {
        const data = {
            foo: {
                bar: [
                    "item 1",
                    "item 2",
                    "item 3",
                ]
            },
            bar: {
                foo: false,
            },
        };

        expect(propertyAccessor.getValue({foo:false}, "")).toMatchObject({foo:false});
        expect(propertyAccessor.getValue(data, "foo.bar.0")).toBe("item 1");
        expect(propertyAccessor.getValue(data, "bar.foo")).toBe(false);
        expect(propertyAccessor.getValue.bind(propertyAccessor, data, "bar.bar")).toThrowError('Missing segment "bar" in path "bar.bar"');
    });

    it("setValue", () => {
        const data = {
            foo: {
                bar: [
                    "item 1",
                    "item 2",
                    "item 3",
                ]
            },
            bar: {
                foo: false,
            },
        };

        propertyAccessor.setValue(data, "foo.bar.0", "new item 1");
        propertyAccessor.setValue(data, "bar", "new value");

        expect(propertyAccessor.getValue(data, "foo.bar.0")).toBe("new item 1");
        expect(propertyAccessor.setValue.bind(propertyAccessor,data, "bar.foo", false)).toThrowError('Missing segment "foo" in path "bar.foo".');
    });

});
