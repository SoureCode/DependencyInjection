/*
 * This file is part of the SoureCode package.
 *
 * (c) chapterjason <jason.schilling@sourecode.de>
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

import {ParameterStorageInterface} from "../Parameter";

export interface ContainerInterface extends ParameterStorageInterface {

    get<T>(name: string): T;

    set<T>(name: string, service: T): this;

}