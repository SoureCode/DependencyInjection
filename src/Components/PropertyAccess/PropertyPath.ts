/*
 * This file is part of the SoureCode package.
 *
 * (c) chapterjason <jason.schilling@sourecode.de>
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

import {PropertyPathType} from "./PropertyPathType";
import {PropertyPathInterface} from "./PropertyPathInterface";

export class PropertyPath implements PropertyPathInterface {

    protected separator: string;

    protected segments: string[];

    public constructor(path?: PropertyPathType, separator: string = ".") {
        this.separator = separator;

        if (path instanceof PropertyPath) {
            this.segments = this.normalize(path.getSegments());
        } else if (Array.isArray(path)) {
            this.segments = this.normalize(path);
        } else if (typeof path === "string") {
            this.segments = this.normalize(path);
        } else {
            this.segments = [];
        }
    }

    public static ensurePath(path: PropertyPathType, separator: string = "."): PropertyPathInterface {
        if (path instanceof PropertyPath) {
            return path;
        } else {
            return new PropertyPath(path, separator);
        }
    }

    public setSeparator(separator: string) {
        this.separator = separator;
    }

    public getSeparator(): string {
        return this.separator;
    }

    public toString(): string {
        return this.segments.join(this.separator);
    }

    public getSegments(): string[] {
        return this.segments;
    }

    public parent(): PropertyPathInterface | null {
        if (this.segments.length === 0) {
            return null;
        } else {
            return new PropertyPath(this.segments.slice(0, -1), this.separator);
        }
    }

    public child(segment: string): PropertyPathInterface {
        return new PropertyPath(this.segments.concat(this.normalize(segment)), this.separator);
    }

    public length(): number {
        return this.segments.length;
    }

    public end(): string | null {
        if (this.segments.length === 0) {
            return null;
        } else {
            return this.segments[this.segments.length - 1];
        }
    }

    protected normalize(segment: string | string[]): string[] {
        if (typeof segment === "string") {
            segment = segment.split(this.separator);
        }

        segment = ([] as string[]).concat(...segment.map(item => item.split(this.separator)));

        return segment
            .filter(segment => (segment || "").toString().length)
            .map(segment => segment.trim())
            .filter(segment => segment.length);
    }

}
