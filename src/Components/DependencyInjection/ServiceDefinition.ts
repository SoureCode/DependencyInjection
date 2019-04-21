/*
 * This file is part of the SoureCode package.
 *
 * (c) chapterjason <jason.schilling@sourecode.de>
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

import {Constructable} from "./Constructable";
import {ServiceOptions} from "./ServiceOptions";

export class ServiceDefinition<T = any> {

    protected ctr: Constructable<T>;

    protected options: ServiceOptions;

    public constructor(constructor: Constructable<T>, options: ServiceOptions) {
        this.ctr = constructor;
        this.options = options;
    }

    public getConstructor() {
        return this.ctr;
    }

    public getPrototype() {
        return this.ctr.prototype;
    }

    public getName() {
        return this.options.name;
    }

    public isShared() {
        return this.options.shared;
    }

    public hasTag(tag: string): boolean {
        return this.options.tags.indexOf(tag) > -1;
    }

    public isPrivate(): boolean {
        return this.options.private;
    }

    public hasAlias(name: string) {
        return this.options.aliases.indexOf(name) > -1;
    }

}