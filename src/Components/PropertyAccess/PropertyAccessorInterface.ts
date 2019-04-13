/*
 * This file is part of the SoureCode package.
 *
 * (c) chapterjason <jason.schilling@sourecode.de>
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

import {PropertyPathType} from "./PropertyPathType";

export interface PropertyAccessorInterface {

    setValue<T>(object: object | Array<any> | any, propertyPath: PropertyPathType, value: T): void;

    getValue<T>(object: object | Array<any> | any, propertyPath: PropertyPathType): T;

}