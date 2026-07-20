---
name: mui-usage
description: Build and style UI components with Material-UI (MUI) following the micro-frontend theming rules. Use when creating or styling any React component in this project.
when_to_use: Triggered when writing JSX, building a component, laying out a page, or adding any visual element. Enforces sx prop usage, theme tokens, and layout primitives.
allowed-tools: Read Bash(npm install *)
---

This project uses MUI v7. The host provides the theme — never call `createTheme()`.

## Styling: `sx` prop (primary)

Use `sx` for all layout, spacing, and one-off colour needs:

```tsx
<Box sx={{ p: 2, display: 'flex', gap: 1, bgcolor: 'background.paper', borderRadius: 2 }}>
  <Typography variant="body2" color="text.secondary">Helper text</Typography>
</Box>
```

## Styling: `styled()` API (for reusable components)

```tsx
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';

const PrimaryAction = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1.5, 3),
  backgroundColor: theme.palette.primary.main,
  '&:hover': { backgroundColor: theme.palette.primary.dark }
}));
```

## Layout primitives

```tsx
// Row with spacing
<Stack direction="row" spacing={2} alignItems="center">

// Column with spacing
<Stack spacing={1.5}>

// Generic container
<Box sx={{ flex: 1, overflow: 'auto' }}>

// 2-D grid
<Grid container spacing={2}>
  <Grid size={{ xs: 12, md: 6 }}>...</Grid>
</Grid>
```

## Typography

Always use `<Typography>` — never raw `<p>`, `<h1>`, or `<span>`:

```tsx
<Typography variant="h5" fontWeight={600}>Page title</Typography>
<Typography variant="body2" color="text.secondary">Subtitle</Typography>
<Typography variant="caption" color="text.disabled">Timestamp</Typography>
```

## Common components

```tsx
// Buttons
<Button variant="contained">Primary</Button>
<Button variant="outlined">Secondary</Button>
<Button variant="text">Tertiary</Button>

// Input
<TextField label="Patient name" fullWidth size="small" />

// Card
<Card>
  <CardContent>
    <Typography variant="h6">Title</Typography>
  </CardContent>
</Card>

// Icons
import SearchIcon from '@mui/icons-material/Search';
<SearchIcon color="action" fontSize="small" />
```

## Shared components in this project

Prefer the shared primitives in `src/components/ui/` before building from scratch:

- `<LoadingSpinner>` — loading state
- `<EmptyState>` — empty / zero-data state
- `<ErrorBoundary>` — async error containment
- `<PageHeader>` — title + subtitle + action buttons row

## Rules

- No `.css`, `.scss`, or `.module.css` files — all styling stays in TypeScript.
- No hardcoded hex colors — use `primary.main`, `background.paper`, etc.
- No manual `borderRadius` or `boxShadow` that duplicate theme values.
