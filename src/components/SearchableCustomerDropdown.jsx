import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';

/**
 * Searchable customer dropdown — rewritten using MUI Autocomplete for perfect stability,
 * keyboard navigation, and rich visual presentation without focus/clearing bugs.
 */
export default function SearchableCustomerDropdown({
  customers = [],
  selectedCustomerId = '',
  onChange,
  label = 'เลือกบัญชีลูกค้าสัญญา',
  placeholder = 'พิมพ์เพื่อค้นหาชื่อลูกค้า, เบอร์โทร, สาขา หรือสินค้า...',
  showOverdueBadges = false,
}) {
  const selectedCustomer = customers.find(c => c.id === selectedCustomerId) || null;

  return (
    <Box sx={{ position: 'relative' }}>
      {label && (
        <Typography
          sx={{
            fontSize: '0.75rem',
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
        options={customers}
        value={selectedCustomer}
        onChange={(event, newValue) => {
          onChange(newValue ? newValue.id : '');
        }}
        getOptionLabel={(option) =>
          `${option.name} (${option.product} / สาขา${option.branch})`
        }
        isOptionEqualToValue={(option, value) => option.id === value.id}
        filterOptions={(options, { inputValue }) => {
          const clean = inputValue.toLowerCase().trim();
          return options.filter(c =>
            c.name.toLowerCase().includes(clean) ||
            c.phone.toLowerCase().includes(clean) ||
            c.product.toLowerCase().includes(clean) ||
            c.branch.toLowerCase().includes(clean) ||
            c.id.toLowerCase().includes(clean)
          );
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder={selectedCustomer ? '' : placeholder}
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <>
                  <InputAdornment position="start">
                    <SearchIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
                  </InputAdornment>
                  {params.InputProps.startAdornment}
                </>
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
                px: '16px !important',
                py: '8px !important',
                fontFamily: '"Kanit", sans-serif',
                borderLeft: option.id === selectedCustomerId ? '3px solid #0051BA' : '3px solid transparent',
              }}
            >
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 700 }}>
                    {option.name}
                  </Typography>
                  {showOverdueBadges && option.status === 'overdue' && (
                    <Chip
                      label="ค้างชำระ"
                      size="small"
                      color="error"
                      sx={{ height: 18, fontSize: '0.6875rem', fontWeight: 800 }}
                    />
                  )}
                </Box>
                <Typography sx={{ fontSize: '0.625rem', color: 'text.secondary', fontFamily: 'monospace' }}>
                  เบอร์: {option.phone}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 0.5, flexShrink: 0, ml: 2 }}>
                <Chip
                  label={option.product}
                  size="small"
                  sx={{
                    height: 18,
                    fontSize: '0.6875rem',
                    fontWeight: 700,
                    bgcolor: '#f1f5f9',
                    color: '#475569',
                  }}
                />
                <Chip
                  label={`สาขา ${option.branch}`}
                  size="small"
                  sx={{
                    height: 18,
                    fontSize: '0.6875rem',
                    fontWeight: 700,
                    bgcolor: '#eff6ff',
                    color: '#1d4ed8',
                  }}
                />
              </Box>
            </Box>
          );
        }}
        slotProps={{
          paper: {
            elevation: 8,
            sx: {
              borderRadius: 3,
              mt: 0.5,
              border: '1px solid',
              borderColor: 'divider',
            },
          },
        }}
      />
    </Box>
  );
}
