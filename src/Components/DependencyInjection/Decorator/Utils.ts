/*
 * This file is part of the SoureCode package.
 *
 * (c) chapterjason <jason.schilling@sourecode.de>
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

import {Inject} from "./Inject";
import {ServiceIndex} from "./ServiceIndex";
import {ServiceOptions} from "../ServiceOptions";
import {Service} from "./Service";

/**
 * @ignore
 */
export function tagInjectable(target: any, options: Partial<ServiceOptions>) {
    if (target.prototype) {
        target = target.prototype;
    }

    if (!Reflect.hasMetadata(Service.OPTIONS, target)) {
        Reflect.defineMetadata(Service.OPTIONS, {
            ...Service.DEFAULT,
            ...options
        } as ServiceOptions, target);
    }
}

/**
 * @ignore
 */
export function tagInjectConstructor(target: any, name: string, index: number) {
    if (target.prototype) {
        target = target.prototype;
    }

    if (!Reflect.hasMetadata(Inject.CONSTRUCTOR, target)) {
        Reflect.defineMetadata(Inject.CONSTRUCTOR, {}, target);
    }

    const properties: ServiceIndex = Reflect.getMetadata(Inject.CONSTRUCTOR, target);
    properties[index] = name;
    Reflect.defineMetadata(Inject.CONSTRUCTOR, properties, target);
}

/**
 * @ignore
 */
export function tagInjectProperty(target: any, name: string, key: string | symbol) {
    if (target.prototype) {
        target = target.prototype;
    }

    if (!Reflect.hasMetadata(Inject.PROPERTY, target)) {
        Reflect.defineMetadata(Inject.PROPERTY, {}, target);
    }

    const properties: ServiceIndex = Reflect.getMetadata(Inject.PROPERTY, target);
    properties[key] = name;
    Reflect.defineMetadata(Inject.PROPERTY, properties, target);
}