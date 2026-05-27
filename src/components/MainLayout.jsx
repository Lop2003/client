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
import bgImage from '../assets/bg.png';

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
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        position: 'relative',
      }}
    >
      {/* Glassmorphism blur overlay to blend the background image softly */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(255, 255, 255, 0.12)',
          backdropFilter: 'blur(8px)',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />
      {/* Saturated Neon Accent Orbs to amplify colorfulness */}
      <Box sx={{ position: 'absolute', top: '-10%', left: '15%', width: 450, height: 450,
                  bgcolor: 'rgba(0, 81, 187, 0.15)', borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none', zIndex: 0 }} />
      <Box sx={{ position: 'absolute', bottom: '-5%', right: '10%', width: 450, height: 450,
                  bgcolor: 'rgba(255, 219, 27, 0.14)', borderRadius: '50%', filter: 'blur(90px)', pointerEvents: 'none', zIndex: 0 }} />

      {/* ── Desktop Sidebar ─────────────────────────────────────── */}
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          width: sidebarWidth, flexShrink: 0,
          transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          pt: 1.5, pb: 1.5, pl: 1.5, pr: 0.75,
          position: 'relative', zIndex: 1,
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
          zIndex: 1200,
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
          position: 'relative', zIndex: 1,
        }}
      >
        <Box
          sx={{
            flex: 1, display: 'flex', flexDirection: 'column',
            bgcolor: '#ffffff',
            borderRadius: { xs: 0, md: '24px' },
            boxShadow: '0 20px 40px -15px rgba(9, 18, 44, 0.04), 0 1px 3px rgba(0, 0, 0, 0.01)',
            border: '1px solid rgba(226, 232, 240, 0.8)',
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <AppBar
            position="static"
            color="inherit"
            elevation={0}
            sx={{
              borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
              bgcolor: '#ffffff',
            }}
          >
            <Toolbar sx={{ minHeight: '56px !important', px: { xs: 1.5, md: 3 } }}>
              {/* Mobile menu button */}
              <IconButton
                edge="start"
                onClick={() => setMobileOpen(true)}
                sx={{
                  display: { xs: 'flex', md: 'none' }, mr: 1,
                  bgcolor: '#ffffff', border: '1px solid rgba(226,232,240,0.8)',
                  borderRadius: 2.5, width: 36, height: 36,
                  transition: 'all 0.2s',
                  '&:hover': { bgcolor: '#f1f5f9' }
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
                    bgcolor: 'rgba(0, 81, 186, 0.08)', color: 'primary.main',
                    fontWeight: 800, fontSize: '0.6875rem',
                    textTransform: 'uppercase', letterSpacing: '0.08em',
                    height: 22, borderRadius: 1.5,
                  }}
                />
                {pageInfo.breadcrumb && (
                  <>
                    <Typography sx={{ color: 'rgba(226, 232, 240, 0.8)', fontSize: 14 }}>/</Typography>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 800, color: 'text.secondary',
                                      textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {pageInfo.breadcrumb}
                    </Typography>
                  </>
                )}
              </Box>

              {/* User info */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexShrink: 0 }}>
                <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, lineHeight: 1.2, color: 'text.primary' }}>
                    เจ้าหน้าที่บริการลูกค้า uFriend
                  </Typography>
                  <Typography sx={{ fontSize: '0.625rem', color: 'text.disabled', fontWeight: 700,
                                    textTransform: 'uppercase', letterSpacing: '0.08em', mt: 0.25 }}>
                    ฝ่ายบริหารประสบการณ์ลูกค้า
                  </Typography>
                </Box>
                <Tooltip title="โปรไฟล์ผู้ใช้">
                  <Avatar
                    sx={{
                      width: 38, height: 38, bgcolor: 'primary.main',
                      cursor: 'pointer', fontSize: 16,
                      border: '3px solid', borderColor: '#ffffff',
                      boxShadow: '0 4px 10px rgba(0, 81, 186, 0.15)',
                      transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        transform: 'scale(1.08) rotate(5deg)',
                        boxShadow: '0 6px 15px rgba(0, 81, 186, 0.25)',
                      },
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
