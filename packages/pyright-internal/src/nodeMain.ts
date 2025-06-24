/*
 * nodeMain.ts
 * Copyright (c) Microsoft Corporation.
 * Licensed under the MIT license.
 *
 * Provides the main entrypoint to the server when running in Node.
 */

import * as os from 'os';
import { BackgroundAnalysisRunner } from './backgroundAnalysis';
import { ServiceProvider } from './common/serviceProvider';
import { run } from './nodeServer';
import { PyrightServer } from './server';

function getDefaultMaxWorkers(fallbackMaxWorkers: number): number {
    // Check environment variable first (useful for containers/CI)
    const envMaxWorkers = process.env.PYRIGHT_MAX_WORKERS;
    if (envMaxWorkers) {
        if (envMaxWorkers.toLowerCase() === 'auto') {
            const cpuCount = os.cpus().length;
            return cpuCount < 4 ? 1 : cpuCount;
        }
        const parsed = parseInt(envMaxWorkers, 10);
        if (!isNaN(parsed) && parsed >= 1) {
            return parsed;
        }
    }
    
    // Handle auto-detection when 0 is passed
    if (fallbackMaxWorkers === 0) {
        const cpuCount = os.cpus().length;
        return cpuCount < 4 ? 1 : cpuCount;
    }
    
    // Fall back to provided maxWorkers (for backwards compatibility)
    return fallbackMaxWorkers;
}

export async function main(maxWorkers: number) {
    const effectiveMaxWorkers = getDefaultMaxWorkers(maxWorkers);
    
    await run(
        (conn) => new PyrightServer(conn, effectiveMaxWorkers),
        () => {
            const runner = new BackgroundAnalysisRunner(new ServiceProvider());
            runner.start();
        }
    );
}
