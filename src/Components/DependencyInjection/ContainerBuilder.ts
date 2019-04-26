/*
 * This file is part of the SoureCode package.
 *
 * (c) chapterjason <jason.schilling@sourecode.de>
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

import {AbstractRepository} from "../Repository";
import {ServiceDefinition} from "./ServiceDefinition";
import {Constructable} from "./Constructable";
import {Service} from "./Decorator/Service";
import {ServiceOptions} from "./ServiceOptions";
import {ContainerBuilderInterface} from "./ContainerBuilderInterface";

export class ContainerBuilder extends AbstractRepository<ServiceDefinition> implements ContainerBuilderInterface {

    public add<T = any>(injectable: Constructable<T>, options?: Partial<ServiceOptions>): this {
        const definedOpts = Reflect.getMetadata(Service.OPTIONS, injectable.prototype);

        const opts: ServiceOptions = {
            ...Service.DEFAULT,
            ...definedOpts,
            ...options
        };

        if (typeof opts.name === "undefined") {
            throw new Error("Missing service name.");
        }

        if (opts.name === "container") {
            throw new Error(`Service name "container" is reserved.`);
        }

        this.items.push(new ServiceDefinition(injectable, opts));

        return this;
    }

    public get<T = any>(name: string): ServiceDefinition<T> | null {
        for (const definition of this.items) {
            if (definition.getName() === name || definition.hasAlias(name)) {
                return definition;
            }
        }

        return null;
    }

    public getByTag<T = any>(tag: string): ServiceDefinition<T>[] {
        const definitions: ServiceDefinition[] = [];

        for (const definition of this.items) {
            if (definition.hasTag(tag)) {
                definitions.push(definition);
            }
        }

        return definitions;
    }

}