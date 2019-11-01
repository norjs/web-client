import _ from 'lodash';
import minimist from 'minimist';
import EXEC from 'nor-exec';
import PATH from 'path';
import FS from 'fs';

const ROOT_DIR = PATH.resolve(PATH.join(__dirname, '..'));
const PACKAGE_JSON_FILE = PATH.join(ROOT_DIR, 'package.json');
const CLIENT_DIR = PATH.join(ROOT_DIR, './src/client');
let CURRENT_DIR = process.cwd();
const DIST_DIR = PATH.join(CLIENT_DIR, './dist');

const PRODUCT = 'norjs';
const MODEL = 're';

if (!PACKAGE_JSON_FILE) {
	throw new TypeError("PACKAGE_JSON_FILE is invalid: " + PACKAGE_JSON_FILE);
}

const VERSION = _.get(require(PACKAGE_JSON_FILE), 'version', 'n/a');

/**
 * _.forEach will exit iteration if it returns `false`.
 *
 * This is syntax sugar for readability.
 *
 * @type {boolean}
 */
const EXIT_FOREACH = false;

/**
 *
 * @param name
 * @param args
 * @param env
 * @param detached {boolean} If true, the child process will be detached.
 * @param disconnect {boolean} If true, disconnect IPC channel to the child.
 * @returns {Promise<{retval: number, stdout: string, stderr: string} | string>}
 */
function exec (name, args, env, {detached = false, disconnect = true} = {}) {

	const promise = EXEC(name, args, {
		env,
		stdio: ['pipe', 'inherit', 'inherit']
	}, {
		stdout: false,
		stderr: false,
		detached,
		disconnect
	});

	let childRunning = true;
	let childKilled = false;

	const child = promise.CHILD;

	child.on('exit', () => childRunning = false);

	if (child.stdin) child.stdin.end();

	function killChild (reason) {

		if (childKilled || !childRunning) return;

		console.error(`Received "${reason}" - Killing child #${child.pid}`);
		child.kill();
		childKilled = true;

	}

	process.on("exit", () => killChild("exit"));
	process.on("SIGTERM", () => killChild("SIGTERM"));
	process.on("SIGINT", () => killChild("SIGINT"));
	process.on("SIGUSR1", () => killChild("SIGUSR1"));
	process.on("SIGUSR2", () => killChild("SIGUSR2"));
	process.on("SIGHUP", () => killChild("SIGHUP"));
	process.on('uncaughtException', () => killChild("uncaughtException"));

	return promise;
}

/**
 *
 * @type {{RUN: string, BUILD: string, INSTALL: string, VERSION: string, ENV: string}}
 */
const COMMANDS = {

	/**
	 * Command for running the app in a development mode (eg. `"run"`)
	 */
	RUN: 'run'

	/**
	 * Command for running the app in a development mode (eg. `"run-prod"`)
	 */
	, RUN_PROD: 'run-prod'

	/**
	 * Command for building for production (eg. `"build"`)
	 */
	, BUILD: 'build'

	/**
	 * Command for installing the NorJS RE (eg. `"install"`)
	 */
	, INSTALL: 'install'

	/**
	 * Command for displaying version information (eg. `"version"`)
	 */
	, VERSION: 'version'

	/**
	 * Command for displaying environment options (eg. `"env"`)
	 */
	, ENV: 'env'

};

/**
 * Returns true if file is a directory.
 *
 * @param file {string}
 * @returns {boolean}
 */
function isDirectory (file) {
	try {
		return FS.lstatSync(file).isDirectory();
	} catch (err) {
		return false;
	}
}

/**
 * Returns true if file is a regular file.
 *
 * @param file {string}
 * @returns {boolean}
 */
function isRegularFile (file) {
	try {
		return FS.lstatSync(file).isFile();
	} catch (err) {
		return false;
	}
}

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
		, path => PATH.resolve(fixArgumentPath("import", path, CURRENT_DIR))
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
function commandPrintEnv () {
	console.log( `DIST_DIR: "${DIST_DIR}"` );
}

/**
 *
 */
function commandVersion () {
	console.log( `${PRODUCT}@${MODEL} v${VERSION}` );
}

/**
 *
 * @param args {[]}
 * @param argv {{}}
 * @returns {string}
 */
function parseConfigArgument (args, argv) {

	//if (args.length <= 0 && !argv.config) {
	//	throw new TypeError("You need to specify at least --config=FILE");
	//}

	return fixArgumentPath(
		"config"
		, args.length >= 1
			? _.first(args)
			: (
				argv.config
					? (
						_.isArray(argv.config)
							? _.first(argv.config)
							: argv.config
					)
					: argv.dir
			)
		, CURRENT_DIR
	);

}

/**
 * Parse and initialize command line options.
 *
 * @param args
 * @param argv
 * @returns {{NORJS_CONFIG_FILE: string, NORJS_EXTERNAL_FILES: string}}
 */
function parseArguments (args, argv) {

	if (argv.cwd) {
		const cwdArray = parseToArray(argv.cwd);
		const cwd = cwdArray.length >= 1 ? _.last(cwdArray) : undefined;
		process.chdir(cwd);
		CURRENT_DIR = process.cwd();
	}

	if (!argv.dir) {
		if (args.length && isDirectory(_.first(args))) {
			argv.dir = fixArgumentPath("dir", args.shift(), CURRENT_DIR);
		} else {
			argv.dir = CURRENT_DIR;
		}
	} else {
		argv.dir = fixArgumentPath("dir", argv.dir, CURRENT_DIR);
	}

	if (!argv.options && isRegularFile(PATH.join(argv.dir, "norjs.json"))) {
		argv.options = PATH.join(argv.dir, "norjs.json");
	}

	if (argv.options) {
		const optionsArray = parseToArray(argv.options);
		_.forEach(optionsArray, optionsFile => {
			if (!optionsFile) throw new TypeError("--options argument is invalid: " + optionsFile);
			let fullOptionsFile = fixArgumentPath("options", optionsFile, CURRENT_DIR);
			if (!fullOptionsFile) throw new TypeError("--options argument is invalid: " + fullOptionsFile);
			const baseDir = PATH.dirname(fullOptionsFile);
			const options = require(fullOptionsFile);
			_.forEach(_.keys(options), key => {
				const values = parseToArray(options[key]);
				_.forEach(values, value => {
					if (argv[key] === undefined) {
						argv[key] = fixArgumentPath(key, value, baseDir);
					} else {
						if (!_.isArray(argv[key])) {
							argv[key] = [argv[key]];
						}
						argv[key].push(fixArgumentPath(key, value, baseDir));
					}
				});
			});
		});
	}

	const NORJS_CONFIG_FILE = parseConfigArgument(args, argv);
	const NORJS_EXTERNAL_FILES = parseImport(argv).join(':');
	process.chdir(CLIENT_DIR);
	return {NORJS_CONFIG_FILE, NORJS_EXTERNAL_FILES};
}

/**
 *
 * @param args
 * @param argv
 */
function commandRun (args, argv) {
	const {NORJS_CONFIG_FILE, NORJS_EXTERNAL_FILES} = parseArguments(args, argv);
	return exec('npm', ['start'], {
		NORJS_CONFIG_FILE
		, NORJS_EXTERNAL_FILES
	}, {
		detached: true
	}).catch(handleErrors);
}

/**
 *
 * @param args
 * @param argv
 */
function commandRunProd (args, argv) {
	const {NORJS_CONFIG_FILE, NORJS_EXTERNAL_FILES} = parseArguments(args, argv);
	return exec('npm', ['run', 'server-prod'], {
		NORJS_CONFIG_FILE
		, NORJS_EXTERNAL_FILES
	}, {
		detached: true
	}).catch(handleErrors);
}

/**
 *
 * @param args
 * @param argv
 */
function commandBuild (args, argv) {
	const {NORJS_CONFIG_FILE, NORJS_EXTERNAL_FILES} = parseArguments(args, argv)
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
function commandInstall (args, argv) {
	parseArguments(args, argv);
	exec('npm', ['install', '-s', '-d']).then(() => {
		console.log('norjs install OK');
	}).catch(handleErrors);
}

/**
 * Print usage information.
 */
function commandUsage () {
	console.error(
		`USAGE: norjs COMMAND [OPT(S)]
		
  version - version information
  install - install dependencies
  build SOURCE_FILE - build static files for production 
  run SOURCE_FILE - run app for development
  env - print environment information
  
Where OPT(S) are:
  
    --cwd=DIR           -- Change current working directory. 
                           Note! This affects other paths in options.
    --dir=DIR           -- Change default directory, defaults to CWD.
    --import=FILE|DIR   -- import this file or DIR/app.js inside the client side app
    --config=FILE|DIR   -- Configure the app using this file or DIR/app.json
    --options=FILE|DIR  -- Read command line options from this file or DIR/norjs.json
`
	);
}

/**
 * If the keyword is a for one of the paths, fix the path with baseDir.
 *
 * @param key {string} The argument keyword
 * @param path {string} The argument value
 * @param baseDir {string} The base directory
 */
function fixArgumentPath (key, path, baseDir) {
	if (!key) throw new TypeError("key is invalid: " + key);
	if (!path) throw new TypeError("path is invalid: " + path);
	if (!baseDir) throw new TypeError("baseDir is invalid: " + baseDir);

	switch (key) {

	case 'config':
		if (PATH.isAbsolute(path)) {
			if (isDirectory(path)) {
				return PATH.join(path, "app.json");
			}
			return path;
		} else {
			if (isDirectory(PATH.join(baseDir, path))) {
				return PATH.join(baseDir, path, "app.json");
			}
			return PATH.join(baseDir, path);
		}

	case 'options':
		if (PATH.isAbsolute(path)) {
			if (isDirectory(path)) {
				return PATH.join(path, "norjs.json");
			}
			return path;
		} else {
			if (isDirectory(PATH.join(baseDir, path))) {
				return PATH.join(baseDir, path, "norjs.json");
			}
			return PATH.join(baseDir, path);
		}

	case 'import':
		if (PATH.isAbsolute(path)) {
			if (isDirectory(path)) {
				return PATH.join(path, "app.js");
			}
			return path;
		} else {
			if (isDirectory(PATH.join(baseDir, path))) {
				return PATH.join(baseDir, path, "app.js");
			}
			return PATH.join(baseDir, path);
		}

	case 'dir':
	case 'cwd':
		return PATH.isAbsolute(path) ? path : PATH.join(baseDir, path);

	default:
		return path;
	}
}

/**
 *
 * @param commands {Array.<string>}
 * @param argv
 */
function executeCommands (commands, argv) {

	if (commands.length === 0) {
		commandUsage(commands, argv);
		return;
	}

	_.forEach(commands, (command, index) => {
		switch (command) {

		case COMMANDS.RUN:
			commandRun(commands.slice(index+1), argv);
			return EXIT_FOREACH;

		case COMMANDS.RUN_PROD:
			commandRunProd(commands.slice(index+1), argv);
			return EXIT_FOREACH;

		case COMMANDS.BUILD:
			commandBuild(commands.slice(index+1), argv);
			return EXIT_FOREACH;

		case COMMANDS.INSTALL:
			commandInstall(commands.slice(index+1), argv);
			return EXIT_FOREACH;

		case COMMANDS.VERSION:
			commandVersion(commands.slice(index+1), argv);
			return EXIT_FOREACH;

		case COMMANDS.ENV:
			commandPrintEnv(commands.slice(index+1), argv);
			return EXIT_FOREACH;

		default:
			console.error('Unknown command: ', command);
			commandUsage(commands.slice(index+1), argv);
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
