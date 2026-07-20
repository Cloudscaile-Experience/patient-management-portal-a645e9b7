import { Box, Card, CardContent, Grid, Stack, Typography, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

import type { VitalSign } from '@/types/vital';
import { dateTimeView } from '@/utils/dateTime';

interface VitalTrendChartProps {
  ns: string;
  records: VitalSign[];
}

interface ChartPoint {
  time: string;
  heartRate: number | null;
  respiratoryRate: number | null;
  systolicBp: number | null;
  diastolicBp: number | null;
  spo2: number | null;
  temperature: number | null;
  weight: number | null;
  painScore: number | null;
}

const ChartTooltip = ({
  active,
  payload,
  label
}: {
  active?: boolean;
  payload?: { name: string; value: number | null; color: string }[];
  label?: string;
}) => {
  if (!active || !payload?.length) return null;
  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        border: 1,
        borderColor: 'divider',
        borderRadius: 2,
        p: 1.5,
        boxShadow: 4,
        minWidth: 140
      }}
    >
      <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.75 }}>
        {label}
      </Typography>
      {payload.map((entry) =>
        entry.value != null ? (
          <Stack key={entry.name} direction="row" justifyContent="space-between" spacing={2}>
            <Stack direction="row" alignItems="center" spacing={0.75}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: entry.color,
                  flexShrink: 0
                }}
              />
              <Typography variant="caption" color="text.secondary">
                {entry.name}
              </Typography>
            </Stack>
            <Typography variant="caption" fontWeight={700}>
              {entry.value}
            </Typography>
          </Stack>
        ) : null
      )}
    </Box>
  );
};

const NO_DATA_HEIGHT = 130;

interface MiniChartProps {
  title: string;
  hasData: boolean;
  noDataLabel: string;
  height?: number;
  children: React.ReactNode;
  badge?: string;
}

const MiniChart: React.FC<MiniChartProps> = ({
  title,
  hasData,
  noDataLabel,
  height = 160,
  children,
  badge
}) => (
  <Card variant="outlined" sx={{ borderRadius: 3, height: '100%' }}>
    <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
        <Typography
          variant="caption"
          fontWeight={700}
          color="text.secondary"
          textTransform="uppercase"
          letterSpacing={0.5}
        >
          {title}
        </Typography>
        {badge && (
          <Typography variant="caption" color="text.disabled" sx={{ fontSize: 10 }}>
            {badge}
          </Typography>
        )}
      </Stack>
      {hasData ? (
        <Box sx={{ height }}>{children}</Box>
      ) : (
        <Stack alignItems="center" justifyContent="center" sx={{ height: NO_DATA_HEIGHT }}>
          <Typography variant="caption" color="text.disabled">
            {noDataLabel}
          </Typography>
        </Stack>
      )}
    </CardContent>
  </Card>
);

const AXIS_PROPS = {
  tick: { fontSize: 10 },
  tickLine: false,
  axisLine: false
} as const;

const GRID_PROPS = { strokeDasharray: '3 3' } as const;

const VitalTrendChart: React.FC<VitalTrendChartProps> = ({ ns, records }) => {
  const { t } = useTranslation(ns);
  const theme = useTheme();

  const sorted = [...records].sort(
    (a, b) => new Date(a.recordedAt).getTime() - new Date(b.recordedAt).getTime()
  );

  const data: ChartPoint[] = sorted.map((r) => ({
    time: dateTimeView(r.recordedAt),
    heartRate: r.heartRate,
    respiratoryRate: r.respiratoryRate,
    systolicBp: r.systolicBp,
    diastolicBp: r.diastolicBp,
    spo2: r.spo2,
    temperature: r.temperature,
    weight: r.weight,
    painScore: r.painScore
  }));

  const has = (key: keyof ChartPoint) => data.some((d) => d[key] != null);
  const hasBp = has('systolicBp') || has('diastolicBp');

  const noDataLabel = t('chart.noData');

  const c = {
    hr: theme.palette.error.main,
    systolic: theme.palette.error.dark,
    diastolic: theme.palette.error.light,
    spo2: theme.palette.info.main,
    rr: theme.palette.secondary.main,
    temp: theme.palette.warning.main,
    weight: theme.palette.success.main,
    pain: theme.palette.warning.dark
  };

  const xAxis = <XAxis dataKey="time" {...AXIS_PROPS} interval="preserveStartEnd" />;

  return (
    <Grid container spacing={2}>
      {/* Blood Pressure — full width */}
      <Grid size={{ xs: 12 }}>
        <MiniChart
          title={t('table.bloodPressure')}
          hasData={hasBp}
          noDataLabel={noDataLabel}
          height={200}
          badge="mmHg"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 4, right: 12, left: -20, bottom: 0 }}>
              <CartesianGrid {...GRID_PROPS} stroke={theme.palette.divider} />
              {xAxis}
              <YAxis {...AXIS_PROPS} domain={['auto', 'auto']} />
              <Tooltip content={<ChartTooltip />} />
              <ReferenceLine
                y={120}
                stroke={theme.palette.warning.light}
                strokeDasharray="4 2"
                label={{ value: '120', fontSize: 9, fill: theme.palette.text.disabled }}
              />
              <ReferenceLine
                y={80}
                stroke={theme.palette.info.light}
                strokeDasharray="4 2"
                label={{ value: '80', fontSize: 9, fill: theme.palette.text.disabled }}
              />
              <Line
                type="monotone"
                dataKey="systolicBp"
                name={t('chart.systolicBp')}
                stroke={c.systolic}
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 4 }}
                connectNulls
              />
              <Line
                type="monotone"
                dataKey="diastolicBp"
                name={t('chart.diastolicBp')}
                stroke={c.diastolic}
                strokeWidth={2}
                strokeDasharray="6 3"
                dot={false}
                activeDot={{ r: 4 }}
                connectNulls
              />
            </LineChart>
          </ResponsiveContainer>
        </MiniChart>
      </Grid>

      {/* Heart Rate | SpO₂ */}
      <Grid size={{ xs: 12, md: 6 }}>
        <MiniChart
          title={t('stats.heartRate')}
          hasData={has('heartRate')}
          noDataLabel={noDataLabel}
          badge="bpm"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 4, right: 12, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="hrGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={c.hr} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={c.hr} stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid {...GRID_PROPS} stroke={theme.palette.divider} />
              {xAxis}
              <YAxis {...AXIS_PROPS} domain={[40, 'auto']} />
              <Tooltip content={<ChartTooltip />} />
              <ReferenceLine
                y={100}
                stroke={theme.palette.error.light}
                strokeDasharray="4 2"
                label={{ value: '100', fontSize: 9, fill: theme.palette.text.disabled }}
              />
              <ReferenceLine
                y={60}
                stroke={theme.palette.info.light}
                strokeDasharray="4 2"
                label={{ value: '60', fontSize: 9, fill: theme.palette.text.disabled }}
              />
              <Area
                type="monotone"
                dataKey="heartRate"
                name={t('chart.heartRate')}
                stroke={c.hr}
                fill="url(#hrGrad)"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 4 }}
                connectNulls
              />
            </AreaChart>
          </ResponsiveContainer>
        </MiniChart>
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <MiniChart
          title={t('stats.spo2')}
          hasData={has('spo2')}
          noDataLabel={noDataLabel}
          badge="%"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 4, right: 12, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="spo2Grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={c.spo2} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={c.spo2} stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid {...GRID_PROPS} stroke={theme.palette.divider} />
              {xAxis}
              <YAxis {...AXIS_PROPS} domain={[85, 100]} />
              <Tooltip content={<ChartTooltip />} />
              <ReferenceLine
                y={95}
                stroke={theme.palette.warning.main}
                strokeDasharray="4 2"
                label={{ value: '95%', fontSize: 9, fill: theme.palette.warning.main }}
              />
              <Area
                type="monotone"
                dataKey="spo2"
                name={t('chart.spo2')}
                stroke={c.spo2}
                fill="url(#spo2Grad)"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 4 }}
                connectNulls
              />
            </AreaChart>
          </ResponsiveContainer>
        </MiniChart>
      </Grid>

      {/* Respiratory Rate | Temperature */}
      <Grid size={{ xs: 12, md: 6 }}>
        <MiniChart
          title={t('table.respiratoryRate')}
          hasData={has('respiratoryRate')}
          noDataLabel={noDataLabel}
          badge="/min"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 4, right: 12, left: -20, bottom: 0 }}>
              <CartesianGrid {...GRID_PROPS} stroke={theme.palette.divider} />
              {xAxis}
              <YAxis {...AXIS_PROPS} domain={[0, 'auto']} />
              <Tooltip content={<ChartTooltip />} />
              <ReferenceLine
                y={20}
                stroke={theme.palette.warning.light}
                strokeDasharray="4 2"
                label={{ value: '20', fontSize: 9, fill: theme.palette.text.disabled }}
              />
              <ReferenceLine
                y={12}
                stroke={theme.palette.info.light}
                strokeDasharray="4 2"
                label={{ value: '12', fontSize: 9, fill: theme.palette.text.disabled }}
              />
              <Line
                type="monotone"
                dataKey="respiratoryRate"
                name={t('chart.respiratoryRate')}
                stroke={c.rr}
                strokeWidth={2.5}
                dot={{ r: 3, fill: c.rr }}
                activeDot={{ r: 5 }}
                connectNulls
              />
            </LineChart>
          </ResponsiveContainer>
        </MiniChart>
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <MiniChart
          title={t('stats.temperature')}
          hasData={has('temperature')}
          noDataLabel={noDataLabel}
          badge="°C"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 4, right: 12, left: -20, bottom: 0 }}>
              <CartesianGrid {...GRID_PROPS} stroke={theme.palette.divider} />
              {xAxis}
              <YAxis {...AXIS_PROPS} domain={['auto', 'auto']} />
              <Tooltip content={<ChartTooltip />} />
              <ReferenceLine
                y={37.2}
                stroke={theme.palette.warning.main}
                strokeDasharray="4 2"
                label={{ value: '37.2', fontSize: 9, fill: theme.palette.warning.main }}
              />
              <ReferenceLine
                y={36.1}
                stroke={theme.palette.info.light}
                strokeDasharray="4 2"
                label={{ value: '36.1', fontSize: 9, fill: theme.palette.text.disabled }}
              />
              <Line
                type="monotone"
                dataKey="temperature"
                name={t('chart.temperature')}
                stroke={c.temp}
                strokeWidth={2.5}
                dot={{ r: 3, fill: c.temp }}
                activeDot={{ r: 5 }}
                connectNulls
              />
            </LineChart>
          </ResponsiveContainer>
        </MiniChart>
      </Grid>

      {/* Weight | Pain Score */}
      <Grid size={{ xs: 12, md: 6 }}>
        <MiniChart
          title={t('stats.weight')}
          hasData={has('weight')}
          noDataLabel={noDataLabel}
          badge="kg"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 4, right: 12, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="wtGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={c.weight} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={c.weight} stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid {...GRID_PROPS} stroke={theme.palette.divider} />
              {xAxis}
              <YAxis {...AXIS_PROPS} domain={['auto', 'auto']} />
              <Tooltip content={<ChartTooltip />} />
              <Area
                type="monotone"
                dataKey="weight"
                name={t('chart.weight')}
                stroke={c.weight}
                fill="url(#wtGrad)"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 4 }}
                connectNulls
              />
            </AreaChart>
          </ResponsiveContainer>
        </MiniChart>
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <MiniChart
          title={t('stats.painScore')}
          hasData={has('painScore')}
          noDataLabel={noDataLabel}
          badge="/ 10"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 4, right: 12, left: -20, bottom: 0 }} barSize={10}>
              <CartesianGrid {...GRID_PROPS} stroke={theme.palette.divider} vertical={false} />
              {xAxis}
              <YAxis {...AXIS_PROPS} domain={[0, 10]} ticks={[0, 2, 4, 6, 8, 10]} />
              <Tooltip content={<ChartTooltip />} />
              <ReferenceLine
                y={7}
                stroke={theme.palette.error.light}
                strokeDasharray="4 2"
                label={{ value: 'Severe', fontSize: 9, fill: theme.palette.error.light }}
              />
              <Bar
                dataKey="painScore"
                name={t('chart.painScore')}
                fill={c.pain}
                radius={[3, 3, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </MiniChart>
      </Grid>
    </Grid>
  );
};

export default VitalTrendChart;
