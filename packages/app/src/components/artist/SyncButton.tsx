import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
  Typography,
  Box,
  Stepper,
  Step,
  StepLabel,
  StepContent,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import SyncIcon from '@material-ui/icons/Sync';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';

const useStyles = makeStyles((theme) => ({
  syncButton: {
    padding: theme.spacing(1.5, 4),
    fontSize: '1.1rem',
    fontWeight: 'bold',
  },
  successButton: {
    backgroundColor: '#4caf50',
    color: 'white',
    '&:hover': {
      backgroundColor: '#388e3c',
    },
  },
  dialogContent: {
    minWidth: 400,
  },
  stepContent: {
    paddingLeft: theme.spacing(2),
  },
  successIcon: {
    color: '#4caf50',
    marginRight: theme.spacing(1),
  },
  ugsInfo: {
    backgroundColor: '#f5f5f5',
    padding: theme.spacing(2),
    borderRadius: theme.spacing(1),
    marginTop: theme.spacing(2),
  },
  codeBlock: {
    backgroundColor: '#263238',
    color: '#80cbc4',
    padding: theme.spacing(1.5),
    borderRadius: theme.spacing(0.5),
    fontFamily: 'monospace',
    fontSize: '0.9rem',
    marginTop: theme.spacing(1),
  },
}));

interface SyncButtonProps {
  projectName: string;
  changelist: number;
  disabled?: boolean;
}

export const SyncButton: React.FC<SyncButtonProps> = ({
  projectName,
  changelist,
  disabled = false,
}) => {
  const classes = useStyles();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [syncComplete, setSyncComplete] = useState(false);

  const handleSyncClick = () => {
    setDialogOpen(true);
  };

  const handleConfirmSync = () => {
    setSyncing(true);
    setActiveStep(0);

    // Simulate sync process
    const simulateSteps = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setActiveStep(1);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setActiveStep(2);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setActiveStep(3);
      setSyncing(false);
      setSyncComplete(true);
    };

    simulateSteps();
  };

  const handleClose = () => {
    setDialogOpen(false);
    setSyncing(false);
    setSyncComplete(false);
    setActiveStep(0);
  };

  const syncSteps = [
    {
      label: 'Connecting to Perforce',
      description: `Establishing connection to //Game/${projectName}/Main`,
    },
    {
      label: 'Syncing Editor Binaries',
      description: `Downloading precompiled editor from //Game/UGS/Editor/CL${changelist}`,
    },
    {
      label: 'Syncing Cooked Content',
      description: `Downloading cooked assets from //Game/UGS/Cooked/CL${changelist}`,
    },
    {
      label: 'Ready to Launch',
      description: 'Sync complete! You can now open the project in Unreal Editor.',
    },
  ];

  return (
    <>
      <Button
        variant="contained"
        size="large"
        startIcon={<SyncIcon />}
        onClick={handleSyncClick}
        disabled={disabled}
        className={`${classes.syncButton} ${!disabled ? classes.successButton : ''}`}
      >
        Sync This Build
      </Button>

      <Dialog open={dialogOpen} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {syncComplete ? (
            <Box display="flex" alignItems="center">
              <CheckCircleIcon className={classes.successIcon} />
              Sync Complete!
            </Box>
          ) : syncing ? (
            'Syncing Build...'
          ) : (
            'Sync Build in Unreal Game Sync'
          )}
        </DialogTitle>

        <DialogContent className={classes.dialogContent}>
          {!syncing && !syncComplete && (
            <>
              <DialogContentText>
                This will open Unreal Game Sync and sync your workspace to:
              </DialogContentText>
              <Box className={classes.ugsInfo}>
                <Typography variant="subtitle2" gutterBottom>
                  Project: {projectName}
                </Typography>
                <Typography variant="subtitle2" gutterBottom>
                  Changelist: CL {changelist}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  This includes precompiled editor binaries and cooked content.
                  No compilation required!
                </Typography>
              </Box>

              <Box mt={2}>
                <Typography variant="caption" color="textSecondary">
                  <strong>Note:</strong> Make sure Unreal Game Sync is installed and configured.
                </Typography>
              </Box>
            </>
          )}

          {syncing && (
            <Stepper activeStep={activeStep} orientation="vertical">
              {syncSteps.map((step, index) => (
                <Step key={step.label}>
                  <StepLabel
                    StepIconComponent={() =>
                      index < activeStep ? (
                        <CheckCircleIcon style={{ color: '#4caf50' }} />
                      ) : index === activeStep ? (
                        <CircularProgress size={24} />
                      ) : null
                    }
                  >
                    {step.label}
                  </StepLabel>
                  <StepContent>
                    <Typography variant="body2" color="textSecondary">
                      {step.description}
                    </Typography>
                  </StepContent>
                </Step>
              ))}
            </Stepper>
          )}

          {syncComplete && (
            <>
              <DialogContentText>
                Your workspace has been synced to CL {changelist}. You're ready to work!
              </DialogContentText>

              <Box className={classes.ugsInfo}>
                <Typography variant="subtitle2" gutterBottom>
                  What's included:
                </Typography>
                <Typography variant="body2">
                  ✓ Precompiled Editor binaries (Win64)
                </Typography>
                <Typography variant="body2">
                  ✓ Cooked content for all platforms
                </Typography>
                <Typography variant="body2">
                  ✓ Latest source code and assets
                </Typography>
              </Box>

              <Box mt={2}>
                <Typography variant="subtitle2" gutterBottom>
                  To open the project:
                </Typography>
                <div className={classes.codeBlock}>
                  C:\Game\{projectName.replace(/\s+/g, '')}\{projectName.replace(/\s+/g, '')}.uproject
                </div>
              </Box>
            </>
          )}
        </DialogContent>

        <DialogActions>
          {!syncing && !syncComplete && (
            <>
              <Button onClick={handleClose} color="default">
                Cancel
              </Button>
              <Button
                onClick={handleConfirmSync}
                color="primary"
                variant="contained"
                startIcon={<SyncIcon />}
              >
                Confirm & Sync
              </Button>
            </>
          )}

          {syncing && (
            <Button disabled>
              <CircularProgress size={20} style={{ marginRight: 8 }} />
              Syncing...
            </Button>
          )}

          {syncComplete && (
            <>
              <Button onClick={handleClose} color="default">
                Close
              </Button>
              <Button
                color="primary"
                variant="contained"
                startIcon={<OpenInNewIcon />}
              >
                Open in Editor
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};
