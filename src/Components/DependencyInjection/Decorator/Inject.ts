/*
 * This file is part of the SoureCode package.
 *
 * (c) chapterjason <jason.schilling@sourecode.de>
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

import {tagInjectConstructor, tagInjectMethod, tagInjectProperty} from "./Utils";

export function Inject(name: string) {
    return function (target: Object, key: string | symbol, index?: number | PropertyDescriptor) {
        if (typeof index === "number") {
            tagInjectConstructor(target, name, index);
        } else if (typeof index !== "undefined") {
            if (!index.writable) {
                throw new Error(`Can not inject "${name}" into private or protected methods.`);
            }

            tagInjectMethod(target, name, key);
        } else {
            tagInjectProperty(target, name, key);
        }

    }
}

Inject.CONSTRUCTOR = "inject.constructor";
Inject.PROPERTY = "inject.property";
Inject.METHOD = "inject.method";
