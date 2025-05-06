export function getConfigPathFromCommandLineArguments(process) {
    const args = process.argv.slice(2);
    if (args.length === 0) {
        console.log('No configuation file provided');
        process.exit(1);
    }
    const configArgument = args[0].split('=');
    if (configArgument.length !== 2) {
        console.log('Invalid command line arguments. Use --config=<path-to-config-file>');
        process.exit(1);
    }
    if (configArgument[0] !== '--config') {
        console.log('Invalid command line arguments. Use --config=<path-to-config-file>');
        process.exit(1);
    }
    return configArgument[1];
}
