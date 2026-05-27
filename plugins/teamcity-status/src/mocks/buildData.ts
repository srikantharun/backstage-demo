/**
 * Mock TeamCity build data for demo purposes.
 * In production, this would be replaced with real API calls.
 */

export interface Badge {
  name: string;
  status: 'Starting' | 'Success' | 'Failure' | 'Warning' | 'Skipped';
  timestamp: string;
  duration?: string;
  url?: string;
}

export interface TestResults {
  passed: number;
  failed: number;
  skipped: number;
  duration: string;
}

export interface Artifact {
  name: string;
  size: string;
  downloadUrl: string;
}

export interface BuildStatus {
  projectId: string;
  projectName: string;
  buildTypeId: string;
  buildTypeName: string;
  buildNumber: number;
  changelist: number;
  status: 'success' | 'failed' | 'running' | 'pending';
  statusText: string;
  startTime: string;
  finishTime?: string;
  queuedTime: string;
  agent: string;
  badges: Badge[];
  artifacts: Artifact[];
  testResults?: TestResults;
  triggerInfo: {
    type: 'vcs' | 'manual' | 'schedule';
    user?: string;
    branch?: string;
  };
  perforceStream: string;
  platforms: string[];
  errorMessage?: string;
}

// Mock build data for different projects
export const mockBuilds: Record<string, BuildStatus> = {
  'candy-crush-mobile': {
    projectId: 'CandyCrush_Mobile',
    projectName: 'Candy Crush Mobile',
    buildTypeId: 'CandyCrush_Mobile_FullBuild',
    buildTypeName: 'Full Build (All Platforms)',
    buildNumber: 1542,
    changelist: 45821,
    status: 'success',
    statusText: 'Ready for Sync',
    startTime: '2024-01-15T14:20:00Z',
    finishTime: '2024-01-15T15:10:00Z',
    queuedTime: '2024-01-15T14:18:00Z',
    agent: 'build-agent-win-01',
    perforceStream: '//Game/CandyCrush/Main',
    platforms: ['Win64', 'Android', 'iOS'],
    badges: [
      { name: 'Compile', status: 'Success', timestamp: '2024-01-15T14:30:00Z', duration: '8m 32s' },
      { name: 'Cook.Win64', status: 'Success', timestamp: '2024-01-15T14:42:00Z', duration: '12m 45s' },
      { name: 'Cook.Android', status: 'Success', timestamp: '2024-01-15T14:42:00Z', duration: '15m 20s' },
      { name: 'Cook.iOS', status: 'Success', timestamp: '2024-01-15T14:42:00Z', duration: '14m 10s' },
      { name: 'Tests.Functional', status: 'Success', timestamp: '2024-01-15T14:55:00Z', duration: '6m 15s' },
      { name: 'Tests.NFT', status: 'Success', timestamp: '2024-01-15T14:55:00Z', duration: '4m 30s' },
      { name: 'QualityGate', status: 'Success', timestamp: '2024-01-15T15:00:00Z', duration: '0m 5s' },
      { name: 'Package.All', status: 'Success', timestamp: '2024-01-15T15:08:00Z', duration: '8m 20s' },
      { name: 'Ready', status: 'Success', timestamp: '2024-01-15T15:10:00Z' },
    ],
    artifacts: [
      { name: 'CandyCrush-Win64-Shipping.exe', size: '245 MB', downloadUrl: '/artifacts/1542/win64' },
      { name: 'CandyCrush-Android-Shipping.aab', size: '180 MB', downloadUrl: '/artifacts/1542/android' },
      { name: 'CandyCrush-iOS-Shipping.ipa', size: '195 MB', downloadUrl: '/artifacts/1542/ios' },
      { name: 'BuildReport.html', size: '2.4 MB', downloadUrl: '/artifacts/1542/report' },
    ],
    testResults: {
      passed: 142,
      failed: 0,
      skipped: 3,
      duration: '10m 45s',
    },
    triggerInfo: {
      type: 'vcs',
      branch: '//Game/CandyCrush/Main',
    },
  },

  'worms-legacy': {
    projectId: 'Worms_Legacy',
    projectName: 'Worms Legacy (Console Port)',
    buildTypeId: 'Worms_Legacy_ConsoleBuild',
    buildTypeName: 'Console Build (PS5/Xbox/Switch)',
    buildNumber: 892,
    changelist: 12045,
    status: 'failed',
    statusText: 'Build Failed - Xbox Cook',
    startTime: '2024-01-15T16:00:00Z',
    finishTime: '2024-01-15T16:42:00Z',
    queuedTime: '2024-01-15T15:58:00Z',
    agent: 'build-agent-console-01',
    perforceStream: '//Game/Worms/Release/1.0-Console',
    platforms: ['PS5', 'Xbox', 'Switch'],
    errorMessage: 'Xbox cook failed: Missing texture format for XboxOne_ASTC. Check texture import settings.',
    badges: [
      { name: 'Compile', status: 'Success', timestamp: '2024-01-15T16:10:00Z', duration: '10m 12s' },
      { name: 'Cook.PS5', status: 'Success', timestamp: '2024-01-15T16:28:00Z', duration: '18m 30s' },
      { name: 'Cook.Xbox', status: 'Failure', timestamp: '2024-01-15T16:28:00Z', duration: '15m 45s' },
      { name: 'Cook.Switch', status: 'Skipped', timestamp: '2024-01-15T16:42:00Z' },
      { name: 'Tests.Functional', status: 'Skipped', timestamp: '2024-01-15T16:42:00Z' },
      { name: 'Ready', status: 'Failure', timestamp: '2024-01-15T16:42:00Z' },
    ],
    artifacts: [],
    triggerInfo: {
      type: 'manual',
      user: 'john.smith',
    },
  },

  'new-game-prototype': {
    projectId: 'NewGame_Prototype',
    projectName: 'New Game Prototype',
    buildTypeId: 'NewGame_Prototype_DevBuild',
    buildTypeName: 'Development Build',
    buildNumber: 156,
    changelist: 8821,
    status: 'running',
    statusText: 'Building... (Cook.Android)',
    startTime: '2024-01-15T17:00:00Z',
    queuedTime: '2024-01-15T16:58:00Z',
    agent: 'build-agent-win-02',
    perforceStream: '//Game/NewGame/Dev/Prototype',
    platforms: ['Win64', 'Android'],
    badges: [
      { name: 'Compile', status: 'Success', timestamp: '2024-01-15T17:05:00Z', duration: '5m 20s' },
      { name: 'Cook.Win64', status: 'Success', timestamp: '2024-01-15T17:13:00Z', duration: '8m 15s' },
      { name: 'Cook.Android', status: 'Starting', timestamp: '2024-01-15T17:16:00Z' },
      { name: 'Tests.Functional', status: 'Starting', timestamp: '' },
      { name: 'Ready', status: 'Starting', timestamp: '' },
    ],
    artifacts: [],
    triggerInfo: {
      type: 'vcs',
      branch: '//Game/NewGame/Dev/Prototype',
    },
  },

  'overcooked-dlc': {
    projectId: 'Overcooked_DLC',
    projectName: 'Overcooked DLC Pack',
    buildTypeId: 'Overcooked_DLC_AllPlatforms',
    buildTypeName: 'DLC Build (All Platforms)',
    buildNumber: 78,
    changelist: 34521,
    status: 'success',
    statusText: 'Ready for Sync',
    startTime: '2024-01-15T10:00:00Z',
    finishTime: '2024-01-15T11:15:00Z',
    queuedTime: '2024-01-15T09:58:00Z',
    agent: 'build-agent-win-03',
    perforceStream: '//Game/Overcooked/DLC/SummerPack',
    platforms: ['Win64', 'PS5', 'Xbox', 'Switch'],
    badges: [
      { name: 'Compile', status: 'Success', timestamp: '2024-01-15T10:08:00Z', duration: '8m 00s' },
      { name: 'Cook.Win64', status: 'Success', timestamp: '2024-01-15T10:20:00Z', duration: '12m 00s' },
      { name: 'Cook.PS5', status: 'Success', timestamp: '2024-01-15T10:35:00Z', duration: '15m 00s' },
      { name: 'Cook.Xbox', status: 'Success', timestamp: '2024-01-15T10:50:00Z', duration: '14m 00s' },
      { name: 'Cook.Switch', status: 'Success', timestamp: '2024-01-15T11:00:00Z', duration: '10m 00s' },
      { name: 'Tests.Functional', status: 'Success', timestamp: '2024-01-15T11:08:00Z', duration: '8m 00s' },
      { name: 'QualityGate', status: 'Success', timestamp: '2024-01-15T11:10:00Z', duration: '2m 00s' },
      { name: 'Ready', status: 'Success', timestamp: '2024-01-15T11:15:00Z' },
    ],
    artifacts: [
      { name: 'Overcooked-DLC-Win64.pak', size: '450 MB', downloadUrl: '/artifacts/78/win64' },
      { name: 'Overcooked-DLC-PS5.pkg', size: '420 MB', downloadUrl: '/artifacts/78/ps5' },
      { name: 'Overcooked-DLC-Xbox.xvc', size: '415 MB', downloadUrl: '/artifacts/78/xbox' },
      { name: 'Overcooked-DLC-Switch.nsp', size: '380 MB', downloadUrl: '/artifacts/78/switch' },
    ],
    testResults: {
      passed: 89,
      failed: 0,
      skipped: 2,
      duration: '8m 00s',
    },
    triggerInfo: {
      type: 'schedule',
    },
  },
};

// Get build status for a project (mock implementation)
export const getMockBuildStatus = (projectId: string): BuildStatus | undefined => {
  return mockBuilds[projectId];
};

// Get all builds (mock implementation)
export const getAllMockBuilds = (): BuildStatus[] => {
  return Object.values(mockBuilds);
};

// Get builds by status (mock implementation)
export const getMockBuildsByStatus = (status: BuildStatus['status']): BuildStatus[] => {
  return Object.values(mockBuilds).filter((build) => build.status === status);
};

// Simulate build progress (for running builds)
export const simulateBuildProgress = (buildId: string): number => {
  const build = mockBuilds[buildId];
  if (!build || build.status !== 'running') {
    return 100;
  }

  const completedBadges = build.badges.filter(
    (b) => b.status === 'Success' || b.status === 'Failure'
  ).length;
  const totalBadges = build.badges.length;

  return Math.round((completedBadges / totalBadges) * 100);
};
