/*
 * This file is part of the SoureCode package.
 *
 * (c) chapterjason <jason.schilling@sourecode.de>
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

import {Criteria} from "./Criteria";
import {Order} from "./Order";

export interface RepositoryInterface<T> {

    findAll(): T[];

    findBy<C = any>(criteria: Criteria<C>, orderBy?: Order | null, limit?: number | null, offset?: number | null): T[];

    findOneBy<C = any>(criteria: Criteria<C>, orderBy?: Order | null): T | null;

}
