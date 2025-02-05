import config from "@config";

import cli from "./cli";

console.log(`Running ${config.environment}`);

cli.parse();
