/*
 * This file is part of the SoureCode package.
 *
 * (c) chapterjason <jason.schilling@sourecode.de>
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

import {RepositoryInterface} from "./RepositoryInterface";
import {PropertyAccessor, PropertyAccessorInterface, PropertyPathType} from "../PropertyAccess";
import {Criteria} from "./Criteria";
import {Order} from "./Order";

export abstract class AbstractRepository<T> implements RepositoryInterface<T> {

    protected items: T[] = [];

    protected propertyAccessor: PropertyAccessorInterface = new PropertyAccessor();

    public findAll(): T[] {
        return this.items;
    }

    public findBy<C = any>(criteria: Criteria<C>, orderBy: Order | null = null, limit: number | null = null, offset: number | null = null): T[] {
        const foundItems: T[] = [];

        for (const item of this.items) {
            let match = true;
            for (const [propertyPath, value] of criteria) {
                const itemValue = this.propertyAccessor.getValue<C>(item, propertyPath);
                if(Array.isArray(itemValue)){
                    if(itemValue.indexOf(value) === -1){
                        match = false;
                    }
                }else{
                    if(itemValue !== value){
                        match = false;
                    }
                }
            }

            if (match) {
                foundItems.push(item);
            }
        }

        const ordered = ((orderBy) ? this.getOrdered(foundItems, orderBy) : foundItems);
        return ((limit) ? this.slice(ordered, limit, offset) : ordered);
    }

    public findOneBy<C = any>(criteria: Criteria<C>, orderBy: Order | null = null): T | null {
        const items = ((orderBy) ? this.getOrdered(this.items, orderBy) : this.items);

        for (const item of items) {
            let match = true;
            for (const [propertyPath, value] of criteria) {
                const itemValue = this.propertyAccessor.getValue<C|C[]>(item, propertyPath);
                if(Array.isArray(itemValue)){
                    if(itemValue.indexOf(value) === -1){
                        match = false;
                    }
                }else{
                    if(itemValue !== value){
                        match = false;
                    }
                }
            }

            if (match) {
                return item;
            }
        }

        return null;
    }

    protected sortByProperty(items: T[], property: PropertyPathType): T[] {
        return items.sort((a, b) => {
            const valueA = this.propertyAccessor.getValue<string>(a, property);
            const valueB = this.propertyAccessor.getValue<string>(b, property);
            return valueA.localeCompare(valueB);
        });
    }

    protected slice(items: T[], limit: number | null = null, offset: number | null = null): T[] {
        const begin = (offset || 0);
        const end = (limit) ? (begin + limit) : this.items.length;
        return items.slice(begin, end);
    }

    protected getOrdered(items: T[], orderBy: Order) {
        items = this.sortByProperty(items, orderBy[0]);

        if (orderBy[1].toUpperCase() === "DESC") {
            return items.reverse();
        } else {
            return items;
        }
    }

}
