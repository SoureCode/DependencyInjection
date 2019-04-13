/*
 * This file is part of the SoureCode package.
 *
 * (c) chapterjason <jason.schilling@sourecode.de>
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

module.exports = {
    errorOnDeprecated: true,
    "rootDir": "./",
    "transform": {
        "^.+\\.(ts|tsx)?$": "ts-jest"
    },
    "globals": {
        "ts-jest": {
            "tsConfig": "tsconfig.json"
        }
    },
    "collectCoverage": false,
    "collectCoverageFrom": [
        "src/**/*.{ts,tsx}",
        "!**/node_modules/**",
        "!**/vendor/**"
    ],
    "testRegex": "/__tests__/.*\\.test\\.(ts|tsx)?$",
    "moduleFileExtensions": [
        "ts",
        "tsx",
        "js",
        "jsx",
        "json",
        "node"
    ],
};
