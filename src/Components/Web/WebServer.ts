/*
 * This file is part of the SoureCode package.
 *
 * (c) chapterjason <jason.schilling@sourecode.de>
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

import {Service} from "../DependencyInjection/Decorator/Service";
import {Inject} from "../DependencyInjection/Decorator/Inject";
import {ControllerInterface} from "./ControllerInterface";
import {WebServerOptions} from "./WebServerOptions";
import * as http from "http";
import {RouteOptions} from "./RouteOptions";
import {PropertyPath} from "../PropertyAccess/PropertyPath";
import {Route} from "./Decorator/Route";
import {RouteDefinition} from "./RouteDefinition";
import {Application, NextFunction, Request, Response} from "express";

@Service({name: "sourecode.webserver"})
export class WebServer {

    @Inject("@express.application")
    protected application: Application;

    @Inject("!webserver.controller")
    protected controllers: ControllerInterface[];

    @Inject("%sourecode.webserver.options%")
    protected options: WebServerOptions;

    protected httpServer: http.Server;

    public constructor() {
        try {
            require.resolve("express");
        } catch (e) {
            throw new Error(`Missing dependency "express". If you want to use the WebServer service you need to install express. If you are using yarn install it with "yarn add express" or "npm install express" for npm.`);
        }
    }

    public close() {
        this.httpServer.close();
    }

    public async listen() {
        const {
            http: httpOptions,
            // https: httpsOptions
        } = this.options;

        for (const controller of this.controllers) {
            this.registerController(controller);
        }

        this.httpServer = http.createServer(this.application);
        // https.createServer({}, this.application).listen(httpsOptions.port);

        return new Promise((resolve, reject) => {
            this.httpServer.on('error', (error) => {
                reject(error);
            });

            this.httpServer.on('close', (error) => {
                resolve();
            });

            this.httpServer.listen(httpOptions.port, () => {
                console.log(`Listening on port ${httpOptions.port}!`)
            });

            // this.httpsServer.listen(httpsOptions.port);
        });
    }

    protected registerController(controller: ControllerInterface) {
        const base: RouteOptions = Reflect.getMetadata(Route.CLASS, controller.constructor.prototype);
        const routes: RouteDefinition[] = Reflect.getMetadata(Route.METHOD, controller.constructor.prototype);

        const basePath = new PropertyPath([base.path], "/");

        for (const route of routes) {
            this.registerRoute(basePath, {
                methods: base.methods,
                ...route,
            }, controller);
        }
    }

    protected registerRoute(basePath: PropertyPath, route: RouteDefinition, controller: ControllerInterface) {
        const routePath = basePath.child(route.path);
        const {methods, action} = route;

        const path = "/" + routePath.toString();
        const callback = async (request: Request, response: Response, next: NextFunction) => {
            const params = Object.keys(request.params).map(key => request.params[key]);
            try {
                await controller[action](...params, request, response, next);
            } catch (error) {
                console.error(error);
            }
        };

        if (methods.length === 0) {
            this.application.all(path, callback);
        } else {
            for (const method of methods) {
                this.application[method](path, callback);
            }
        }
    }

}
