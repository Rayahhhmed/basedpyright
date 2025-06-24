/*
 * server.ts
 *
 * Implements pyright language server.
 */

import { Connection } from 'vscode-languageserver';

import { BackgroundAnalysis } from './backgroundAnalysis';
import { IBackgroundAnalysis } from './backgroundAnalysisBase';
import { getCancellationFolderName } from './common/cancellationUtils';
import { ConsoleWithLogLevel } from './common/console';
import { FileBasedCancellationProvider } from './common/fileBasedCancellationUtils';
import { FileSystem } from './common/fileSystem';
import { FullAccessHost } from './common/fullAccessHost';
import { Host } from './common/host';
import { RealTempFile, WorkspaceFileWatcherProvider, createFromRealFileSystem } from './common/realFileSystem';
import { RealLanguageServer } from './realLanguageServer';
import { Uri } from './common/uri/uri';
import { ServerSettings } from './common/languageServerInterface';
import { Workspace } from './workspaceFactory';

export class PyrightServer extends RealLanguageServer {
    private _dynamicMaxWorkers: number;

    constructor(connection: Connection, maxWorkers: number, realFileSystem?: FileSystem) {
        const tempFile = new RealTempFile();
        const console = new ConsoleWithLogLevel(connection.console);
        const fileWatcherProvider = new WorkspaceFileWatcherProvider();
        const fileSystem = realFileSystem ?? createFromRealFileSystem(tempFile, console, fileWatcherProvider);
        
        super(
            connection,
            maxWorkers,
            fileSystem,
            new FileBasedCancellationProvider('bg'),
            tempFile,
            fileWatcherProvider
        );
        
        // Store the initial maxWorkers for later dynamic adjustment
        this._dynamicMaxWorkers = maxWorkers;
    }

    override async getSettings(workspace: Workspace): Promise<ServerSettings> {
        const settings = await super.getSettings(workspace);
        
        // Update dynamic maxWorkers based on configuration
        if (settings.maxWorkers !== undefined && settings.maxWorkers !== this._dynamicMaxWorkers) {
            this._dynamicMaxWorkers = settings.maxWorkers;
            this.console.info(`Updated maxWorkers to ${this._dynamicMaxWorkers} for workspace ${workspace.workspaceName}`);
        }
        
        return settings;
    }

    override createBackgroundAnalysis(serviceId: string, workspaceRoot: Uri): IBackgroundAnalysis | undefined {
        if (!getCancellationFolderName()) {
            // Don't do background analysis if an old client
            // is used where cancellation is not supported.
            return undefined;
        }

        // For now, we still create a single BackgroundAnalysis
        // TODO: In the future, this could be extended to create multiple workers
        // based on this._dynamicMaxWorkers value
        return new BackgroundAnalysis(workspaceRoot, this.serverOptions.serviceProvider);
    }

    protected override createHost(): Host {
        return new FullAccessHost(this.serverOptions.serviceProvider);
    }

    getDynamicMaxWorkers(): number {
        return this._dynamicMaxWorkers;
    }
}
