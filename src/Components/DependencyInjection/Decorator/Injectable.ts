/*
 * This file is part of the SoureCode package.
 *
 * (c) chapterjason <jason.schilling@sourecode.de>
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

import {ServiceOptions} from "../ServiceOptions";
import {tagInjectable} from "./Utils";

export function Injectable(options: Partial<ServiceOptions>) {
    return function (target: any) {
        tagInjectable(target, options);
        return target;
    };
}

Injectable.OPTIONS = "injectable.options";
Injectable.DEFAULT = {
    lazy: true,
    shared: true,
    tags: [],
    aliases: [],
};