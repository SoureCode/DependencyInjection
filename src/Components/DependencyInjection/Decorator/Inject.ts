/*
 * This file is part of the SoureCode package.
 *
 * (c) chapterjason <jason.schilling@sourecode.de>
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

import {tagInjectConstructor, tagInjectProperty} from "./Utils";

export function Inject(name: string) {
    return function (target: Object, key: string | symbol, index?: number) {
        if (typeof index === "number") {
            tagInjectConstructor(target, name, index);
        } else {
            tagInjectProperty(target, name, key);
        }

    }
}

Inject.CONSTRUCTOR = "injection.constructor";
Inject.PROPERTY = "injection.property";
