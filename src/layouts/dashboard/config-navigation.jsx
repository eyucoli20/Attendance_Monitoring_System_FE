import React, { useState, useEffect } from 'react';

import { Stack } from '@mui/material';

import SvgColor from 'src/components/svg-color';

// eslint-disable-next-line import/no-cycle
import { NavItem } from './nav';

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const filterNavByRole = (navConfig, userRole) => navConfig?.filter((route) => route.roles.includes(userRole));

const Navigation = () => {
  const [userRole, setUserRole] = useState(localStorage.getItem('role'));
  const [filteredNavConfig, setFilteredNavConfig] = useState([]);

  useEffect(() => {
    // Update the userRole when it changes in localStorage
    const handleUserRoleChange = () => {
      setUserRole(localStorage.getItem('role'));
    };

    // Listen for changes to the userRole in localStorage
    window.addEventListener('storage', handleUserRoleChange);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('storage', handleUserRoleChange);
    };
  }, []); // Empty dependency array ensures the effect runs only once during component mount

  useEffect(() => {
    // Filter the navigation config based on the user's role
    const updatedNavConfig = filterNavByRole([
      {
        title: 'dashboard',
        path: '/dashboard',
        icon: icon('ic_analytics'),
        roles: [ "ADMIN"],
      },
      {
        title: 'Team List',
        path: '/dashboard/team',
        icon: icon('ic_user'),
        roles: ['ADMIN'],
      },
      {
        title: 'Time Sheet',
        path: '/dashboard/timesheet',
        icon: icon('ic_user'),
        roles: ['ADMIN','USER'],
      },
      {
        title: 'Approve Time Sheet',
        path: '/dashboard/approve-timesheet',
        icon: icon('ic_user'),
        roles: ['MANAGER'],
      },
      {
        title: 'user',
        path: '/dashboard/user',
        icon: icon('ic_user'),
        roles: ['ADMIN'],
      },
    ], userRole);

    // Update the filtered navigation config
    setFilteredNavConfig(updatedNavConfig);

  }, [userRole]);

  const renderMenu = (
    <Stack component="nav" spacing={0.5} sx={{ px: 2 }}>
      {filteredNavConfig?.map((item) => (
        <NavItem key={item.title} item={item} />
      ))}
    </Stack>
  );


  
  

  return renderMenu
};

export default Navigation;
