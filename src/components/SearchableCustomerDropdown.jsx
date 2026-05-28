import { useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import CircularProgress from '@mui/material/CircularProgress';

/**
 * Searchable customer dropdown — rewritten using MUI Autocomplete for perfect stability,
 * keyboard navigation, and rich visual presentation without focus/clearing bugs.
 */
export default function SearchableCustomerDropdown({
  customers = [],
  selectedCustomerId = '',
  selectedCustomerDetail = null,
  onChange,
  onSearchChange,
  isLoading = false,
  label = 'เลือกบัญชีลูกค้าสัญญา',
  placeholder = 'พิมพ์เพื่อค้นหาชื่อลูกค้า, เบอร์โทร, สาขา หรือสินค้า...',
  showOverdueBadges = false,
}) {
  const selectedCustomer = selectedCustomerDetail || customers.find(c => c.id === selectedCustomerId) || null;
  const [inputValue, setInputValue] = useState('');

  // มั่นใจว่าลูกค้าที่เลือกอยู่จะแสดงผลเสมอ แม้ว่าไม่อยู่ในผลการค้นหาปัจจุบัน
  const finalOptions = [...customers];
  if (selectedCustomer && !customers.some(c => c.id === selectedCustomer.id)) {
    finalOptions.unshift(selectedCustomer);
  }

  return (
    <Box sx={{ position: 'relative' }}>
      {label && (
        <Typography
          sx={{
            fontSize: '0.6875rem',
            fontWeight: 800,
            color: 'text.secondary',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            mb: 0.75,
          }}
        >
          {label}
        </Typography>
      )}

      <Autocomplete
        options={finalOptions}
        value={selectedCustomer}
        onChange={(event, newValue) => {
          onChange(newValue ? newValue.id : '');
        }}
        inputValue={inputValue}
        onInputChange={(event, newInputValue, reason) => {
          setInputValue(newInputValue);
          if (onSearchChange && (reason === 'input' || reason === 'clear')) {
            onSearchChange(newInputValue);
          }
        }}
        getOptionLabel={(option) =>
          `${option.name} (${option.product} / สาขา${option.branch})`
        }
        isOptionEqualToValue={(option, value) => option.id === value.id}
        filterOptions={(options, state) => {
          // หากเป็นการค้นหาผ่าน Server-side ให้ข้ามการกรองแบบ Local
          if (onSearchChange) {
            return options;
          }
          const clean = state.inputValue.toLowerCase().trim();
          return options.filter(c =>
            c.name.toLowerCase().includes(clean) ||
            c.phone.toLowerCase().includes(clean) ||
            c.product.toLowerCase().includes(clean) ||
            c.branch.toLowerCase().includes(clean) ||
            c.id.toLowerCase().includes(clean)
          );
        }}
        loading={isLoading}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder={selectedCustomer ? '' : placeholder}
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <>
                  <InputAdornment position="start">
                    <SearchIcon sx={{ fontSize: 16, color: 'text.secondary', mr: 0.5 }} />
                  </InputAdornment>
                  {params.InputProps.startAdornment}
                </>
              ),
              endAdornment: (
                <>
                  {isLoading ? <CircularProgress color="primary" size={16} /> : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                fontSize: '0.75rem',
                fontWeight: 700,
                bgcolor: 'rgba(255, 255, 255, 0.65)',
                transition: 'all 0.2s',
                '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.9)' },
                '&.Mui-focused': { bgcolor: '#ffffff', boxShadow: '0 0 0 3px rgba(0, 81, 186, 0.12)' },
              },
            }}
          />
        )}
        renderOption={(props, option) => {
          const { key, ...optionProps } = props;
          return (
            <Box
              key={option.id}
              component="li"
              {...optionProps}
              sx={{
                display: 'flex !important',
                alignItems: 'center',
                justifyContent: 'space-between',
                px: '20px !important',
                py: '10px !important',
                fontFamily: 'inherit',
                borderLeft: option.id === selectedCustomerId ? '4px solid #0051BA' : '4px solid transparent',
                transition: 'all 0.15s ease',
                '&:hover': {
                  bgcolor: 'rgba(0, 81, 186, 0.04) !important',
                }
              }}
            >
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography sx={{ fontSize: '0.78rem', fontWeight: 800, color: 'text.primary' }}>
                    {option.name}
                  </Typography>
                  {showOverdueBadges && option.status === 'overdue' && (
                    <Chip
                      label="ค้างชำระค่างวด"
                      size="small"
                      color="error"
                      sx={{ height: 18, fontSize: '0.625rem', fontWeight: 800, borderRadius: '4px' }}
                    />
                  )}
                </Box>
                <Typography sx={{ fontSize: '0.6875rem', color: 'text.secondary', fontFamily: 'monospace', fontWeight: 600 }}>
                  เบอร์โทรศัพท์: {option.phone}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 0.75, flexShrink: 0, ml: 2 }}>
                <Chip
                  label={option.product}
                  size="small"
                  sx={{
                    height: 18,
                    fontSize: '0.625rem',
                    fontWeight: 800,
                    borderRadius: '4px',
                    bgcolor: 'rgba(148, 163, 184, 0.08)',
                    color: 'text.primary',
                  }}
                />
                <Chip
                  label={`สาขา ${option.branch}`}
                  size="small"
                  sx={{
                    height: 18,
                    fontSize: '0.625rem',
                    fontWeight: 800,
                    borderRadius: '4px',
                    bgcolor: 'rgba(0, 81, 186, 0.06)',
                    color: 'primary.main',
                  }}
                />
              </Box>
            </Box>
          );
        }}
        slotProps={{
          paper: {
            sx: {
              borderRadius: '16px',
              mt: 0.75,
              border: '1px solid rgba(226, 232, 240, 0.8)',
              boxShadow: '0 12px 30px rgba(9, 18, 44, 0.12)',
              bgcolor: 'rgba(255, 255, 255, 0.98)',
              backdropFilter: 'blur(20px)',
              overflow: 'hidden'
            },
          },
        }}
      />
    </Box>
  );
}
