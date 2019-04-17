/*
 * This file is part of the SoureCode package.
 *
 * (c) chapterjason <jason.schilling@sourecode.de>
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

import {Container, ContainerBuilder, Inject, Service} from "../src";
import {PasswordStrategyInterface} from "./Fixture/PasswordStrategyInterface";
import {PasswordStrategyOne} from "./Fixture/PasswordStrategyOne";
import {PasswordStrategyTwo} from "./Fixture/PasswordStrategyTwo";

@Service({name: "password.hash"})
class PasswordHash {

    @Inject("@strategy.one")
    protected strategy: PasswordStrategyInterface;

    protected second: PasswordStrategyInterface;

    @Inject("%salt%")
    protected salt: string;

    protected strategies: PasswordStrategyInterface[];

    constructor(
        @Inject("@strategy.two") strategy: PasswordStrategyInterface,
        @Inject("!strategy") strategies: PasswordStrategyInterface[]
    ) {
        this.second = strategy;
        this.strategies = strategies;
    }

    public getSalt() {
        return this.salt;
    }

    public getStrategies() {
        return this.strategies;
    }

    public hash(password: string) {
        return this.strategy.hash(password);
    }

    public saveHash(password: string) {
        return this.second.hash(password);
    }

}

describe("DependencyInjection", () => {

    it("container get", () => {
        const builder = new ContainerBuilder();
        const container = new Container(builder);

        builder.add(PasswordHash);
        builder.add(PasswordStrategyOne, {name: 'strategy.one', tags: ["strategy"]});
        builder.add(PasswordStrategyTwo);

        container.setParameter("salt", "foobar");

        const result = container.get<PasswordHash>("password.hash");

        expect(result).toBeInstanceOf(PasswordHash);
        expect(result.hash("FooBar")).toBe("FOOBAR");
        expect(result.saveHash("FooBar")).toBe("foobar");
        const strategies = result.getStrategies();
        expect(strategies).toBeInstanceOf(Array);
        expect(strategies[0]).toBeInstanceOf(PasswordStrategyOne);
        expect(strategies[1]).toBeInstanceOf(PasswordStrategyTwo);
        expect(container.getParameter("salt")).toBe("foobar");
        expect(result.getSalt()).toBe("foobar");
    });

    it("container invalid injection", () => {
        const builder = new ContainerBuilder();
        const container = new Container(builder);

        @Service({name: "test"})
        class Foo {
            @Inject({invalid: true} as any)
            protected test: string;
        }

        builder.add(Foo);

        expect(container.get.bind(container, "test")).toThrowError("Invalid inject options.");
        expect(container.get.bind(container, "noexist")).toThrowError('Service "noexist" not found.');
    });

    it("container is shared", () => {
        const builder = new ContainerBuilder();
        const container = new Container(builder);

        @Service({name: "test"})
        class Foo {
            protected test: number = Math.random();
        }

        builder.add(Foo);

        const result = container.get("test");

        expect(result).toBe(container.get("test"));
    });

    it("container is not shared", () => {
        const builder = new ContainerBuilder();
        const container = new Container(builder);

        @Service({name: "test", shared: false})
        class Foo {
            protected test: number = Math.random();
        }

        builder.add(Foo);

        const result = container.get("test");

        expect(result).not.toBe(container.get("test"));
    });

    it("change service", () => {
        const builder = new ContainerBuilder();
        const container = new Container(builder);

        interface BarInterface {
            name: string;
        }

        @Service({name: "bar"})
        class OriginalBar implements BarInterface {
            public name: string = "original";
        }

        class NewBar {
            protected name: string = "changed";
        }

        @Service({name: "foo"})
        class Foo {
            @Inject("@bar")
            protected bar: BarInterface;

            public getBar() {
                return this.bar;
            }
        }

        builder.add(Foo);
        builder.add(OriginalBar);

        container.set("bar", new NewBar());

        const result = container.get<Foo>("foo");
        const bar = result.getBar();

        expect(bar.name).toBe("changed");
    });

});
