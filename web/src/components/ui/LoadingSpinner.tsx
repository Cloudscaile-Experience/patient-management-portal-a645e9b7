import { Box, CircularProgress, Typography } from '@mui/material';

interface LoadingSpinnerProps {
  label?: string;
  size?: number;
  fullHeight?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  label,
  size = 40,
  fullHeight = false
}) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 2,
      height: fullHeight ? '100%' : 'auto',
      p: 4
    }}
  >
    <CircularProgress size={size} />
    {label && (
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
    )}
  </Box>
);

export default LoadingSpinner;
