/*
 * This file will eventually use ENV options. For now it only has constants.
 */

const ENV = process && process.env || {};

/**
 * The default language setting for angular-translate.
 *
 * The keyword from `./src/nrTranslations/{KEY}.json`.
 *
 * @type {string}
 */
export const PREFERRED_LANGUAGE = ENV.NORJS_PREFERRED_LANGUAGE || 'en';
