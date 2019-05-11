/*
 * This file is part of the SoureCode package.
 *
 * (c) chapterjason <jason.schilling@sourecode.de>
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

import {ContainerBuilder} from "../src/DependencyInjection";
import {PasswordStrategyOne} from "./Fixture/PasswordStrategyOne";
import {PasswordStrategyTwo} from "./Fixture/PasswordStrategyTwo";

describe("DependencyInjection Builder", () => {

    it("add and get", () => {
        const builder = new ContainerBuilder();

        builder.add(PasswordStrategyOne, {name: 'strategy.one', tags: ["strategy"]});
        builder.add(PasswordStrategyTwo);

        const definition = builder.get("strategy.two");
        expect(definition).toMatchObject({
            ctr: PasswordStrategyTwo,
            options: {
                aliases: [],
                lazy: true,
                name: "strategy.two",
                shared: true,
                tags: ["strategy"]
            }
        });

        expect(builder.get("not.exist")).toBe(null);
    });

    it("add \w missing service name", () => {
        const builder = new ContainerBuilder();

        class Foo {
            protected test: string;
        }

        expect(builder.add.bind(builder,Foo)).toThrowError("Missing service name.");
    });

});
