/*
 * This file is part of the SoureCode package.
 *
 * (c) chapterjason <jason.schilling@sourecode.de>
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

import {RouteOptions} from "../RouteOptions";
import {tagClassRoute, tagMethodRoute} from "./Utils";
import {RouteDefinition} from "../RouteDefinition";

export function Route(options?: Partial<RouteOptions>) {
    return function (target: any, key?: string, property?: PropertyDescriptor) {
        if (typeof key === "undefined" && typeof property === "undefined") {
            tagClassRoute(target, {...options});
            return target;
        } else {
            tagMethodRoute(target, {action: key, ...options} as RouteDefinition);

            return property;
        }
    };
}

Route.METHOD = "controller.routes";
Route.CLASS = "controller.options";
