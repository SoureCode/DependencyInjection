/*
 * This file is part of the SoureCode package.
 *
 * (c) chapterjason <jason.schilling@sourecode.de>
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

import {RepositoryInterface} from "../Repository/RepositoryInterface";
import {Constructable} from "./Constructable";
import {ServiceOptions} from "./ServiceOptions";
import {ServiceDefinition} from "./ServiceDefinition";
import {FileLoaderOptions} from "../FileLoader/FileLoaderOptions";

export interface ContainerBuilderInterface extends RepositoryInterface<ServiceDefinition> {

    add<T = any>(service: Constructable<T>, options?: Partial<ServiceOptions>): this;

    addDirectory(directory: string, options?: Partial<FileLoaderOptions>): this;

    remove(name: string): this;

    get<T = any>(name: string): ServiceDefinition<T> | null;

    getByTag<T = any>(tag: string): ServiceDefinition<T>[];

}
