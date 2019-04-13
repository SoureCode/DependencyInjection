/*
 * This file is part of the SoureCode package.
 *
 * (c) chapterjason <jason.schilling@sourecode.de>
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

import {Repository} from "./Fixture/Repository";

describe("Repository", () => {

    const repository = new Repository();

    repository.add({one: "measure", two: ["airport"], bar: {lorem: "homely", ipsum: "sulky"}});
    repository.add({one: "flaky", two: ["destruction"], bar: {lorem: "inform", ipsum: "fetch"}});
    repository.add({one: "spicy", two: ["texture"], bar: {lorem: "homely", ipsum: "pink"}});
    repository.add({one: "acceptable", two: ["domineering"], bar: {lorem: "homely", ipsum: "full"}});

    it("findAll", () => {
        const result = repository.findAll();
        expect(result).toBeInstanceOf(Array);
        expect(result.length).toBe(4);
        expect(result).toMatchObject([
                {
                    bar: {
                        lorem: "homely",
                        ipsum: "sulky"
                    },
                    one: "measure",
                    two: ["airport"],
                },
                {
                    bar: {
                        ipsum: "fetch",
                        lorem: "inform"
                    },
                    one: "flaky",
                    two: ["destruction"]
                },
                {
                    bar: {
                        ipsum: "pink",
                        lorem: "homely"
                    },
                    one: "spicy",
                    two: ["texture"]
                },
                {
                    bar: {
                        ipsum: "full",
                        lorem: "homely"
                    },
                    one: "acceptable",
                    two: ["domineering"]
                },
            ]
        );
    });

    it("findBy", () => {
        const result = repository.findBy([["bar.lorem", "homely"]]);

        expect(result).toBeInstanceOf(Array);
        expect(result.length).toBe(3);
        expect(result).toMatchObject([
                {
                    bar: {
                        ipsum: "sulky",
                        lorem: "homely"
                    },
                    one: "measure",
                    two: ["airport"]
                },
                {
                    bar: {
                        ipsum: "pink",
                        lorem: "homely"
                    },
                    one: "spicy",
                    two: ["texture"]
                },
                {
                    bar: {
                        ipsum: "full",
                        lorem: "homely"
                    },
                    one: "acceptable",
                    two: ["domineering"]
                },
            ]
        );
    });

    it("findBy array", () => {
        const result = repository.findBy([["two", "texture"]]);

        expect(result).toBeInstanceOf(Array);
        expect(result.length).toBe(1);
        expect(result).toMatchObject([
            {
                bar: {
                    ipsum: "pink",
                    lorem: "homely"
                },
                one: "spicy",
                two: ["texture"]
            }
        ]);
    });

    it("findBy order DESC", () => {
        const result = repository.findBy([["bar.lorem", "homely"]], ["bar.ipsum", "DESC"]);

        expect(result).toBeInstanceOf(Array);
        expect(result.length).toBe(3);
        expect(result).toMatchObject([
            {
                bar: {
                    ipsum: "sulky",
                    lorem: "homely"
                },
                one: "measure",
                two: ["airport"]
            },
            {
                bar: {
                    ipsum: "pink",
                    lorem: "homely"
                },
                one: "spicy",
                two: ["texture"]
            },
            {
                bar: {
                    ipsum: "full",
                    lorem: "homely"
                },
                one: "acceptable",
                two: ["domineering"]
            },
        ]);
    });

    it("findBy order ASC", () => {
        const result = repository.findBy([["bar.lorem", "homely"]], ["bar.ipsum", "ASC"]);

        expect(result).toBeInstanceOf(Array);
        expect(result.length).toBe(3);
        expect(result).toMatchObject([
            {
                bar: {
                    ipsum: "full",
                    lorem: "homely"
                },
                one: "acceptable",
                two: ["domineering"]
            },
            {
                bar: {
                    ipsum: "pink",
                    lorem: "homely"
                },
                one: "spicy",
                two: ["texture"]
            },
            {
                bar: {
                    ipsum: "sulky",
                    lorem: "homely"
                },
                one: "measure",
                two: ["airport"]
            },
        ]);
    });

    it("findBy limit", () => {
        const result = repository.findBy([["bar.lorem", "homely"]], null, 2);

        expect(result).toBeInstanceOf(Array);
        expect(result.length).toBe(2);
        expect(result).toMatchObject([
            {
                bar: {
                    ipsum: "sulky",
                    lorem: "homely"
                },
                one: "measure",
                two: ["airport"]
            },
            {
                bar: {
                    ipsum: "pink",
                    lorem: "homely"
                },
                one: "spicy",
                two: ["texture"]
            },
        ]);
    });

    it("findBy limit offset", () => {
        const result = repository.findBy([["bar.lorem", "homely"]], null, 2, 1);

        expect(result).toBeInstanceOf(Array);
        expect(result.length).toBe(2);
        expect(result).toMatchObject([
            {
                bar: {
                    ipsum: "pink",
                    lorem: "homely"
                },
                one: "spicy",
                two: ["texture"]
            },
            {
                bar: {
                    ipsum: "full",
                    lorem: "homely"
                },
                one: "acceptable",
                two: ["domineering"]
            },
        ]);
    });

    it("findOneBy", () => {
        const result = repository.findOneBy([["two", "texture"]]);

        expect(result).toMatchObject({
            one: "spicy",
            two: ["texture"],
            bar: {
                lorem: "homely",
                ipsum: "pink"
            }
        });
    });

    it("findOneBy not found", () => {
        const result = repository.findOneBy([["two", "notexist"]]);

        expect(result).toBe(null);
    });

    it("findOneBy not array", () => {
        const result = repository.findOneBy([["one", "spicy"]]);

        expect(result).toMatchObject({
            one: "spicy",
            two: ["texture"],
            bar: {
                lorem: "homely",
                ipsum: "pink"
            }
        });
    });

    it("findOneBy ordered", () => {
        const result = repository.findOneBy([["bar.lorem", "homely"]], ["one", "ASC"]);

        expect(result).toMatchObject({
            one: "acceptable",
            two: ["domineering"],
            bar: {
                lorem: "homely",
                ipsum: "full"
            }
        });
    });

});
