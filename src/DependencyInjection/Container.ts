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
import {InitiatedService} from "./InitiatedService";
import {Service} from "./Decorator/Service";
import {ServiceOptions} from "./ServiceOptions";
import {Constructable} from "./Constructable";
import {ContainerBuilderInterface} from "./ContainerBuilderInterface";
import {InitiatedServiceIndex} from "./InitiatedServiceIndex";
import {ContainerInterface} from "./ContainerInterface";
import {ServiceIndex} from "./Decorator/ServiceIndex";
import {Inject} from "./Decorator/Inject";
import {getServiceIndex} from "./Decorator/Utils";

export class Container extends AbstractParameterStorage implements ContainerInterface {

    protected builder: ContainerBuilderInterface;

    protected services: InitiatedServiceIndex = {};

    public constructor(builder: ContainerBuilderInterface) {
        super();
        this.builder = builder;
    }

    public get<T>(name: string): T {
        if (name === "service_container") {
            return this as any as T; // @todo mhmm...
        }

        const definition = this.builder.get(name);

        if (definition && definition.isPrivate()) {
            throw new Error(`Could not get service "${name}". You should either make it public, or stop using the container directly and use dependency injection instead.`);
        }

        return this.resolveDefinition(name, definition);
    }

    public set<T>(name: string, service: T | null): this {
        if (name === "service_container") {
            throw new Error(`You cannot set service "service_container".`);
        }

        const currentDefinition = this.builder.get(name);

        if (service === null) {
            if (currentDefinition) {
                if (currentDefinition.isPrivate()) {
                    throw new Error(`The "${name}" service is private, you cannot unset it.`);
                } else {
                    delete this.services[name];
                }
            }
            return this;
        }

        if (currentDefinition) {
            if (currentDefinition.isPrivate()) {
                throw new Error(`The "${name}" service is private, you cannot replace it.`)
            }

            const initiatedService = this.getInitiatedService<T>(currentDefinition);
            if (initiatedService) {
                throw new Error(`The "${name}" service is already initialized, you cannot replace it.`);

            }
        }
        const definedOptions = Reflect.getMetadata(Service.OPTIONS, service.constructor.prototype);

        const options: ServiceOptions = {
            ...Service.DEFAULT,
            ...definedOptions,
        };

        const definition = new ServiceDefinition<T>(service.constructor as Constructable<T>, options);

        this.injectProperties(definition, service);
        this.injectMethods(definition, service);

        this.services[name] = {
            service,
            definition,
        };

        return this;
    }

    protected resolveDefinition<T>(name: string, definition: ServiceDefinition | null): T {
        if (!definition) {
            throw new Error(`Service "${name}" not found.`);
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
        const service = new constructor(...args);
        this.injectProperties(definition, service);
        this.injectMethods(definition, service);

        return service;
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

    protected resolveService(expression: string) {
        // noinspection SuspiciousTypeOfGuard
        if (typeof expression === "string") {
            if (expression.startsWith("@")) {
                const name = expression.slice(1);
                return this.resolveDefinition(name, this.builder.get(name));
            } else if (expression.startsWith("!")) {
                const name = expression.slice(1);
                return this.builder
                    .getByTag(name)
                    .map(definition => this.resolveDefinition(name, definition));
            } else if (expression.startsWith("%") && expression.endsWith("%")) {
                return this.getParameter(expression.slice(1, -1));
            }
        }

        throw new Error("Invalid inject options.");
    }

    protected resolveConstructorArguments(definition: ServiceDefinition): any[] {
        const index: ServiceIndex | null = getServiceIndex(Inject.CONSTRUCTOR, definition.getPrototype());
        if (index) {
            return Object.keys(index)
                .map(key => this.resolveService(index[key]));
        }

        return [];
    }

    protected injectMethods<T>(definition: ServiceDefinition<T>, service: T) {
        const index: ServiceIndex | null = getServiceIndex(Inject.METHOD, definition.getPrototype());
        if (index) {
            const keys = Object.keys(index);
            for (const key of keys) {
                service[key](this.resolveService(index[key]));
            }
        }
    }

    protected injectProperties<T>(definition: ServiceDefinition<T>, service: T) {
        const index: ServiceIndex | null = getServiceIndex(Inject.PROPERTY, definition.getPrototype());
        if (index) {
            const keys = Object.keys(index);
            for (const key of keys) {
                service[key] = this.resolveService(index[key])
            }
        }
    }
}