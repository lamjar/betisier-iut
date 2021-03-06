'use strict';

/*
 * Loads dependencies.
 *
 *     - express pour le serveur
 *     - path pour la gestion de l'arborescence
 *     - body-parser pour parser les requêtes
 *     - handlebars pour le moteur de template.
 */
var express = require('express');
var session = require('express-session');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var handlebars = require('express-handlebars');

/**
 * Exports Express configuration.
 *
 * @param  {object} app
 */
module.exports = function(app) {
    /*
     * Configures the server.
     */
    app.use(bodyParser.urlencoded({
        extended: true
    }));

    /*
     * Sets the port.
     */
    app.set('port', 6800);

    /*
     * Defines the path to views.
     */
    app.set('views', path.join(__dirname, '../app/modules'));

    app.use(cookieParser());

    app.use(session({
        secret: 'nC0@#1pM/-0qA1+é',
        name: 'betisier',
        resave: true,
        saveUninitialized: true
    }));

    /**
     * Imports sessions to all pages.
     *
     * @param  {object} req
     * @param  {object} res
     * @param  {object} next
     */
    app.use(function(req, res, next) {
        res.locals.session = req.session;
        next();
    });

    /**
     * Loads all routes.
     *
     * @type {object}
     * @private
     */
    require('../router')(app);

    /**
     * Manages error pages.
     *
     * @param  {object} err
     * @param  {object} req
     * @param  {object} res
     * @param  {object}
     */
    app.use(function(err, req, res, next) {
        res.title = 'Erreur interne du serveur';
        res.render('./error/views/500', res);
    });

    /*
     * Configures handlebars.
     */
    app.engine('html', handlebars({
        extname: 'html',
        defaultLayout: '../../app/layouts/main',
        partialsDir: [
            'app/partials/'
        ],
        helpers: {
            ifCond: function(v1, operator, v2, options) {

                switch (operator) {
                    case '==':
                        return (v1 == v2) ? options.fn(this) : options.inverse(this);
                    case '===':
                        return (v1 === v2) ? options.fn(this) : options.inverse(this);
                    case '<':
                        return (v1 < v2) ? options.fn(this) : options.inverse(this);
                    case '<=':
                        return (v1 <= v2) ? options.fn(this) : options.inverse(this);
                    case '>':
                        return (v1 > v2) ? options.fn(this) : options.inverse(this);
                    case '>=':
                        return (v1 >= v2) ? options.fn(this) : options.inverse(this);
                    case '&&':
                        return (v1 && v2) ? options.fn(this) : options.inverse(this);
                    case '||':
                        return (v1 || v2) ? options.fn(this) : options.inverse(this);
                    default:
                        return options.inverse(this);
                }
            }
        }
    }));

    app.set('view engine', 'html');
}
