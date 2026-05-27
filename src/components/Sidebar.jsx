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
import brandIcon from '../assets/Icon.png';

const NAV_ITEMS = [
  { label: 'แดชบอร์ด',        path: PATHS.DASHBOARD,    icon: <DashboardIcon fontSize="small" /> },
  { label: 'รายชื่อลูกค้า',   path: PATHS.CUSTOMERS,    icon: <PeopleIcon fontSize="small" /> },
  { label: 'บันทึกคำติชม',    path: PATHS.ADD_FEEDBACK, icon: <ChatIcon fontSize="small" /> },
  { label: 'บันทึกการติดตาม', path: PATHS.FOLLOW_UP,    icon: <AccessTimeIcon fontSize="small" /> },
];

const SIDEBAR_GRADIENT = 'linear-gradient(160deg, #003380 0%, #0051bb 60%, #1E40AF 100%)';
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
        transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        borderRadius: isMobileOpen ? 0 : '24px',
        boxShadow: '0 20px 40px rgba(9, 18, 44, 0.25)',
        border: '1px solid rgba(255,255,255,0.06)',
        flexShrink: 0,
      }}
    >
      {/* Decorative blurred cosmic spots */}
      <Box sx={{ position: 'absolute', top: -30, left: -30, width: 140, height: 140,
                  bgcolor: 'rgba(99, 102, 241, 0.12)', borderRadius: '50%', filter: 'blur(30px)', pointerEvents: 'none' }} />
      <Box sx={{ position: 'absolute', bottom: '20%', right: -20, width: 120, height: 120,
                  bgcolor: 'rgba(56, 189, 248, 0.08)', borderRadius: '50%', filter: 'blur(25px)', pointerEvents: 'none' }} />

      <Box sx={{ position: 'relative', zIndex: 1 }}>
        {/* Header: Logo + Brand + Toggle */}
        <Box
          sx={{
            display: 'flex', alignItems: 'center',
            justifyContent: isCollapsed ? 'center' : 'space-between',
            px: isCollapsed ? 0 : 2.5, py: 0,
            height: 68, borderBottom: '1px solid rgba(255,255,255,0.06)',
            flexShrink: 0,
          }}
        >
          {!isCollapsed && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, overflow: 'hidden' }}>
              <Box
                sx={{
                  width: 34,
                  height: 34,
                  borderRadius: 2.5,
                  bgcolor: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.25), 0 4px 10px rgba(0, 0, 0, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'rotate(-5deg) scale(1.05)',
                  }
                }}
              >
                <Box
                  component="img"
                  src={brandIcon}
                  alt="uFriend"
                  sx={{
                    width: 22,
                    height: 22,
                    objectFit: 'contain',
                    filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.15))'
                  }}
                />
              </Box>
              <Box sx={{ overflow: 'hidden' }}>
                <Typography sx={{ fontSize: '0.875rem', fontWeight: 800, color: '#ffffff', lineHeight: 1, whiteSpace: 'nowrap', letterSpacing: '0.01em' }}>
                  <Box component="span" sx={{ color: '#ffdb1b' }}>U</Box>friend CX
                </Typography>
                <Typography sx={{ fontSize: '0.625rem', color: 'rgba(148, 163, 184, 0.7)', fontWeight: 700,
                                  textTransform: 'uppercase', letterSpacing: '0.08em', mt: 0.25 }}>
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
                  color: 'rgba(148, 163, 184, 0.9)',
                  bgcolor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: 2, width: 28, height: 28,
                  transition: 'all 0.25s',
                  '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.12)', color: '#ffffff', transform: 'scale(1.05)' },
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
                  color: 'rgba(148, 163, 184, 0.9)',
                  bgcolor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: 2, width: 28, height: 28,
                  '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.12)', color: '#ffffff' },
                }}
              >
                <CloseIcon sx={{ fontSize: 16 }} />
              </IconButton>
            )}
          </Box>
        </Box>

        {/* Navigation */}
        <List sx={{ px: isCollapsed ? 1 : 1.75, py: 2, '& .MuiListItemButton-root': { mb: 0.75 } }}>
          {NAV_ITEMS.map(item => {
            const isActive = location.pathname === item.path;
            return (
              <Tooltip key={item.path} title={isCollapsed ? item.label : ''} placement="right">
                <ListItemButton
                  onClick={() => handleNav(item.path)}
                  sx={{
                    borderRadius: 3,
                    minHeight: 44,
                    justifyContent: isCollapsed ? 'center' : 'flex-start',
                    px: isCollapsed ? 0 : 2, py: 1,
                    position: 'relative',
                    bgcolor: isActive ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                    border: '1px solid',
                    borderColor: isActive ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                    boxShadow: isActive ? '0 8px 16px rgba(0,0,0,0.12), inset 0 1px 1px rgba(255,255,255,0.05)' : 'none',
                    color: isActive ? '#ffffff' : 'rgba(148, 163, 184, 0.8)',
                    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      bgcolor: isActive ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.04)',
                      color: '#ffffff',
                      transform: 'translateX(2px)',
                    },
                    '&:active': { transform: 'scale(0.97)' },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      left: 6,
                      top: '25%',
                      height: '50%',
                      width: 3,
                      borderRadius: 99,
                      bgcolor: '#ffdb1b',
                      boxShadow: '0 0 8px #ffdb1b',
                      opacity: isActive ? 1 : 0,
                      transition: 'opacity 0.2s ease',
                      display: isCollapsed ? 'none' : 'block',
                    }
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: isCollapsed ? 0 : 34,
                      color: isActive ? '#ffdb1b' : 'inherit',
                      justifyContent: 'center',
                      transition: 'color 0.25s ease',
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
          p: isCollapsed ? 1 : 2.5,
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          bgcolor: 'rgba(9, 18, 44, 0.2)',
          display: 'flex', justifyContent: isCollapsed ? 'center' : 'flex-start',
          position: 'relative', zIndex: 1,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, overflow: 'hidden' }}>
          <Box
            sx={{
              width: 32, height: 32, borderRadius: '50%',
              bgcolor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            }}
          >
            <PersonIcon sx={{ fontSize: 16, color: 'rgba(148, 163, 184, 0.8)' }} />
          </Box>
          {!isCollapsed && (
            <Box sx={{ overflow: 'hidden' }}>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#ffffff', whiteSpace: 'nowrap', letterSpacing: '0.01em' }}>
                ผู้ดูแลระบบ uFriend
              </Typography>
              <Typography sx={{ fontSize: '0.625rem', color: 'rgba(148, 163, 184, 0.5)', whiteSpace: 'nowrap', fontWeight: 600 }}>
                บทบาท: เจ้าหน้าที่บริการ (CX)
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );

  return sidebarContent;
}
