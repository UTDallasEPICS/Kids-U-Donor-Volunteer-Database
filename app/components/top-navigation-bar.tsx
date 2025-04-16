'use client';
import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useState } from 'react';

export default function TopNavigationBar() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar
      position="static"
      color="default"
      className="bg-white shadow-1x border-b border-gray-300"
    >
      <Toolbar className="flex justify-between items-center px-6 h-16">
        <Box className="flex items-center gap-2">
          <Avatar
            alt="Kids-U Icon"
            src="https://kids-u.org/wp-content/uploads/2024/03/cropped-kids-u-logo-round-small.png"
            sx={{ width: 40, height: 40 }} 
          />
          <Typography
            variant="h6"
            className="font-bold flex items-center text-gray-900"
          >
            Kids-U Admin
          </Typography>
        </Box>

        <Box className="flex items-center gap-2">
          <Typography variant="subtitle1" className="text-gray-700 text-sm">
            Admin Profile
          </Typography>
          <IconButton
            onClick={handleMenuOpen}
            className="p-0"
          >
            <Avatar alt="Admin" src="https://static-00.iconduck.com/assets.00/user-avatar-icon-512x512-vufpcmdn.png" />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
            <MenuItem onClick={handleMenuClose}>Settings</MenuItem>
            <MenuItem onClick={handleMenuClose}>Logout</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}


