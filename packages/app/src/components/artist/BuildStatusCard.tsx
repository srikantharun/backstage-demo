import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  LinearProgress,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import ScheduleIcon from '@material-ui/icons/Schedule';

const useStyles = makeStyles((theme) => ({
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  statusHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    marginBottom: theme.spacing(2),
  },
  successIcon: {
    color: '#4caf50',
  },
  errorIcon: {
    color: '#f44336',
  },
  pendingIcon: {
    color: '#ff9800',
  },
  platformChips: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(0.5),
    marginTop: theme.spacing(1),
  },
  chip: {
    fontWeight: 'bold',
    fontSize: '0.75rem',
  },
  successChip: {
    backgroundColor: '#4caf50',
    color: 'white',
  },
  errorChip: {
    backgroundColor: '#f44336',
    color: 'white',
  },
  pendingChip: {
    backgroundColor: '#ff9800',
    color: 'white',
  },
  runningChip: {
    backgroundColor: '#2196f3',
    color: 'white',
  },
  changelistInfo: {
    marginTop: 'auto',
    paddingTop: theme.spacing(2),
    color: theme.palette.text.secondary,
    borderTop: `1px solid ${theme.palette.divider}`,
  },
}));

interface Platform {
  name: string;
  status: 'success' | 'failed' | 'running' | 'pending';
}

interface BuildStatusCardProps {
  projectName: string;
  changelist: number;
  lastBuildTime: string;
  overallStatus: 'success' | 'failed' | 'running' | 'pending';
  platforms: Platform[];
  progress?: number;
  onClick?: () => void;
  selected?: boolean;
}

export const BuildStatusCard: React.FC<BuildStatusCardProps> = ({
  projectName,
  changelist,
  lastBuildTime,
  overallStatus,
  platforms,
  progress,
  onClick,
  selected,
}) => {
  const classes = useStyles();

  const getStatusIcon = (status: string, size: 'small' | 'large' = 'large') => {
    const iconSize = size === 'large' ? 32 : 16;
    switch (status) {
      case 'success':
        return <CheckCircleIcon className={classes.successIcon} style={{ fontSize: iconSize }} />;
      case 'failed':
        return <ErrorIcon className={classes.errorIcon} style={{ fontSize: iconSize }} />;
      case 'running':
        return <ScheduleIcon className={classes.pendingIcon} style={{ fontSize: iconSize }} />;
      default:
        return <ScheduleIcon className={classes.pendingIcon} style={{ fontSize: iconSize }} />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'success':
        return 'Ready to Sync';
      case 'failed':
        return 'Build Failed';
      case 'running':
        return 'Building...';
      default:
        return 'Waiting';
    }
  };

  const getChipClass = (status: string) => {
    switch (status) {
      case 'success':
        return `${classes.chip} ${classes.successChip}`;
      case 'failed':
        return `${classes.chip} ${classes.errorChip}`;
      case 'running':
        return `${classes.chip} ${classes.runningChip}`;
      default:
        return `${classes.chip} ${classes.pendingChip}`;
    }
  };

  const getPlatformEmoji = (status: string) => {
    switch (status) {
      case 'success':
        return '✓';
      case 'failed':
        return '✗';
      case 'running':
        return '⟳';
      default:
        return '⏳';
    }
  };

  return (
    <Card
      className={classes.card}
      style={{
        cursor: onClick ? 'pointer' : 'default',
        border: selected ? '2px solid #1976d2' : '1px solid #e0e0e0',
        boxShadow: selected ? '0 4px 12px rgba(25, 118, 210, 0.25)' : undefined,
      }}
      onClick={onClick}
    >
      <CardContent style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Status Header */}
        <div className={classes.statusHeader}>
          {getStatusIcon(overallStatus)}
          <div>
            <Typography variant="h6" component="h3">
              {projectName}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {getStatusText(overallStatus)}
            </Typography>
          </div>
        </div>

        {/* Progress bar for running builds */}
        {overallStatus === 'running' && progress !== undefined && (
          <Box mb={2}>
            <LinearProgress variant="determinate" value={progress} />
            <Typography variant="caption" color="textSecondary">
              {progress}% complete
            </Typography>
          </Box>
        )}

        {/* Platform Chips */}
        <div className={classes.platformChips}>
          {platforms.map((platform) => (
            <Chip
              key={platform.name}
              label={`${platform.name} ${getPlatformEmoji(platform.status)}`}
              size="small"
              className={getChipClass(platform.status)}
            />
          ))}
        </div>

        {/* Changelist Info */}
        <div className={classes.changelistInfo}>
          <Typography variant="body2">
            <strong>CL {changelist}</strong> • {lastBuildTime}
          </Typography>
        </div>
      </CardContent>
    </Card>
  );
};
