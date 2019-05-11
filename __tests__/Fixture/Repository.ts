/*
 * This file is part of the SoureCode package.
 *
 * (c) chapterjason <jason.schilling@sourecode.de>
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

import {AbstractRepository} from "../../src/Repository/AbstractRepository";
import {Foo} from "./Foo";

export class Repository extends AbstractRepository<Foo> {

    public add(foo: Foo) {
        this.items.push(foo);
    }

}
