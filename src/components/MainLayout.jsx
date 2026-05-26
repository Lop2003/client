import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Drawer from '@mui/material/Drawer';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuIcon from '@mui/icons-material/Menu';
import PersonIcon from '@mui/icons-material/Person';
import Sidebar from './Sidebar';
import { PATHS } from '../routes/paths';

const PAGE_LABELS = {
  [PATHS.DASHBOARD]:    { breadcrumb: null,             label: 'dashboard' },
  [PATHS.CUSTOMERS]:    { breadcrumb: 'รายชื่อลูกค้า', label: 'customers' },
  [PATHS.ADD_FEEDBACK]: { breadcrumb: 'บันทึกคำติชม',  label: 'add-feedback' },
  [PATHS.FOLLOW_UP]:    { breadcrumb: 'บันทึกการติดตาม', label: 'add-followup' },
};

const MOBILE_DRAWER_WIDTH = 240;
const COLLAPSED_WIDTH = 68;
const EXPANDED_WIDTH = 240;

export default function MainLayout({ children }) {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const pageInfo = PAGE_LABELS[location.pathname] ?? PAGE_LABELS[PATHS.DASHBOARD];
  const sidebarWidth = isCollapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH;

  return (
    <Box
      sx={{
        display: 'flex',
        height: '100vh',
        overflow: 'hidden',
        bgcolor: '#e8edf5',
        backgroundImage: 'radial-gradient(ellipse at 20% 10%, rgba(0,81,186,0.08) 0%, transparent 60%), radial-gradient(ellipse at 80% 90%, rgba(0,81,186,0.05) 0%, transparent 60%)',
      }}
    >
      {/* ── Desktop Sidebar ─────────────────────────────────────── */}
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          width: sidebarWidth, flexShrink: 0,
          transition: 'width 0.3s ease',
          pt: 1.5, pb: 1.5, pl: 1.5, pr: 0.75,
        }}
      >
        <Sidebar
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed(v => !v)}
          isMobileOpen={false}
          onCloseMobile={() => {}}
        />
      </Box>

      {/* ── Mobile Drawer ──────────────────────────────────────── */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { width: MOBILE_DRAWER_WIDTH, bgcolor: 'transparent', border: 'none' },
        }}
      >
        <Sidebar
          isCollapsed={false}
          onToggleCollapse={() => {}}
          isMobileOpen
          onCloseMobile={() => setMobileOpen(false)}
        />
      </Drawer>

      {/* ── Main Content ───────────────────────────────────────── */}
      <Box
        sx={{
          flex: 1, display: 'flex', flexDirection: 'column',
          overflow: 'hidden', p: { xs: 0, md: 1.5 }, pl: { md: 0.75 },
        }}
      >
        <Box
          sx={{
            flex: 1, display: 'flex', flexDirection: 'column',
            bgcolor: 'background.paper',
            borderRadius: { xs: 0, md: '20px' },
            boxShadow: { md: '0 0 0 1px rgba(0,0,0,0.04), 0 8px 32px rgba(0,0,0,0.06)' },
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <AppBar
            position="static"
            color="inherit"
            elevation={0}
            sx={{
              borderBottom: '1px solid', borderColor: 'divider',
              bgcolor: 'background.paper',
            }}
          >
            <Toolbar sx={{ minHeight: '56px !important', px: { xs: 1.5, md: 3 } }}>
              {/* Mobile menu button */}
              <IconButton
                edge="start"
                onClick={() => setMobileOpen(true)}
                sx={{
                  display: { xs: 'flex', md: 'none' }, mr: 1,
                  bgcolor: '#f8fafc', border: '1px solid #e2e8f0',
                  borderRadius: 2, width: 36, height: 36,
                }}
              >
                <MenuIcon sx={{ fontSize: 20, color: '#64748b' }} />
              </IconButton>

              {/* Breadcrumb */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: 'auto' }}>
                <Chip
                  label={pageInfo.label}
                  size="small"
                  sx={{
                    bgcolor: '#EEF2FF', color: 'primary.main',
                    fontWeight: 800, fontSize: '0.6875rem',
                    textTransform: 'uppercase', letterSpacing: '0.08em',
                    height: 22, borderRadius: 1,
                  }}
                />
                {pageInfo.breadcrumb && (
                  <>
                    <Typography sx={{ color: 'divider', fontSize: 14 }}>/</Typography>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: 'text.secondary',
                                      textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {pageInfo.breadcrumb}
                    </Typography>
                  </>
                )}
              </Box>

              {/* User info */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexShrink: 0 }}>
                <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, lineHeight: 1 }}>
                    เจ้าหน้าที่บริการลูกค้า uFriend
                  </Typography>
                  <Typography sx={{ fontSize: '0.6875rem', color: 'text.disabled', fontWeight: 600,
                                    textTransform: 'uppercase', letterSpacing: '0.08em', mt: 0.25 }}>
                    ฝ่ายบริหารประสบการณ์ลูกค้า
                  </Typography>
                </Box>
                <Tooltip title="โปรไฟล์ผู้ใช้">
                  <Avatar
                    sx={{
                      width: 36, height: 36, bgcolor: 'primary.main',
                      cursor: 'pointer', fontSize: 16,
                      border: '2px solid', borderColor: 'primary.light',
                      '&:hover': { bgcolor: 'primary.dark', transform: 'scale(1.05)', transition: 'all 0.2s' },
                    }}
                  >
                    <PersonIcon sx={{ fontSize: 20 }} />
                  </Avatar>
                </Tooltip>
              </Box>
            </Toolbar>
          </AppBar>

          {/* Scrollable content area */}
          <Box sx={{ flex: 1, overflowY: 'auto', p: { xs: 2, md: 3 } }}>
            {children}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
