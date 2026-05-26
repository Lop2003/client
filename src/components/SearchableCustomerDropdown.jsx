import { useState, useRef, useEffect } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ClearIcon from '@mui/icons-material/Clear';
import IconButton from '@mui/material/IconButton';

/**
 * Searchable customer dropdown — same logic as original, styled with MUI
 */
export default function SearchableCustomerDropdown({
  customers = [],
  selectedCustomerId = '',
  onChange,
  label = 'เลือกบัญชีลูกค้าสัญญา',
  placeholder = 'พิมพ์เพื่อค้นหาชื่อลูกค้า, เบอร์โทร, สาขา หรือสินค้า...',
  showOverdueBadges = false,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const selectedCustomer = customers.find(c => c.id === selectedCustomerId);

  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.branch.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const displayValue = isOpen
    ? searchQuery
    : selectedCustomer
      ? `${selectedCustomer.name} (${selectedCustomer.product} / สาขา${selectedCustomer.branch})`
      : '';

  return (
    <Box ref={containerRef} sx={{ position: 'relative' }}>
      {label && (
        <Typography
          sx={{ fontSize: '0.625rem', fontWeight: 800, color: 'text.secondary',
                textTransform: 'uppercase', letterSpacing: '0.08em', mb: 0.75 }}
        >
          {label}
        </Typography>
      )}

      <TextField
        fullWidth
        size="small"
        value={displayValue}
        placeholder={placeholder}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          setIsOpen(true);
          if (!e.target.value) onChange('');
        }}
        onFocus={() => { setIsOpen(true); setSearchQuery(''); }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              {selectedCustomerId && !isOpen ? (
                <IconButton size="small" onClick={() => { onChange(''); setSearchQuery(''); }}>
                  <ClearIcon sx={{ fontSize: 14 }} />
                </IconButton>
              ) : (
                <ExpandMoreIcon
                  sx={{
                    fontSize: 16, color: 'text.disabled',
                    transform: isOpen ? 'rotate(180deg)' : 'none',
                    transition: 'transform 0.2s',
                  }}
                />
              )}
            </InputAdornment>
          ),
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 3,
            fontSize: '0.75rem',
            fontWeight: 600,
            bgcolor: '#f8fafc',
            '&:hover': { bgcolor: '#fff' },
            '&.Mui-focused': { bgcolor: '#fff' },
          },
        }}
      />

      {isOpen && (
        <Paper
          elevation={8}
          sx={{
            position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 1300,
            mt: 0.5, borderRadius: 3, maxHeight: 224, overflowY: 'auto',
            border: '1px solid', borderColor: 'divider',
          }}
        >
          {filteredCustomers.length === 0 ? (
            <Typography
              sx={{ px: 2, py: 1.5, fontSize: '0.75rem', color: 'text.disabled',
                    textAlign: 'center', fontWeight: 700 }}
            >
              ไม่พบรายชื่อลูกค้าที่ตรงคำค้นหา
            </Typography>
          ) : (
            filteredCustomers.map(c => {
              const isSelected = c.id === selectedCustomerId;
              return (
                <Box
                  key={c.id}
                  component="button"
                  onClick={() => { onChange(c.id); setIsOpen(false); setSearchQuery(''); }}
                  sx={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    width: '100%', px: 2, py: 1, textAlign: 'left', border: 'none',
                    cursor: 'pointer', fontFamily: '"Kanit", sans-serif',
                    bgcolor: isSelected ? '#EEF2FF' : 'transparent',
                    borderLeft: isSelected ? '3px solid #0051BA' : '3px solid transparent',
                    '&:hover': { bgcolor: isSelected ? '#EEF2FF' : '#f8fafc' },
                    transition: 'background 0.15s',
                  }}
                >
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                      <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: isSelected ? 'primary.main' : 'text.primary' }}>
                        {c.name}
                      </Typography>
                      {showOverdueBadges && c.status === 'overdue' && (
                        <Chip label="ค้างชำระ" size="small" color="error"
                          sx={{ height: 16, fontSize: '0.5625rem', fontWeight: 800 }} />
                      )}
                    </Box>
                    <Typography sx={{ fontSize: '0.625rem', color: 'text.secondary', fontFamily: 'monospace' }}>
                      เบอร์: {c.phone}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 0.5, flexShrink: 0 }}>
                    <Chip label={c.product} size="small"
                      sx={{ height: 16, fontSize: '0.5625rem', fontWeight: 700,
                            bgcolor: '#f1f5f9', color: '#475569' }} />
                    <Chip label={`สาขา ${c.branch}`} size="small"
                      sx={{ height: 16, fontSize: '0.5625rem', fontWeight: 700,
                            bgcolor: '#eff6ff', color: '#1d4ed8' }} />
                  </Box>
                </Box>
              );
            })
          )}
        </Paper>
      )}
    </Box>
  );
}
