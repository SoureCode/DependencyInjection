/*
 * This file is part of the SoureCode package.
 *
 * (c) chapterjason <jason.schilling@sourecode.de>
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

import {FileLoaderOptions} from "./FileLoaderOptions";
import {LoadedFile} from "./LoadedFile";

export interface FileLoaderInterface {

    loadDirectory(directory: string, options?: Partial<FileLoaderOptions>): LoadedFile[];

    load(file: string): LoadedFile;

}
