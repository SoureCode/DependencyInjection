/*
 * This file is part of the SoureCode package.
 *
 * (c) chapterjason <jason.schilling@sourecode.de>
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

import {FileLoaderInterface} from "./FileLoaderInterface";
import {FileLoaderOptions} from "./FileLoaderOptions";
import {LoadedFile} from "./LoadedFile";
import * as fs from "fs";
import * as path from "path";
import minimatch from "minimatch";

export class FileLoader implements FileLoaderInterface {

    protected static isIncluded(file: string, includes: string[]) {
        if (includes.length === 0) {
            return true;
        }

        for (const include of includes) {
            if (minimatch(file, include)) {
                return true;
            }
        }

        return false;
    }

    protected static isExcluded(file: string, excludes: string[]) {
        if (excludes.length === 0) {
            return false;
        }

        for (const exclude of excludes) {
            if (minimatch(file, exclude)) {
                return true;
            }
        }

        return false;
    }

    public load(file: string): LoadedFile {
        const fullPath = require.resolve(file);
        return {
            path: fullPath,
            contents: require(fullPath)
        };
    }

    public loadDirectory(directory: string, options?: Partial<FileLoaderOptions>): LoadedFile[] {
        const files = this.getFiles(directory, {
            excludes: [],
            includes: [],
            ...options,
        } as FileLoaderOptions);

        return files
            .map(file => this.load(file));
    }

    protected getFiles(directory: string, options: FileLoaderOptions) {
        const items = fs.readdirSync(directory)
            .map(item => path.resolve(directory, item));

        const files = items
            .filter(item => {
                const valid = fs.statSync(item).isFile() && path.extname(item) === ".js";

                if (!valid) {
                    return false;
                }

                const isIncluded = FileLoader.isIncluded(item, options.includes);
                const isExcluded = FileLoader.isExcluded(item, options.excludes);

                return !(!isIncluded && isExcluded);
            });

        const directories = items.filter(item => fs.statSync(item).isDirectory());
        for (const subDirectory of directories) {
            files.push(...this.getFiles(subDirectory, options));
        }

        return files;
    }

}