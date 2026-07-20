import { Box, Divider, Stack, Typography } from '@mui/material';
import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  divider?: boolean;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, actions, divider = true }) => (
  <Box>
    <Stack
      direction="row"
      alignItems="flex-start"
      justifyContent="space-between"
      spacing={2}
      sx={{ py: 2, px: 3 }}
    >
      <Box>
        <Typography variant="h5" color="text.primary" fontWeight={600}>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {subtitle}
          </Typography>
        )}
      </Box>
      {actions && (
        <Stack direction="row" spacing={1} alignItems="center">
          {actions}
        </Stack>
      )}
    </Stack>
    {divider && <Divider />}
  </Box>
);

export default PageHeader;
