import { createApiRef, ConfigApi } from '@backstage/core-plugin-api';
import {
  BuildStatus,
  getMockBuildStatus,
  getAllMockBuilds,
  getMockBuildsByStatus,
  simulateBuildProgress,
} from '../mocks/buildData';

/**
 * TeamCity API interface
 * In production, this would make real HTTP calls to TeamCity REST API.
 * For demo purposes, it returns mock data.
 */
export interface TeamCityApi {
  getBuildStatus(projectId: string): Promise<BuildStatus | undefined>;
  getAllBuilds(): Promise<BuildStatus[]>;
  getBuildsByStatus(status: BuildStatus['status']): Promise<BuildStatus[]>;
  getBuildProgress(buildId: string): Promise<number>;
  triggerBuild(projectId: string, options?: TriggerBuildOptions): Promise<BuildTriggerResult>;
}

export interface TriggerBuildOptions {
  branch?: string;
  parameters?: Record<string, string>;
  comment?: string;
}

export interface BuildTriggerResult {
  success: boolean;
  buildId?: number;
  message: string;
  queuePosition?: number;
}

export const teamCityApiRef = createApiRef<TeamCityApi>({
  id: 'plugin.teamcity-status.api',
});

/**
 * TeamCity API implementation
 * Uses mock data for demo, can be configured to use real TeamCity API
 */
export class TeamCityClient implements TeamCityApi {
  private readonly baseUrl: string;
  private readonly useMockData: boolean;

  constructor(options: { configApi: ConfigApi }) {
    // In production, get config from app-config.yaml
    // For demo, default to mock data
    this.baseUrl = options.configApi.getOptionalString('teamcity.baseUrl') || 'https://teamcity.mock.internal';
    this.useMockData = options.configApi.getOptionalBoolean('teamcity.useMockData') ?? true;
  }

  async getBuildStatus(projectId: string): Promise<BuildStatus | undefined> {
    if (this.useMockData) {
      // Simulate network delay
      await this.simulateDelay();
      return getMockBuildStatus(projectId);
    }

    // Real API call (for production)
    const response = await fetch(
      `${this.baseUrl}/app/rest/builds?locator=project:(id:${projectId}),count:1`,
      {
        headers: {
          Accept: 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch build status: ${response.statusText}`);
    }

    const data = await response.json();
    return this.transformTeamCityResponse(data);
  }

  async getAllBuilds(): Promise<BuildStatus[]> {
    if (this.useMockData) {
      await this.simulateDelay();
      return getAllMockBuilds();
    }

    // Real API call would go here
    const response = await fetch(`${this.baseUrl}/app/rest/builds?locator=count:20`, {
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch builds: ${response.statusText}`);
    }

    const data = await response.json();
    return data.build?.map(this.transformTeamCityResponse) || [];
  }

  async getBuildsByStatus(status: BuildStatus['status']): Promise<BuildStatus[]> {
    if (this.useMockData) {
      await this.simulateDelay();
      return getMockBuildsByStatus(status);
    }

    const teamCityStatus = this.mapStatusToTeamCity(status);
    const response = await fetch(
      `${this.baseUrl}/app/rest/builds?locator=status:${teamCityStatus},count:10`,
      {
        headers: {
          Accept: 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch builds: ${response.statusText}`);
    }

    const data = await response.json();
    return data.build?.map(this.transformTeamCityResponse) || [];
  }

  async getBuildProgress(buildId: string): Promise<number> {
    if (this.useMockData) {
      await this.simulateDelay(100);
      return simulateBuildProgress(buildId);
    }

    const response = await fetch(
      `${this.baseUrl}/app/rest/builds/id:${buildId}`,
      {
        headers: {
          Accept: 'application/json',
        },
      }
    );

    if (!response.ok) {
      return 0;
    }

    const data = await response.json();
    return data.percentageComplete || 0;
  }

  async triggerBuild(
    projectId: string,
    options?: TriggerBuildOptions
  ): Promise<BuildTriggerResult> {
    if (this.useMockData) {
      await this.simulateDelay(500);
      return {
        success: true,
        buildId: Math.floor(Math.random() * 10000),
        message: `Build triggered for ${projectId}`,
        queuePosition: Math.floor(Math.random() * 5) + 1,
      };
    }

    const body = {
      buildType: { id: projectId },
      branchName: options?.branch,
      properties: options?.parameters
        ? {
            property: Object.entries(options.parameters).map(([name, value]) => ({
              name,
              value,
            })),
          }
        : undefined,
      comment: options?.comment ? { text: options.comment } : undefined,
    };

    const response = await fetch(`${this.baseUrl}/app/rest/buildQueue`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      return {
        success: false,
        message: `Failed to trigger build: ${response.statusText}`,
      };
    }

    const data = await response.json();
    return {
      success: true,
      buildId: data.id,
      message: 'Build triggered successfully',
      queuePosition: data.queuedDate ? 1 : undefined,
    };
  }

  private async simulateDelay(ms: number = 300): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private mapStatusToTeamCity(status: BuildStatus['status']): string {
    switch (status) {
      case 'success':
        return 'SUCCESS';
      case 'failed':
        return 'FAILURE';
      case 'running':
        return 'RUNNING';
      default:
        return 'UNKNOWN';
    }
  }

  private transformTeamCityResponse(data: any): BuildStatus {
    // Transform real TeamCity API response to our BuildStatus format
    // This is a simplified transformation - real implementation would be more comprehensive
    return {
      projectId: data.buildType?.projectId || '',
      projectName: data.buildType?.projectName || '',
      buildTypeId: data.buildType?.id || '',
      buildTypeName: data.buildType?.name || '',
      buildNumber: data.number || 0,
      changelist: parseInt(data.revisions?.revision?.[0]?.version || '0', 10),
      status: data.status?.toLowerCase() || 'pending',
      statusText: data.statusText || '',
      startTime: data.startDate || '',
      finishTime: data.finishDate,
      queuedTime: data.queuedDate || '',
      agent: data.agent?.name || '',
      badges: [],
      artifacts: [],
      triggerInfo: {
        type: data.triggered?.type || 'manual',
        user: data.triggered?.user?.username,
      },
      perforceStream: '',
      platforms: [],
    };
  }
}
