/*
 * This file is part of the SoureCode package.
 *
 * (c) chapterjason <jason.schilling@sourecode.de>
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

import {Container, ContainerBuilder, Inject} from "../src/index";

describe("Private Container", () => {

    it("Should throw error on direct access", () => {

        const builder = new ContainerBuilder();

        class Bar {
            public getBar() {
                return "baar";
            }
        }

        class Foo {
            @Inject("@private_bar")
            protected bar: Bar;

            public getBar() {
                return this.bar;
            }

            public getFoo() {
                return "fooo";
            }
        }

        builder.add(Foo, {private: true, name: "private_foo"});
        builder.add(Foo, {private: false, name: "public_foo"});
        builder.add(Bar, {private: true, name: "private_bar"});

        const container = new Container(builder);

        const foo = container.get<Foo>("public_foo");

        expect(foo).toBeInstanceOf(Foo);
        expect(foo.getFoo()).toBe("fooo");

        const bar = foo.getBar();

        expect(bar).toBeInstanceOf(Bar);
        expect(bar.getBar()).toBe("baar");

        expect(container.get.bind(container, "private_foo")).toThrowError('Could not get service "private_foo". You should either make it public, or stop using the container directly and use dependency injection instead.');

    });

});