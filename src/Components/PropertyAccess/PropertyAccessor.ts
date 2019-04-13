/*
 * This file is part of the SoureCode package.
 *
 * (c) chapterjason <jason.schilling@sourecode.de>
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

import {PropertyAccessorInterface} from "./PropertyAccessorInterface";
import {PropertyPathType} from "./PropertyPathType";
import {PropertyPath} from "./PropertyPath";
import {ObjectIndex} from "./ObjectIndex";

export class PropertyAccessor implements PropertyAccessorInterface {

    public getValue<T>(object: object | Array<any> | any, propertyPath: PropertyPathType): T {
        propertyPath = PropertyPath.ensurePath(propertyPath);

        if (propertyPath.length() === 0) {
            return object as T;
        } else {
            const segments: string[] = propertyPath.getSegments();
            const length = segments.length;

            let current: ObjectIndex = object;

            for (let segmentIndex = 0; segmentIndex < length; segmentIndex++) {
                const segment = segments[segmentIndex];

                if (typeof current[segment] !== "undefined") {
                    current = current[segment];
                } else {
                    throw new Error(`Missing segment "${segment}" in path "${propertyPath.toString()}".`);
                }
            }

            return current as T;
        }
    }

    public setValue<T>(object: object | Array<any> | any, propertyPath: PropertyPathType, value: T): void {
        propertyPath = PropertyPath.ensurePath(propertyPath);

        if (propertyPath.length() !== 0) {
            const segments: string[] = propertyPath.getSegments();

            let current: ObjectIndex = object;

            const length = segments.length;
            for (let segmentIndex = 0; segmentIndex < length; segmentIndex++) {
                const segment = segments[segmentIndex];

                if (!current[segment]) {
                    throw new Error(`Missing segment "${segment}" in path "${propertyPath.toString()}".`);
                }

                if (segmentIndex <= segments.length - 2) {
                    current = current[segment];
                } else {
                    current[segment] = value;
                }
            }
        }
    }

}