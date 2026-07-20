---
name: design-guidelines
description: MUI design rules for this micro-frontend — theme tokens, component usage, layout primitives, and styling strategy. Load when building or styling any UI component.
user-invocable: false
---

All styling must use the host application's MUI theme. Never hardcode hex colors or arbitrary pixel values when a theme token exists.

## Theme tokens

| Token | Usage |
| --- | --- |
| `primary.main` | Primary action (Blue) |
| `secondary.main` | Secondary action (Orange) |
| `background.default` | Page background (slate 50) |
| `background.paper` | Surface background (white) |
| `text.primary` | Body text |
| `text.secondary` | Muted / helper text |
| `success.main` / `error.main` / `warning.main` / `info.main` | Status colours |

Typography uses **IBM Plex Sans** globally — always use `<Typography>` rather than raw HTML tags.

## Border radii (applied automatically by theme — do not override)

| Component type | Radius |
| --- | --- |
| Buttons & Inputs | `10px` |
| Cards & Dialogs | `16px` |
| Chips, Tooltips, MenuItems | `8px` |
| Paper | `12px` |

## Component rules

- **Buttons**: `<Button variant="contained">` or `<Button variant="outlined">` — never reconstruct from `Box`.
- **Cards**: `<Card>` + `<CardContent>` — hover lift effect is applied by theme.
- **Inputs**: `<TextField>` — theme applies border radius, focus ring, and shadows.
- **Tabs**: `<Tabs>` + `<Tab>` — 3px thick indicator with rounded top corners from theme.

## Styling strategy

```tsx
// ✅ sx prop — for layout, spacing, flex, one-off overrides
<Box sx={{ p: 2, display: 'flex', gap: 1, bgcolor: 'background.paper' }}>

// ✅ styled() — for reusable customised components
const StyledCard = styled(Card)(({ theme }) => ({
  borderLeft: `4px solid ${theme.palette.primary.main}`
}));

// ❌ Never
<Box sx={{ backgroundColor: '#0250D9' }} />    // hardcoded hex
<Box sx={{ borderRadius: '16px' }} />           // duplicating theme value
```

## Layout primitives

- `<Stack>` — 1-dimensional (row/column) with consistent spacing
- `<Box>` — generic container supporting `sx`
- `<Grid>` — 2-dimensional layouts

## Icons

```tsx
import SearchIcon from '@mui/icons-material/Search';
<SearchIcon color="action" />
```

## No CSS files

Do not create `.css`, `.scss`, or `.module.css` files. All styling stays in TypeScript via `sx` or `styled()`.
