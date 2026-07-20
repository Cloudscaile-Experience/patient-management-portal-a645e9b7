import type { SvgIconComponent } from '@mui/icons-material';
import InboxIcon from '@mui/icons-material/Inbox';
import { Box, Button, Typography } from '@mui/material';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: SvgIconComponent;
  actionLabel?: string;
  onAction?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon: Icon = InboxIcon,
  actionLabel,
  onAction
}) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 1.5,
      p: 6,
      textAlign: 'center'
    }}
  >
    <Icon sx={{ fontSize: 48, color: 'text.disabled' }} />
    <Typography variant="h6" color="text.primary">
      {title}
    </Typography>
    {description && (
      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 360 }}>
        {description}
      </Typography>
    )}
    {actionLabel && onAction && (
      <Button variant="contained" onClick={onAction} sx={{ mt: 1 }}>
        {actionLabel}
      </Button>
    )}
  </Box>
);

export default EmptyState;
