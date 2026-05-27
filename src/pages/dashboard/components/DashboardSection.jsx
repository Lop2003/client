import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

/**
 * DashboardSection — reusable section title wrapper
 * @param {React.ReactNode} icon - MUI icon element (small)
 * @param {string} label - section label text
 * @param {React.ReactNode} [rightSlot] - optional right-aligned element (e.g. badge)
 * @param {React.ReactNode} children - section content
 */
export default function DashboardSection({ icon, label, children, rightSlot }) {
  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 1.5,
        }}
      >
        <Typography
          sx={{
            fontSize: '0.75rem',
            fontWeight: 800,
            color: '#64748b',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            display: 'flex',
            alignItems: 'center',
            gap: 0.75,
          }}
        >
          {icon}
          {label}
        </Typography>
        {rightSlot}
      </Box>
      {children}
    </Box>
  );
}
