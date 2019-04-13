/*
 * This file is part of the SoureCode package.
 *
 * (c) chapterjason <jason.schilling@sourecode.de>
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

import {PasswordStrategyInterface} from "./PasswordStrategyInterface";

export class PasswordStrategyOne implements PasswordStrategyInterface {

    public hash(password: string) {
        return password.toUpperCase();
    }

}