import type { SvgIconComponent } from '@mui/icons-material';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import RemoveIcon from '@mui/icons-material/Remove';
import { Box, Card, CardContent, Stack, Typography } from '@mui/material';

interface VitalStatCardProps {
  label: string;
  value: string;
  unit?: string;
  trend?: 'up' | 'down' | 'stable' | null;
  trendGoodDirection?: 'up' | 'down' | 'neutral';
  icon: SvgIconComponent;
  color: 'primary' | 'error' | 'warning' | 'success' | 'info' | 'secondary';
  subtitle?: string;
}

const TREND_ICON = {
  up: ArrowUpwardIcon,
  down: ArrowDownwardIcon,
  stable: RemoveIcon
};

const VitalStatCard: React.FC<VitalStatCardProps> = ({
  label,
  value,
  unit,
  trend,
  trendGoodDirection = 'neutral',
  icon: Icon,
  color,
  subtitle
}) => {
  const TrendIcon = trend ? TREND_ICON[trend] : null;

  const trendColor =
    trend == null || trendGoodDirection === 'neutral'
      ? 'text.secondary'
      : (trend === 'up' && trendGoodDirection === 'up') ||
          (trend === 'down' && trendGoodDirection === 'down')
        ? 'success.main'
        : trend === 'stable'
          ? 'text.secondary'
          : 'error.main';

  return (
    <Card variant="outlined" sx={{ borderRadius: 3, flex: 1, minWidth: 130 }}>
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={1}>
          <Box>
            <Typography variant="caption" color="text.secondary" fontWeight={500}>
              {label}
            </Typography>
            <Stack direction="row" alignItems="baseline" spacing={0.5} sx={{ mt: 0.5 }}>
              <Typography variant="h5" fontWeight={700} color={`${color}.main`}>
                {value}
              </Typography>
              {unit && (
                <Typography variant="caption" color="text.secondary">
                  {unit}
                </Typography>
              )}
            </Stack>
            {subtitle && (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mt: 0.25, display: 'block' }}
              >
                {subtitle}
              </Typography>
            )}
          </Box>
          <Stack alignItems="center" spacing={0.5}>
            <Box
              sx={{
                p: 0.75,
                borderRadius: 2,
                bgcolor: `${color}.main`,
                opacity: 0.12,
                display: 'flex',
                alignItems: 'center'
              }}
            />
            <Box
              sx={{
                p: 0.75,
                borderRadius: 2,
                bgcolor: `${color}.main`,
                display: 'flex',
                alignItems: 'center',
                position: 'relative',
                mt: '-28px !important'
              }}
            >
              <Icon sx={{ fontSize: 18, color: 'white' }} />
            </Box>
            {TrendIcon && (
              <Stack direction="row" alignItems="center" spacing={0.25}>
                <TrendIcon sx={{ fontSize: 12, color: trendColor }} />
              </Stack>
            )}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default VitalStatCard;
