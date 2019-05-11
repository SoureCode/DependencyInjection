/*
 * This file is part of the SoureCode package.
 *
 * (c) chapterjason <jason.schilling@sourecode.de>
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

import {Service} from "../../src/DependencyInjection/Decorator/Service";
import {PasswordStrategyInterface} from "./PasswordStrategyInterface";

@Service({name: "strategy.two", tags: ["strategy"]})
export class PasswordStrategyTwo implements PasswordStrategyInterface {

    public hash(password: string) {
        return password.toLowerCase();
    }

}