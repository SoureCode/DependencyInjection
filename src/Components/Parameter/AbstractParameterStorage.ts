/*
 * This file is part of the SoureCode package.
 *
 * (c) chapterjason <jason.schilling@sourecode.de>
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

import {ParameterStorageInterface} from "./ParameterStorageInterface";
import {ParamterStorageIndex} from "./ParamterStorageIndex";

export abstract class AbstractParameterStorage implements ParameterStorageInterface {

    protected storage: ParamterStorageIndex = {};

    public getParameter<T = any>(key: string): T | null {
        if (key in this.storage) {
            return this.storage[key];
        }

        return null;
    }

    public hasParameter(key: string): boolean {
        return key in this.storage;
    }

    public setParameter<T = any>(key: string, value: T): this {
        this.storage[key] = value;

        return this;
    }

}