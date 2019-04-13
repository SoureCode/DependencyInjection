/*
 * This file is part of the SoureCode package.
 *
 * (c) chapterjason <jason.schilling@sourecode.de>
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

export interface PropertyPathInterface {

    setSeparator(separator: string): void;

    getSeparator(): string;

    toString(): string;

    getSegments(): string[];

    parent(): PropertyPathInterface | null;

    child(segment: string): PropertyPathInterface;

    length(): number;

    end(): string | null;

}
