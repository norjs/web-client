import _ from 'lodash';
import minimist from 'minimist';
import EXEC from 'nor-exec';
import path from 'path';

const ROOT_DIR = path.resolve(path.join(__dirname, '..'));
const PACKAGE_JSON_FILE = path.join(ROOT_DIR, 'package.json');
const CLIENT_DIR = path.join(ROOT_DIR, './src/client');
const CURRENT_DIR = process.cwd();
const DIST_DIR = path.join(CLIENT_DIR, './dist');

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
 */
function run (args) {
	const NORJS_CONFIG_FILE = path.resolve(CURRENT_DIR, _.first(args));
	process.chdir(CLIENT_DIR);
	exec('npm', ['start'], {
		NORJS_CONFIG_FILE
	}).catch(handleErrors);
}

/**
 *
 * @param args
 */
function build (args) {
	const NORJS_CONFIG_FILE = path.resolve(CURRENT_DIR, _.first(args));
	process.chdir(CLIENT_DIR);
	exec('npm', ['run', '-s', 'build'], {
		NORJS_CONFIG_FILE
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
 */
function executeCommands (commands) {

	if (commands.length === 0) {
		usage();
		return;
	}


	_.forEach(commands, (command, index) => {
		switch (command) {

		case COMMANDS.RUN:
			run(commands.slice(index+1));
			return EXIT_FOREACH;

		case COMMANDS.BUILD:
			build(commands.slice(index+1));
			return EXIT_FOREACH;

		case COMMANDS.INSTALL:
			install(commands.slice(index+1));
			return EXIT_FOREACH;

		case COMMANDS.VERSION:
			version(commands.slice(index+1));
			return EXIT_FOREACH;

		case COMMANDS.ENV:
			print_env(commands.slice(index+1));
			return EXIT_FOREACH;

		default:
			console.error('Unknown command: ', command);
			usage(commands.slice(index+1));
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
		executeCommands(argv._);
	} catch (err) {
		handleErrors(err);
	}
}
