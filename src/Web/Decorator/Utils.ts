/*
 * This file is part of the SoureCode package.
 *
 * (c) chapterjason <jason.schilling@sourecode.de>
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

import "reflect-metadata";
import {RouteOptions} from "../RouteOptions";
import {Route} from "./Route";
import {Service} from "../../DependencyInjection/Decorator/Service";
import {ServiceOptions} from "../../DependencyInjection/ServiceOptions";
import {RouteDefinition} from "../RouteDefinition";

/**
 * @ignore
 */
export function tagClassRoute(target: any, options: Partial<RouteOptions>) {
    if (target.prototype) {
        target = target.prototype;
    }

    const opts = {path: "/", ...options};

    Reflect.defineMetadata(Route.CLASS, opts, target);

    const definedOptions: ServiceOptions | undefined = Reflect.getOwnMetadata(Service.OPTIONS, target);

    if (typeof definedOptions !== "undefined") {
        const {tags} = definedOptions;

        if (tags.indexOf("webserver.controller") === -1) {
            tags.push("webserver.controller");
        }

        Reflect.defineMetadata(Service.OPTIONS, {
            ...definedOptions,
            tags,
        }, target);
    } else {
        Reflect.defineMetadata(Service.OPTIONS, {
            tags: ["webserver.controller"],
        }, target)
    }

}

/**
 * @ignore
 */
export function tagMethodRoute(target: any, options: Partial<RouteDefinition>) {
    if (target.prototype) {
        target = target.prototype;
    }

    if (!Reflect.hasOwnMetadata(Route.METHOD, target)) {
        Reflect.defineMetadata(Route.METHOD, [], target);
    }

    const routes = Reflect.getOwnMetadata(Route.METHOD, target);

    if (typeof options === "undefined") {
        throw new Error("Missing route options.");
    }

    if (typeof options.path === "undefined") {
        throw new Error("Missing route path option.");
    }

    routes.push({
        methods: [],
        ...options
    } as RouteOptions);

    Reflect.defineMetadata(Route.METHOD, routes, target);
}
