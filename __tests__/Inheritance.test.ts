/*
 * This file is part of the SoureCode package.
 *
 * (c) chapterjason <jason.schilling@sourecode.de>
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

import {Container, ContainerBuilder, Inject, Service} from "../src/index";

@Service({name: "foo"})
class Foo {

    @Inject("%fooValue%")
    protected fooValue: string;

    public getFoo() {
        return "foo";
    }

    public getFooValue() {
        return this.fooValue;
    }

}

abstract class Bar extends Foo {

    @Inject("%barValue%")
    protected barValue: string;

    public getBar() {
        return "bar";
    }

    public getBarValue() {
        return this.barValue;
    }
}

@Service({name: "lorem"})
class Lorem extends Bar {

    @Inject("%loremValue%")
    protected loremValue: string;

    public getLorem() {
        return "lorem";
    }

    public getLoremValue() {
        return this.loremValue;
    }
}

@Service({name: "ipsum"})
class Ipsum extends Bar {

    @Inject("%ipsumValue%")
    protected ipsumValue: string;

    public getIpsum() {
        return "ipsum";
    }

    public getIpsumValue() {
        return this.ipsumValue;
    }
}

describe("Inheritance", () => {

    it("parent inject", () => {
        const builder = new ContainerBuilder();

        builder.add(Foo, {private: false});
        builder.add(Lorem, {private: false});
        builder.add(Ipsum, {private: false});

        const container = new Container(builder);

        container.setParameter("fooValue", "fooValueContent");
        container.setParameter("barValue", "barValueContent");
        container.setParameter("loremValue", "loremValueContent");
        container.setParameter("ipsumValue", "ipsumValueContent");

        const foo = container.get<Foo>("foo");
        const lorem = container.get<Lorem>("lorem");
        const ipsum = container.get<Ipsum>("ipsum");

        expect(foo).toBeInstanceOf(Foo);
        expect(foo.getFoo()).toBe("foo");
        expect(foo.getFooValue()).toBe("fooValueContent");

        expect(lorem).toBeInstanceOf(Lorem);
        expect(lorem.getFoo()).toBe("foo");
        expect(lorem.getBar()).toBe("bar");
        expect(lorem.getLorem()).toBe("lorem");
        expect(lorem.getLoremValue()).toBe("loremValueContent");
        expect(lorem.getFooValue()).toBe("fooValueContent");
        expect(lorem.getBarValue()).toBe("barValueContent");

        expect(ipsum).toBeInstanceOf(Ipsum);
        expect(ipsum.getFoo()).toBe("foo");
        expect(ipsum.getBar()).toBe("bar");
        expect(ipsum.getIpsum()).toBe("ipsum");
        expect(ipsum.getIpsumValue()).toBe("ipsumValueContent");
        expect(ipsum.getFooValue()).toBe("fooValueContent");
        expect(ipsum.getBarValue()).toBe("barValueContent");
    });

});