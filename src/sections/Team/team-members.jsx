/* eslint-disable react/prop-types */
/* eslint-disable import/named */
/* eslint-disable perfectionist/sort-named-imports */
/* eslint-disable no-shadow */
/* eslint-disable react/jsx-pascal-case */
/* eslint-disable spaced-comment */
/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import React, {useMemo, useState } from 'react';
/* eslint-disable import/no-extraneous-dependencies */
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';

import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';

import { useGet } from '../../service/useGet';
import { usePost } from '../../service/usePost';
// import { validateUser } from "../utils/validation";

function TeamMembers() {
  const [validationErrors, setValidationErrors] = useState({});
  const [teamSelected, setTeamSelected] = useState(0);

  const { data: roles } = useGet('/api/v1/roles');
  const roleNames = roles?.map((role) => role.roleName);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'fullName',
        header: 'Full Name',
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.fullName,
          helperText: validationErrors?.fullName,
          // remove any previous validation errors when user focuses on the input
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              firstName: undefined,
            }),
          // optionally add validation checking for onBlur or onChange
        },
      },
      {
        accessorKey: 'username',
        header: 'userName',
      },
      {
        accessorKey: 'role',
        header: 'Role',

        editVariant: 'select',
        editSelectOptions: roleNames,
        muiEditTextFieldProps: {
          select: true,
          error: !!validationErrors?.role,
          helperText: validationErrors?.role,
        },
      },
    ],
    [roleNames, validationErrors]
  );

  //call CREATE hook
  usePost('/api/v1/users');
  //call READ hook

  const {
    data: fetchedUsers,
    isError: isLoadingUsersError,
    isFetching: isFetchingMembers,
    isPending: isLoadingTeam,
  } = useGet(`/api/v1/teams/${teamSelected}/members`);

  const { data: fetchedTeams } = useGet('/api/v1/teams');

  // eslint-disable-next-line spaced-comment



  const table = useMaterialReactTable({
    columns,
    data: fetchedUsers || [],
    getRowId: (row) => row.userId,
    muiToolbarAlertBannerProps: isLoadingUsersError
      ? {
          color: 'error',
          children: 'Error loading data',
        }
      : undefined,
    muiTableContainerProps: {
      sx: {
        minHeight: '500px',
      },
    },
    
    
   
   
  
    state: {
      isLoading: isLoadingTeam,
      showProgressBars: isFetchingMembers,
    },
  });

  return (
    <>
      <FormControl sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="demo-simple-select-helper-label">Team</InputLabel>
        <Select
          labelId="demo-simple-select-helper-label"
          id="demo-simple-select-helper"
          label="Team"
          value={teamSelected}
          onChange={(event) => setTeamSelected(event.target.value)}
        >
          {fetchedTeams?.map((team, index) => (
            <MenuItem key={index} value={team.id}>
              {team?.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <MaterialReactTable table={table} />
    </>
  );
}

export default TeamMembers;
