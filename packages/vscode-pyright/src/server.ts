import { main } from 'pyright-internal/nodeMain';

Error.stackTraceLimit = 256;

// VS Code version of the server now uses auto-detection for workers.
// This can be overridden by basedpyright.analysis.maxWorkers in settings.
// Using 0 to represent auto-detection
main(/* maxWorkers */ 0);
