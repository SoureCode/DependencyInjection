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
import * as path from "path";
import {PropertyPath} from "../PropertyAccess/PropertyPath";
import {PropertyPathInterface} from "../PropertyAccess/PropertyPathInterface";
import {FileLoaderInterface} from "../FileLoader/FileLoaderInterface";
import {FileLoader} from "../FileLoader/FileLoader";
import {FileLoaderOptions} from "../FileLoader/FileLoaderOptions";

export class ContainerBuilder extends AbstractRepository<ServiceDefinition> implements ContainerBuilderInterface {

    protected fileLoader: FileLoaderInterface = new FileLoader();

    protected static extractName(directory: string, file: string, property: string) {
        const relativePath = path.relative(directory, file).slice(0, -path.extname(file).length);
        let name: PropertyPathInterface = new PropertyPath(relativePath.replace(/[/\\]/g, "."));

        if (property !== "default" && property !== path.basename(file, path.extname(file))) {
            name = name.child(property);
        }
        return name;
    }

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

    public addDirectory(directory: string, options?: Partial<FileLoaderOptions>): this {
        const files = this.fileLoader.loadDirectory(directory, options);

        for (const file of files) {
            const properties = Object.keys(file.contents);

            for (const property of properties) {
                const service = file.contents[property];

                if (typeof service === "function") {
                    const options = Reflect.getMetadata(Service.OPTIONS, service.prototype);

                    if (!options || typeof options.name === "undefined") {
                        const name = ContainerBuilder.extractName(directory, file.path, property);
                        this.add(service, {name: name.toString()});
                        continue;
                    }

                    this.add(service);
                }
            }
        }

        return this;
    }

    public remove(name: string): this {
        const definition = this.get(name);
        if (definition) {
            delete this.items[definition.getName()];
        }
        return this;
    }

}