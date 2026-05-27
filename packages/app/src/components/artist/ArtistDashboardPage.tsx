import React, { useState } from 'react';
import {
  Content,
  ContentHeader,
  Header,
  HeaderLabel,
  Page,
  SupportButton,
  InfoCard,
  StatusOK,
  StatusError,
  StatusPending,
  StatusRunning,
} from '@backstage/core-components';
import {
  Grid,
  Typography,
  Chip,
  Button,
  Card,
  CardContent,
  CardActions,
  Collapse,
  IconButton,
  Box,
  Avatar,
  LinearProgress,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import SyncIcon from '@material-ui/icons/Sync';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import ScheduleIcon from '@material-ui/icons/Schedule';
import BuildIcon from '@material-ui/icons/Build';
import { BuildStatusCard } from './BuildStatusCard';
import { SyncButton } from './SyncButton';

const useStyles = makeStyles((theme) => ({
  readyBadge: {
    padding: theme.spacing(4),
    textAlign: 'center',
    borderRadius: theme.spacing(2),
    marginBottom: theme.spacing(3),
  },
  readySuccess: {
    backgroundColor: '#e8f5e9',
    border: '3px solid #4caf50',
  },
  readyFailed: {
    backgroundColor: '#ffebee',
    border: '3px solid #f44336',
  },
  readyPending: {
    backgroundColor: '#fff3e0',
    border: '3px solid #ff9800',
  },
  bigIcon: {
    fontSize: 80,
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
  platformChip: {
    margin: theme.spacing(0.5),
    fontWeight: 'bold',
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
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing(2),
    marginTop: theme.spacing(2),
    color: theme.palette.text.secondary,
  },
  expandSection: {
    marginTop: theme.spacing(2),
  },
  stageRow: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(1),
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  stageName: {
    flex: 1,
    fontWeight: 500,
  },
  stageTime: {
    color: theme.palette.text.secondary,
    marginRight: theme.spacing(2),
  },
  projectSelector: {
    marginBottom: theme.spacing(3),
  },
  quickActions: {
    display: 'flex',
    gap: theme.spacing(2),
    justifyContent: 'center',
    marginTop: theme.spacing(3),
  },
}));

// Mock data - in production this would come from TeamCity API
const mockProjects = [
  {
    id: 'candy-crush-mobile',
    name: 'Candy Crush Mobile',
    changelist: 45821,
    lastBuildTime: '2 hours ago',
    overallStatus: 'success',
    platforms: [
      { name: 'Win64', status: 'success' },
      { name: 'Android', status: 'success' },
      { name: 'iOS', status: 'success' },
    ],
    stages: [
      { name: 'Compile Editor', status: 'success', duration: '8m 32s', timestamp: '14:30' },
      { name: 'Cook Win64', status: 'success', duration: '12m 45s', timestamp: '14:42' },
      { name: 'Cook Android', status: 'success', duration: '15m 20s', timestamp: '14:42' },
      { name: 'Cook iOS', status: 'success', duration: '14m 10s', timestamp: '14:42' },
      { name: 'Functional Tests', status: 'success', duration: '6m 15s', timestamp: '14:55' },
      { name: 'NFT (Performance)', status: 'success', duration: '4m 30s', timestamp: '14:55' },
      { name: 'Quality Gate', status: 'success', duration: '0m 5s', timestamp: '15:00' },
      { name: 'Package All', status: 'success', duration: '8m 20s', timestamp: '15:08' },
      { name: 'Ready', status: 'success', duration: '-', timestamp: '15:10' },
    ],
    artifacts: ['CandyCrush-Win64-Shipping.exe', 'CandyCrush-Android-Shipping.aab', 'CandyCrush-iOS-Shipping.ipa'],
    testResults: { passed: 142, failed: 0, skipped: 3 },
  },
  {
    id: 'worms-legacy',
    name: 'Worms Legacy (Console Port)',
    changelist: 12045,
    lastBuildTime: '45 minutes ago',
    overallStatus: 'failed',
    platforms: [
      { name: 'PS5', status: 'success' },
      { name: 'Xbox', status: 'failed' },
      { name: 'Switch', status: 'pending' },
    ],
    stages: [
      { name: 'Compile Editor', status: 'success', duration: '10m 12s', timestamp: '16:00' },
      { name: 'Cook PS5', status: 'success', duration: '18m 30s', timestamp: '16:12' },
      { name: 'Cook Xbox', status: 'failed', duration: '15m 45s', timestamp: '16:12' },
      { name: 'Cook Switch', status: 'pending', duration: '-', timestamp: '-' },
      { name: 'Functional Tests', status: 'skipped', duration: '-', timestamp: '-' },
      { name: 'Ready', status: 'failed', duration: '-', timestamp: '-' },
    ],
    artifacts: [],
    testResults: { passed: 0, failed: 0, skipped: 0 },
    errorMessage: 'Xbox cook failed: Missing texture format for XboxOne_ASTC',
  },
  {
    id: 'new-game-prototype',
    name: 'New Game Prototype',
    changelist: 8821,
    lastBuildTime: '5 minutes ago',
    overallStatus: 'running',
    platforms: [
      { name: 'Win64', status: 'success' },
      { name: 'Android', status: 'running' },
    ],
    stages: [
      { name: 'Compile Editor', status: 'success', duration: '5m 20s', timestamp: '17:00' },
      { name: 'Cook Win64', status: 'success', duration: '8m 15s', timestamp: '17:08' },
      { name: 'Cook Android', status: 'running', duration: '-', timestamp: '17:16' },
      { name: 'Functional Tests', status: 'pending', duration: '-', timestamp: '-' },
      { name: 'Ready', status: 'pending', duration: '-', timestamp: '-' },
    ],
    artifacts: [],
    testResults: { passed: 0, failed: 0, skipped: 0 },
    progress: 65,
  },
];

export const ArtistDashboardPage = () => {
  const classes = useStyles();
  const [selectedProject, setSelectedProject] = useState(mockProjects[0]);
  const [expanded, setExpanded] = useState(false);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircleIcon className={`${classes.bigIcon} ${classes.successIcon}`} />;
      case 'failed':
        return <ErrorIcon className={`${classes.bigIcon} ${classes.errorIcon}`} />;
      case 'running':
        return <ScheduleIcon className={`${classes.bigIcon} ${classes.pendingIcon}`} />;
      default:
        return <ScheduleIcon className={`${classes.bigIcon} ${classes.pendingIcon}`} />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'success':
        return 'Ready to Sync';
      case 'failed':
        return 'Build Failed';
      case 'running':
        return 'Build In Progress';
      default:
        return 'Waiting...';
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'success':
        return classes.readySuccess;
      case 'failed':
        return classes.readyFailed;
      default:
        return classes.readyPending;
    }
  };

  const getChipClass = (status: string) => {
    switch (status) {
      case 'success':
        return classes.successChip;
      case 'failed':
        return classes.errorChip;
      case 'running':
        return classes.runningChip;
      default:
        return classes.pendingChip;
    }
  };

  const getStageStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <StatusOK />;
      case 'failed':
        return <StatusError />;
      case 'running':
        return <StatusRunning />;
      case 'skipped':
        return <StatusPending />;
      default:
        return <StatusPending />;
    }
  };

  return (
    <Page themeId="tool">
      <Header
        title="Artist Dashboard"
        subtitle="Quick build status for artists - sync with confidence"
      >
        <HeaderLabel label="Role" value="Artist View" />
        <HeaderLabel label="Projects" value={mockProjects.length.toString()} />
      </Header>
      <Content>
        <ContentHeader title="Build Status">
          <SupportButton>
            Need help? Check the Artist Quickstart guide or ask in #build-support
          </SupportButton>
        </ContentHeader>

        {/* Project Selector */}
        <Grid container spacing={3} className={classes.projectSelector}>
          {mockProjects.map((project) => (
            <Grid item xs={12} md={4} key={project.id}>
              <Card
                style={{
                  cursor: 'pointer',
                  border: selectedProject.id === project.id ? '2px solid #1976d2' : 'none',
                }}
                onClick={() => setSelectedProject(project)}
              >
                <CardContent>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Avatar style={{ backgroundColor: project.overallStatus === 'success' ? '#4caf50' : project.overallStatus === 'failed' ? '#f44336' : '#ff9800' }}>
                      <BuildIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="h6">{project.name}</Typography>
                      <Typography variant="body2" color="textSecondary">
                        CL {project.changelist} • {project.lastBuildTime}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Main Status Badge */}
        <div className={`${classes.readyBadge} ${getStatusClass(selectedProject.overallStatus)}`}>
          {getStatusIcon(selectedProject.overallStatus)}
          <Typography variant="h3" gutterBottom>
            {getStatusText(selectedProject.overallStatus)}
          </Typography>

          {/* Platform Status Chips */}
          <Box>
            {selectedProject.platforms.map((platform) => (
              <Chip
                key={platform.name}
                label={`${platform.name} ${platform.status === 'success' ? '✓' : platform.status === 'failed' ? '✗' : '⏳'}`}
                className={`${classes.platformChip} ${getChipClass(platform.status)}`}
              />
            ))}
          </Box>

          {/* Changelist Info */}
          <div className={classes.changelistInfo}>
            <Typography variant="body1">
              <strong>CL {selectedProject.changelist}</strong> • {selectedProject.lastBuildTime}
            </Typography>
          </div>

          {/* Progress bar for running builds */}
          {selectedProject.overallStatus === 'running' && selectedProject.progress && (
            <Box mt={2} width="50%" mx="auto">
              <LinearProgress variant="determinate" value={selectedProject.progress} />
              <Typography variant="caption">{selectedProject.progress}% complete</Typography>
            </Box>
          )}

          {/* Error message for failed builds */}
          {selectedProject.overallStatus === 'failed' && selectedProject.errorMessage && (
            <Box mt={2} p={2} bgcolor="#fff" borderRadius={1}>
              <Typography variant="body2" color="error">
                <strong>Error:</strong> {selectedProject.errorMessage}
              </Typography>
              <Button size="small" color="primary" style={{ marginTop: 8 }}>
                View Troubleshooting Guide
              </Button>
            </Box>
          )}

          {/* Quick Actions */}
          <div className={classes.quickActions}>
            <SyncButton
              projectName={selectedProject.name}
              changelist={selectedProject.changelist}
              disabled={selectedProject.overallStatus !== 'success'}
            />
            <Button variant="outlined" color="primary" onClick={() => setExpanded(!expanded)}>
              {expanded ? 'Hide Details' : 'View Build Stages'}
            </Button>
          </div>
        </div>

        {/* Expandable Detailed Stages */}
        <Collapse in={expanded} className={classes.expandSection}>
          <InfoCard title="Build Stages">
            {selectedProject.stages.map((stage) => (
              <div key={stage.name} className={classes.stageRow}>
                {getStageStatusIcon(stage.status)}
                <span className={classes.stageName}>{stage.name}</span>
                <span className={classes.stageTime}>{stage.duration}</span>
                <span className={classes.stageTime}>{stage.timestamp}</span>
              </div>
            ))}

            {/* Test Results */}
            {selectedProject.testResults.passed > 0 && (
              <Box mt={2} p={2} bgcolor="#f5f5f5" borderRadius={1}>
                <Typography variant="subtitle2">Test Results</Typography>
                <Typography variant="body2">
                  <span style={{ color: '#4caf50' }}>✓ {selectedProject.testResults.passed} passed</span>
                  {selectedProject.testResults.failed > 0 && (
                    <span style={{ color: '#f44336', marginLeft: 16 }}>✗ {selectedProject.testResults.failed} failed</span>
                  )}
                  {selectedProject.testResults.skipped > 0 && (
                    <span style={{ color: '#ff9800', marginLeft: 16 }}>⏭ {selectedProject.testResults.skipped} skipped</span>
                  )}
                </Typography>
              </Box>
            )}

            {/* Artifacts */}
            {selectedProject.artifacts.length > 0 && (
              <Box mt={2} p={2} bgcolor="#f5f5f5" borderRadius={1}>
                <Typography variant="subtitle2">Available Artifacts</Typography>
                {selectedProject.artifacts.map((artifact) => (
                  <Typography key={artifact} variant="body2">
                    📦 {artifact}
                  </Typography>
                ))}
              </Box>
            )}
          </InfoCard>
        </Collapse>

        {/* Help Section */}
        <Grid container spacing={3} style={{ marginTop: 24 }}>
          <Grid item xs={12} md={4}>
            <InfoCard title="Need Help?">
              <Typography variant="body2" paragraph>
                <strong>Build not ready?</strong> The build might still be running or failed at a stage.
              </Typography>
              <Button variant="outlined" size="small" fullWidth>
                View Troubleshooting Guide
              </Button>
            </InfoCard>
          </Grid>
          <Grid item xs={12} md={4}>
            <InfoCard title="Request Access">
              <Typography variant="body2" paragraph>
                Don't see your project? Request access through the production team.
              </Typography>
              <Button variant="outlined" size="small" fullWidth>
                Request Project Access
              </Button>
            </InfoCard>
          </Grid>
          <Grid item xs={12} md={4}>
            <InfoCard title="Report Issue">
              <Typography variant="body2" paragraph>
                Something wrong with the build? Report it to the build team.
              </Typography>
              <Button variant="outlined" size="small" fullWidth>
                Create Support Ticket
              </Button>
            </InfoCard>
          </Grid>
        </Grid>
      </Content>
    </Page>
  );
};
