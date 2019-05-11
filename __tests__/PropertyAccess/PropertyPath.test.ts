/*
 * This file is part of the SoureCode package.
 *
 * (c) chapterjason <jason.schilling@sourecode.de>
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

import {PropertyPath} from "../../src/PropertyAccess";

describe("PropertyPath", () => {

    it("change separator", () => {
        const propertyPath = new PropertyPath("Foo.Bar.Mars");

        expect(propertyPath.getSeparator()).toBe(".");
        expect(propertyPath.getSegments()).toMatchObject(["Foo", "Bar", "Mars"]);
        expect(propertyPath.toString()).toBe("Foo.Bar.Mars");
        propertyPath.setSeparator("/");
        expect(propertyPath.getSeparator()).toBe("/");
        expect(propertyPath.getSegments()).toMatchObject(["Foo", "Bar", "Mars"]);
        expect(propertyPath.toString()).toBe("Foo/Bar/Mars");
    });

    it("constructor normalization and getSegments", () => {
        expect(new PropertyPath().getSegments()).toMatchObject([]);
        expect(new PropertyPath(["Foo", "Bar"]).getSegments()).toMatchObject(["Foo", "Bar"]);
        expect(new PropertyPath(["Foo", " ", " Bar"]).getSegments()).toMatchObject(["Foo", "Bar"]);
        expect(new PropertyPath(["Foo", " ", " Bar.Deep.Dive"]).getSegments()).toMatchObject(["Foo", "Bar", "Deep", "Dive"]);
        expect(new PropertyPath("Foo.Bar").getSegments()).toMatchObject(["Foo", "Bar"]);
        expect(new PropertyPath(".Foo.Bar").getSegments()).toMatchObject(["Foo", "Bar"]);
        expect(new PropertyPath(".Foo.Bar.").getSegments()).toMatchObject(["Foo", "Bar"]);
        expect(new PropertyPath(".Foo.....Bar.").getSegments()).toMatchObject(["Foo", "Bar"]);
        expect(new PropertyPath(new PropertyPath(".Foo.....Bar.")).getSegments()).toMatchObject(["Foo", "Bar"]);
    });

    it("toString", () => {
        expect(new PropertyPath().toString()).toBe("");
        expect(new PropertyPath(["Foo", "Bar"]).toString()).toBe("Foo.Bar");
        expect(new PropertyPath(["Foo", " ", " Bar"]).toString()).toBe("Foo.Bar");
        expect(new PropertyPath("Foo.Bar").toString()).toBe("Foo.Bar");
        expect(new PropertyPath(".Foo.Bar").toString()).toBe("Foo.Bar");
        expect(new PropertyPath(".Foo.Bar.").toString()).toBe("Foo.Bar");
        expect(new PropertyPath(".Foo.....Bar.").toString()).toBe("Foo.Bar");
    });

    it("parent", () => {
        expect((new PropertyPath(".Foo.Bar.Mars").parent() as any).parent().toString()).toBe("Foo");
        expect((new PropertyPath(".Foo").parent() as any).toString()).toBe("");
        expect(new PropertyPath(".").parent()).toBe(null);
    });

    it("child", () => {
        expect(new PropertyPath(".").child("Foo").child("Bar").toString()).toBe("Foo.Bar");
        expect(new PropertyPath(".Foo").child("Bar").toString()).toBe("Foo.Bar");
    });

    it("length", () => {
        expect(new PropertyPath(".Foo.Bar.Mars").length()).toBe(3);
        expect(new PropertyPath(".").length()).toBe(0);
    });

    it("end", () => {
        expect(new PropertyPath(".Foo.Bar.Mars").end()).toBe("Mars");
        expect(new PropertyPath(".Foo").end()).toBe("Foo");
        expect(new PropertyPath(".").end()).toBe(null);
    });

    it("ensurePath", () => {
        expect(PropertyPath.ensurePath(".Foo.Bar").toString()).toBe("Foo.Bar");
        expect(PropertyPath.ensurePath(["Foo", "Bar"]).toString()).toBe("Foo.Bar");
        expect(PropertyPath.ensurePath(new PropertyPath(".Foo.Bar")).toString()).toBe("Foo.Bar");
    });

});
