/*
 * This file is part of the SoureCode package.
 *
 * (c) chapterjason <jason.schilling@sourecode.de>
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

export interface ParameterStorageInterface {

    getParameter<T = any>(key: string): T | null;

    setParameter<T = any>(key: string, value: T): this;

    hasParameter(key: string): boolean;

}