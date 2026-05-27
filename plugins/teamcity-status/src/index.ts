/**
 * TeamCity Status Plugin for Backstage
 *
 * Provides build status integration with TeamCity for game projects.
 * Features:
 * - Artist-friendly simplified status view
 * - Engineer-detailed build stage tracking
 * - Mock data mode for demo/development
 * - Real TeamCity API integration (configurable)
 */

export { teamCityApiRef, TeamCityClient } from './api/TeamCityApi';
export type { TeamCityApi, TriggerBuildOptions, BuildTriggerResult } from './api/TeamCityApi';

export { BuildStatusWidget } from './components/BuildStatusWidget';

export {
  mockBuilds,
  getMockBuildStatus,
  getAllMockBuilds,
  getMockBuildsByStatus,
} from './mocks/buildData';
export type { BuildStatus, Badge, TestResults, Artifact } from './mocks/buildData';

// Plugin definition
import {
  createPlugin,
  createApiFactory,
  configApiRef,
} from '@backstage/core-plugin-api';
import { teamCityApiRef, TeamCityClient } from './api/TeamCityApi';

export const teamCityStatusPlugin = createPlugin({
  id: 'teamcity-status',
  apis: [
    createApiFactory({
      api: teamCityApiRef,
      deps: { configApi: configApiRef },
      factory: ({ configApi }) => new TeamCityClient({ configApi }),
    }),
  ],
});
