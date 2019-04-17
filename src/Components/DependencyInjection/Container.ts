/*
 * This file is part of the SoureCode package.
 *
 * (c) chapterjason <jason.schilling@sourecode.de>
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

import {AbstractParameterStorage} from "../Parameter";
import {ServiceDefinition} from "./ServiceDefinition";
import {InjectableIndex} from "./Decorator/InjectableIndex";
import {InitiatedService} from "./InitiatedService";
import {Injectable} from "./Decorator/Injectable";
import {ServiceOptions} from "./ServiceOptions";
import {Constructable} from "./Constructable";
import {ContainerBuilderInterface} from "./ContainerBuilderInterface";
import {ServiceIndex} from "./ServiceIndex";
import {ContainerInterface} from "./ContainerInterface";

export class Container extends AbstractParameterStorage implements ContainerInterface {

    protected builder: ContainerBuilderInterface;

    protected services: ServiceIndex = {};

    public constructor(builder: ContainerBuilderInterface) {
        super();
        this.builder = builder;
    }

    public get<T>(name: string): T {
        if (name === "container") {
            return this as any as T; // @todo mhmm...
        }

        const definition = this.builder.get(name);
        try {
            return this.resolveDefinition(definition);
        } catch (error) {
            if (error.message === "Service not found.") {
                throw new Error(`Service "${name}" not found.`);
            } else {
                throw error;
            }
        }
    }

    public set<T>(name: string, service: T): this {
        if (name === "container") {
            throw new Error(`Service name "container" is reserved.`);
        }

        const definedOpts = Reflect.getMetadata(Injectable.OPTIONS, service.constructor.prototype);

        const options: ServiceOptions = {
            ...Injectable.DEFAULT,
            ...definedOpts,
        };

        const definition = new ServiceDefinition<T>(service.constructor as Constructable<T>, options);

        this.injectProperties(definition, service);

        this.services[name] = {
            service,
            definition,
        };

        return this;
    }

    protected resolveDefinition<T>(definition: ServiceDefinition | null): T {
        if (!definition) {
            throw new Error(`Service not found.`);
        }

        if (!definition.isShared()) {
            return this.initiateService(definition);
        }

        const initiatedService = this.getInitiatedService<T>(definition);
        if (initiatedService) {
            return initiatedService.service;
        }

        const service = this.initiateService(definition);

        this.services[definition.getName()] = {
            service,
            definition,
        };

        return service;
    }

    protected initiateService<T>(definition: ServiceDefinition<T>): T {
        const constructor = definition.getConstructor();
        const args = this.resolveConstructorArguments(definition);
        const initiated = new constructor(...args);
        this.injectProperties(definition, initiated);

        return initiated;
    }

    protected getInitiatedService<T>(definition: ServiceDefinition<T>): InitiatedService<T> | null {
        const keys = Object.keys(this.services);
        for (const key of keys) {
            if (key === definition.getName()) {
                return this.services[key];
            }
        }

        return null;
    }

    protected resolveService(name: string) {
        // noinspection SuspiciousTypeOfGuard
        if (typeof name === "string") {
            if (name.startsWith("@")) {
                return this.get(name.slice(1));
            } else if (name.startsWith("!")) {
                return this.builder
                    .getByTag(name.slice(1))
                    .map(definition => this.resolveDefinition(definition));
            } else if (name.startsWith("%") && name.endsWith("%")) {
                return this.getParameter(name.slice(1, -1));
            }
        }

        throw new Error("Invalid inject options.");
    }

    protected resolveConstructorArguments(definition: ServiceDefinition): any[] {
        const index: InjectableIndex = Reflect.getMetadata("injection.constructor", definition.getPrototype());
        if (index) {
            return Object.keys(index)
                .map(key => this.resolveService(index[key]));
        }

        return [];
    }

    protected injectProperties<T>(definition: ServiceDefinition<T>, initiated: T) {
        const index: InjectableIndex = Reflect.getMetadata("injection.property", definition.getPrototype());
        if (index) {
            const keys = Object.keys(index);
            for (const key of keys) {
                initiated[key] = this.resolveService(index[key])
            }
        }
    }
}