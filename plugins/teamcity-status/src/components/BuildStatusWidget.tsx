import React from 'react';
import { useAsync } from 'react-use';
import {
  InfoCard,
  StatusOK,
  StatusError,
  StatusPending,
  StatusRunning,
  Progress,
} from '@backstage/core-components';
import {
  Typography,
  Chip,
  Box,
  Grid,
  LinearProgress,
  Link,
  Tooltip,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useApi } from '@backstage/core-plugin-api';
import { teamCityApiRef } from '../api/TeamCityApi';

const useStyles = makeStyles((theme) => ({
  badgeContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(1),
    marginTop: theme.spacing(2),
  },
  successChip: {
    backgroundColor: '#4caf50',
    color: 'white',
    fontWeight: 'bold',
  },
  failureChip: {
    backgroundColor: '#f44336',
    color: 'white',
    fontWeight: 'bold',
  },
  runningChip: {
    backgroundColor: '#2196f3',
    color: 'white',
    fontWeight: 'bold',
  },
  pendingChip: {
    backgroundColor: '#ff9800',
    color: 'white',
    fontWeight: 'bold',
  },
  skippedChip: {
    backgroundColor: '#9e9e9e',
    color: 'white',
  },
  stageList: {
    marginTop: theme.spacing(2),
  },
  stageItem: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(1),
    borderBottom: `1px solid ${theme.palette.divider}`,
    '&:last-child': {
      borderBottom: 'none',
    },
  },
  stageName: {
    flex: 1,
    marginLeft: theme.spacing(1),
  },
  stageDuration: {
    color: theme.palette.text.secondary,
    marginRight: theme.spacing(2),
  },
  errorBox: {
    backgroundColor: '#ffebee',
    padding: theme.spacing(2),
    borderRadius: theme.spacing(1),
    marginTop: theme.spacing(2),
    border: '1px solid #f44336',
  },
  artifactList: {
    marginTop: theme.spacing(2),
  },
  artifactItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: theme.spacing(0.5, 0),
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: theme.spacing(0.5, 0),
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
}));

interface BuildStatusWidgetProps {
  projectId: string;
  showDetails?: boolean;
  artistMode?: boolean;
}

export const BuildStatusWidget: React.FC<BuildStatusWidgetProps> = ({
  projectId,
  showDetails = true,
  artistMode = false,
}) => {
  const classes = useStyles();
  const teamCityApi = useApi(teamCityApiRef);

  const { value: build, loading, error } = useAsync(
    () => teamCityApi.getBuildStatus(projectId),
    [projectId]
  );

  if (loading) {
    return <Progress />;
  }

  if (error) {
    return (
      <InfoCard title="Build Status">
        <Typography color="error">Failed to load build status: {error.message}</Typography>
      </InfoCard>
    );
  }

  if (!build) {
    return (
      <InfoCard title="Build Status">
        <Typography>No builds found for this project</Typography>
      </InfoCard>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Success':
        return <StatusOK />;
      case 'Failure':
        return <StatusError />;
      case 'Starting':
        return <StatusRunning />;
      case 'Skipped':
        return <StatusPending />;
      default:
        return <StatusPending />;
    }
  };

  const getChipClass = (status: string) => {
    switch (status) {
      case 'Success':
        return classes.successChip;
      case 'Failure':
        return classes.failureChip;
      case 'Starting':
        return classes.runningChip;
      case 'Skipped':
        return classes.skippedChip;
      default:
        return classes.pendingChip;
    }
  };

  const getMainStatus = () => {
    switch (build.status) {
      case 'success':
        return { icon: <StatusOK />, text: 'Build Successful', color: '#4caf50' };
      case 'failed':
        return { icon: <StatusError />, text: 'Build Failed', color: '#f44336' };
      case 'running':
        return { icon: <StatusRunning />, text: 'Build Running', color: '#2196f3' };
      default:
        return { icon: <StatusPending />, text: 'Build Pending', color: '#ff9800' };
    }
  };

  const mainStatus = getMainStatus();

  // Artist mode: simplified view
  if (artistMode) {
    const readyBadge = build.badges.find((b) => b.name === 'Ready');
    const isReady = readyBadge?.status === 'Success';

    return (
      <InfoCard
        title={
          <Box display="flex" alignItems="center" gap={1}>
            {isReady ? <StatusOK /> : <StatusError />}
            <span>{isReady ? 'Ready to Sync' : 'Not Ready'}</span>
          </Box>
        }
      >
        <Typography variant="body1">
          <strong>CL {build.changelist}</strong>
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {build.finishTime
            ? `Completed ${new Date(build.finishTime).toLocaleString()}`
            : 'In progress...'}
        </Typography>
        {!isReady && build.errorMessage && (
          <Box className={classes.errorBox}>
            <Typography variant="body2" color="error">
              {build.errorMessage}
            </Typography>
          </Box>
        )}
      </InfoCard>
    );
  }

  // Engineer mode: full details
  return (
    <InfoCard
      title={
        <Box display="flex" alignItems="center" gap={1}>
          {mainStatus.icon}
          <span>{build.projectName}</span>
        </Box>
      }
      subheader={`Build #${build.buildNumber} • CL ${build.changelist}`}
    >
      {/* Build Info */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <div className={classes.infoRow}>
            <Typography variant="body2" color="textSecondary">Status</Typography>
            <Typography variant="body2" style={{ color: mainStatus.color, fontWeight: 'bold' }}>
              {mainStatus.text}
            </Typography>
          </div>
          <div className={classes.infoRow}>
            <Typography variant="body2" color="textSecondary">Stream</Typography>
            <Typography variant="body2">{build.perforceStream}</Typography>
          </div>
          <div className={classes.infoRow}>
            <Typography variant="body2" color="textSecondary">Agent</Typography>
            <Typography variant="body2">{build.agent}</Typography>
          </div>
          <div className={classes.infoRow}>
            <Typography variant="body2" color="textSecondary">Trigger</Typography>
            <Typography variant="body2">
              {build.triggerInfo.type === 'manual'
                ? `Manual (${build.triggerInfo.user})`
                : build.triggerInfo.type === 'schedule'
                ? 'Scheduled'
                : 'VCS Change'}
            </Typography>
          </div>
        </Grid>
        <Grid item xs={12} md={6}>
          <div className={classes.infoRow}>
            <Typography variant="body2" color="textSecondary">Platforms</Typography>
            <Typography variant="body2">{build.platforms.join(', ')}</Typography>
          </div>
          <div className={classes.infoRow}>
            <Typography variant="body2" color="textSecondary">Started</Typography>
            <Typography variant="body2">{new Date(build.startTime).toLocaleString()}</Typography>
          </div>
          {build.finishTime && (
            <div className={classes.infoRow}>
              <Typography variant="body2" color="textSecondary">Finished</Typography>
              <Typography variant="body2">{new Date(build.finishTime).toLocaleString()}</Typography>
            </div>
          )}
        </Grid>
      </Grid>

      {/* Progress bar for running builds */}
      {build.status === 'running' && (
        <Box mt={2}>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            Build Progress
          </Typography>
          <LinearProgress variant="indeterminate" />
        </Box>
      )}

      {/* Error message */}
      {build.errorMessage && (
        <Box className={classes.errorBox}>
          <Typography variant="subtitle2" color="error" gutterBottom>
            Error Details
          </Typography>
          <Typography variant="body2">{build.errorMessage}</Typography>
        </Box>
      )}

      {/* Badges */}
      {showDetails && (
        <>
          <Typography variant="subtitle2" style={{ marginTop: 16 }}>
            Build Stages
          </Typography>
          <div className={classes.badgeContainer}>
            {build.badges.map((badge) => (
              <Tooltip
                key={badge.name}
                title={badge.duration ? `Duration: ${badge.duration}` : 'Pending'}
              >
                <Chip
                  label={badge.name}
                  size="small"
                  className={getChipClass(badge.status)}
                  icon={getStatusIcon(badge.status)}
                />
              </Tooltip>
            ))}
          </div>

          {/* Stage details */}
          <div className={classes.stageList}>
            {build.badges.map((badge) => (
              <div key={badge.name} className={classes.stageItem}>
                {getStatusIcon(badge.status)}
                <span className={classes.stageName}>{badge.name}</span>
                {badge.duration && <span className={classes.stageDuration}>{badge.duration}</span>}
                {badge.timestamp && (
                  <span className={classes.stageDuration}>
                    {new Date(badge.timestamp).toLocaleTimeString()}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Test Results */}
          {build.testResults && (
            <Box mt={2} p={2} bgcolor="#f5f5f5" borderRadius={1}>
              <Typography variant="subtitle2" gutterBottom>
                Test Results
              </Typography>
              <Typography variant="body2">
                <span style={{ color: '#4caf50' }}>✓ {build.testResults.passed} passed</span>
                {build.testResults.failed > 0 && (
                  <span style={{ color: '#f44336', marginLeft: 16 }}>
                    ✗ {build.testResults.failed} failed
                  </span>
                )}
                {build.testResults.skipped > 0 && (
                  <span style={{ color: '#ff9800', marginLeft: 16 }}>
                    ⏭ {build.testResults.skipped} skipped
                  </span>
                )}
                <span style={{ marginLeft: 16, color: '#666' }}>
                  ({build.testResults.duration})
                </span>
              </Typography>
            </Box>
          )}

          {/* Artifacts */}
          {build.artifacts.length > 0 && (
            <div className={classes.artifactList}>
              <Typography variant="subtitle2" gutterBottom>
                Artifacts
              </Typography>
              {build.artifacts.map((artifact) => (
                <div key={artifact.name} className={classes.artifactItem}>
                  <Link href={artifact.downloadUrl} target="_blank">
                    📦 {artifact.name}
                  </Link>
                  <Typography variant="body2" color="textSecondary">
                    {artifact.size}
                  </Typography>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </InfoCard>
  );
};
