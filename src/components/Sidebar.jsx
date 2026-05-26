import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Divider from '@mui/material/Divider';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import ChatIcon from '@mui/icons-material/Chat';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import { PATHS } from '../routes/paths';

const NAV_ITEMS = [
  { label: 'แดชบอร์ด',        path: PATHS.DASHBOARD,    icon: <DashboardIcon fontSize="small" /> },
  { label: 'รายชื่อลูกค้า',   path: PATHS.CUSTOMERS,    icon: <PeopleIcon fontSize="small" /> },
  { label: 'บันทึกคำติชม',    path: PATHS.ADD_FEEDBACK, icon: <ChatIcon fontSize="small" /> },
  { label: 'บันทึกการติดตาม', path: PATHS.FOLLOW_UP,    icon: <AccessTimeIcon fontSize="small" /> },
];

const SIDEBAR_GRADIENT = 'linear-gradient(180deg, #0B0080 0%, #0D009C 40%, #0051BA 100%)';
const COLLAPSED_WIDTH = 68;
const EXPANDED_WIDTH = 240;

export default function Sidebar({ isCollapsed, onToggleCollapse, isMobileOpen, onCloseMobile }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNav = (path) => {
    navigate(path);
    onCloseMobile?.();
  };

  const sidebarContent = (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        background: SIDEBAR_GRADIENT,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        overflow: 'hidden',
        transition: 'width 0.3s ease',
        position: 'relative',
        borderRadius: isMobileOpen ? 0 : '20px',
        boxShadow: '8px 8px 24px rgba(0,29,66,0.15)',
        border: '1px solid rgba(255,255,255,0.1)',
        flexShrink: 0,
      }}
    >
      {/* Decorative blur circles */}
      <Box sx={{ position: 'absolute', top: -40, left: -40, width: 120, height: 120,
                  bgcolor: 'rgba(255,255,255,0.06)', borderRadius: '50%', filter: 'blur(30px)', pointerEvents: 'none' }} />
      <Box sx={{ position: 'absolute', bottom: 40, right: 0, width: 96, height: 96,
                  bgcolor: 'rgba(135,206,250,0.06)', borderRadius: '50%', filter: 'blur(20px)', pointerEvents: 'none' }} />

      <Box sx={{ position: 'relative', zIndex: 1 }}>
        {/* Header: Logo + Brand + Toggle */}
        <Box
          sx={{
            display: 'flex', alignItems: 'center',
            justifyContent: isCollapsed ? 'center' : 'space-between',
            px: isCollapsed ? 0 : 2.5, py: 0,
            height: 64, borderBottom: '1px solid rgba(255,255,255,0.08)',
            flexShrink: 0,
          }}
        >
          {!isCollapsed && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, overflow: 'hidden' }}>
              <Box
                sx={{
                  width: 32, height: 32, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.15)',
                  border: '1px solid rgba(255,255,255,0.2)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}
              >
                <Typography sx={{ fontSize: 16, fontWeight: 900, color: '#FFDA1A', lineHeight: 1 }}>U</Typography>
              </Box>
              <Box sx={{ overflow: 'hidden' }}>
                <Typography sx={{ fontSize: '0.875rem', fontWeight: 700, color: '#fff', lineHeight: 1, whiteSpace: 'nowrap' }}>
                  <Box component="span" sx={{ color: '#FFDA1A' }}>U</Box>friend CX
                </Typography>
                <Typography sx={{ fontSize: '0.6875rem', color: 'rgba(186,230,253,0.8)', fontWeight: 600,
                                  textTransform: 'uppercase', letterSpacing: '0.1em', mt: 0.25 }}>
                  แผงควบคุมหลัก
                </Typography>
              </Box>
            </Box>
          )}

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {/* Desktop toggle */}
            <Tooltip title={isCollapsed ? 'ขยายแถบเมนู' : 'พับแถบเมนู'} placement="right">
              <IconButton
                onClick={onToggleCollapse}
                size="small"
                sx={{
                  display: { xs: 'none', md: 'flex' },
                  color: 'rgba(186,230,253,0.8)',
                  bgcolor: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 1.5, width: 28, height: 28,
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.15)', color: '#fff' },
                }}
              >
                <ChevronLeftIcon
                  sx={{ fontSize: 16, transform: isCollapsed ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }}
                />
              </IconButton>
            </Tooltip>

            {/* Mobile close */}
            {isMobileOpen && (
              <IconButton
                onClick={onCloseMobile}
                size="small"
                sx={{
                  display: { xs: 'flex', md: 'none' },
                  color: 'rgba(186,230,253,0.8)',
                  bgcolor: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 1.5, width: 28, height: 28,
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.15)', color: '#fff' },
                }}
              >
                <CloseIcon sx={{ fontSize: 16 }} />
              </IconButton>
            )}
          </Box>
        </Box>

        {/* Navigation */}
        <List sx={{ px: isCollapsed ? 1 : 1.5, py: 1.5, '& .MuiListItemButton-root': { mb: 0.5 } }}>
          {NAV_ITEMS.map(item => {
            const isActive = location.pathname === item.path;
            return (
              <Tooltip key={item.path} title={isCollapsed ? item.label : ''} placement="right">
                <ListItemButton
                  onClick={() => handleNav(item.path)}
                  sx={{
                    borderRadius: 2.5,
                    minHeight: 40,
                    justifyContent: isCollapsed ? 'center' : 'flex-start',
                    px: isCollapsed ? 0 : 1.5, py: 0.875,
                    borderLeft: isCollapsed ? 'none' : `3px solid ${isActive ? '#4fc3f7' : 'transparent'}`,
                    bgcolor: isActive ? 'rgba(255,255,255,0.12)' : 'transparent',
                    color: isActive ? '#fff' : 'rgba(186,230,253,0.75)',
                    transition: 'all 0.2s',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.08)', color: '#fff' },
                    '&:active': { transform: 'scale(0.98)' },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: isCollapsed ? 0 : 32,
                      color: 'inherit',
                      justifyContent: 'center',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  {!isCollapsed && (
                    <ListItemText
                      primary={item.label}
                      primaryTypographyProps={{
                        fontSize: '0.75rem', fontWeight: isActive ? 700 : 600,
                        noWrap: true, letterSpacing: '0.02em',
                      }}
                    />
                  )}
                </ListItemButton>
              </Tooltip>
            );
          })}
        </List>
      </Box>

      {/* Footer: User badge */}
      <Box
        sx={{
          p: isCollapsed ? 1 : 2, borderTop: '1px solid rgba(30,60,100,0.4)',
          display: 'flex', justifyContent: isCollapsed ? 'center' : 'flex-start',
          position: 'relative', zIndex: 1,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, overflow: 'hidden' }}>
          <Box
            sx={{
              width: 32, height: 32, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.15)', display: 'flex',
              alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}
          >
            <PersonIcon sx={{ fontSize: 16, color: 'rgba(186,230,253,0.8)' }} />
          </Box>
          {!isCollapsed && (
            <Box sx={{ overflow: 'hidden' }}>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#fff', whiteSpace: 'nowrap' }}>
                เจ้าหน้าที่บริการลูกค้า uFriend
              </Typography>
              <Typography sx={{ fontSize: '0.6875rem', color: 'rgba(147,197,253,0.6)', whiteSpace: 'nowrap' }}>
                บทบาท: ดูแลลูกค้าสัมพันธ์ (CX)
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );

  return sidebarContent;
}
