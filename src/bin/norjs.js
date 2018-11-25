import _ from 'lodash';
import minimist from 'minimist';
import EXEC from 'nor-exec';
import PATH from 'path';

const ROOT_DIR = PATH.resolve(PATH.join(__dirname, '..'));
const PACKAGE_JSON_FILE = PATH.join(ROOT_DIR, 'package.json');
const CLIENT_DIR = PATH.join(ROOT_DIR, './src/client');
const CURRENT_DIR = process.cwd();
const DIST_DIR = PATH.join(CLIENT_DIR, './dist');

const PRODUCT = 'norjs';
const MODEL = 're';
const VERSION = _.get(require(PACKAGE_JSON_FILE), 'version', 'n/a');

/**
 * _.forEach will exit iteration if it returns `false`.
 *
 * This is syntax sugar for readability.
 *
 * @type {boolean}
 */
const EXIT_FOREACH = false;

function exec (name, args, env) {
	return EXEC(name, args, {
		env,
		stdio: ['inherit', 'inherit', 'inherit']
	}, {
		stdout: false,
		stderr: false
	});
}

/**
 *
 * @type {{RUN: string, BUILD: string}}
 */
const COMMANDS = {
	RUN: 'run'
	, BUILD: 'build'
	, INSTALL: 'install'
	, VERSION: 'version'
	, ENV: 'env'
};

/**
 *
 * @param value {Array.<*>|*} Parse the value into an array, if it exists.
 * @returns {Array}
 */
function parseToArray (value) {
	return value ? (_.isArray(value) ? value : [value]) : [];
}

/**
 * Parse `argv.import`
 *
 * @param argv
 * @returns {Array.<string>}
 */
function parseImport (argv) {
	return _.map(
		parseToArray(argv.import)
		, path => PATH.resolve(PATH.join(CURRENT_DIR, path))
	);
}

/**
 * Handle errors.
 *
 * @param err {Error}
 */
function handleErrors (err) {
	console.error('Exception: ', err);
}

/**
 *
 */
function print_env () {
	console.log( `DIST_DIR: "${DIST_DIR}"` );
}

/**
 *
 */
function version () {
	console.log( `${PRODUCT}@${MODEL} v${VERSION}` );
}

/**
 *
 * @param args
 * @param argv
 */
function run (args, argv) {
	const NORJS_CONFIG_FILE = PATH.resolve(CURRENT_DIR, _.first(args));
	const NORJS_EXTERNAL_FILES = parseImport(argv).join(':');
	process.chdir(CLIENT_DIR);
	exec('npm', ['start'], {
		NORJS_CONFIG_FILE
		, NORJS_EXTERNAL_FILES
	}).catch(handleErrors);
}

/**
 *
 * @param args
 * @param argv
 */
function build (args, argv) {
	const NORJS_CONFIG_FILE = PATH.resolve(CURRENT_DIR, _.first(args));
	const NORJS_EXTERNAL_FILES = parseImport(argv).join(':');
	process.chdir(CLIENT_DIR);
	exec('npm', ['run', '-s', 'build'], {
		NORJS_CONFIG_FILE
		, NORJS_EXTERNAL_FILES
	}).then(() => {
		console.log('norjs build OK');
	}).catch(handleErrors);
}

/**
 *
 */
function install () {
	process.chdir(CLIENT_DIR);
	exec('npm', ['install', '-s', '-d']).then(() => {
		console.log('norjs install OK');
	}).catch(handleErrors);
}

/**
 * Print usage information.
 */
function usage () {
	console.error(
		`USAGE: norjs COMMAND [OPT(S)]
  version - version information
  install - install dependencies
  build SOURCE_FILE - build static files for production 
  run SOURCE_FILE - run app for development
  env - print environment information
`
	);
}

/**
 *
 * @param commands {Array.<string>}
 * @param argv
 */
function executeCommands (commands, argv) {

	if (commands.length === 0) {
		usage(commands, argv);
		return;
	}


	_.forEach(commands, (command, index) => {
		switch (command) {

		case COMMANDS.RUN:
			run(commands.slice(index+1), argv);
			return EXIT_FOREACH;

		case COMMANDS.BUILD:
			build(commands.slice(index+1), argv);
			return EXIT_FOREACH;

		case COMMANDS.INSTALL:
			install(commands.slice(index+1), argv);
			return EXIT_FOREACH;

		case COMMANDS.VERSION:
			version(commands.slice(index+1), argv);
			return EXIT_FOREACH;

		case COMMANDS.ENV:
			print_env(commands.slice(index+1), argv);
			return EXIT_FOREACH;

		default:
			console.error('Unknown command: ', command);
			usage(commands.slice(index+1), argv);
			return EXIT_FOREACH;
		}
	});

}

/**
 *
 * @param argv {Array.<string>} Command line options
 */
export function main (argv) {
	argv = minimist(argv.slice(2));
	try {
		executeCommands(argv._, argv);
	} catch (err) {
		handleErrors(err);
	}
}
