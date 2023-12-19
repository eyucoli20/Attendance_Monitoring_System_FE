/* eslint-disable react/prop-types */
/* eslint-disable import/named */
/* eslint-disable perfectionist/sort-named-imports */
/* eslint-disable no-shadow */
/* eslint-disable react/jsx-pascal-case */
/* eslint-disable spaced-comment */
/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import React, { useEffect, useMemo, useState } from 'react';
/* eslint-disable import/no-extraneous-dependencies */
import {
  MRT_EditActionButtons,
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';

import EditIcon from '@mui/icons-material/Edit';
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip,
} from '@mui/material';

import { useGet } from '../../service/useGet';
import { usePost } from '../../service/usePost';
// import { validateUser } from "../utils/validation";
import { useUpdate } from '../../service/useUpdate';
import { useDelete } from '../../service/useDelete';

function AddToTeam() {
  const [validationErrors, setValidationErrors] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const [rowSelectionId, setRowSelectionId] = useState([]);

  const [teamSelected, setTeamSelected] = useState(null);
  const [fullName, setFullName] = React.useState('');
  const [username, setuserName] = React.useState('');
  const [password, setPassword] = React.useState('');

 
  // const formik = useFormik({
  //   6     initialValues: {
  //   7       firstName: '',
  //   8       lastName: '',
  //   9       email: '',
  //   10     },
  //   11     onSubmit: values => {
  //   12
  //   13     },
  //   14   });

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
        header: 'Email',
        muiEditTextFieldProps: {
          type: 'email',
          required: true,
          error: !!validationErrors?.email,
          helperText: validationErrors?.email,
          // remove any previous validation errors when user focuses on the input
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              lastName: undefined,
            }),
        },
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
  } = useGet('/api/v1/users?role=USER');
  // eslint-disable-next-line spaced-comment
  //call read hook of role api

  const {
    data: fetchedTeams
  } = useGet('/api/v1/teams');

  // eslint-disable-next-line spaced-comment
  //call UPDATE hook
  const { mutateAsync: updateUser, isPending: isUpdatingUser } = useUpdate(`api/v1/teams/${teamSelected}/enroll-users`);
  //call DELETE hook
  useDelete();

  //CREATE action
  const handleCreateUser = async () => {

    await updateUser(rowSelectionId);
    setRowSelection({})
    setTeamSelected(null)
    
  };

  //UPDATE action
  const handleSaveUser = async ({ values, table }) => {
    // const newValidationErrors = validateUser(values);
    // if (Object.values(newValidationErrors).some((error) => error)) {
    //   setValidationErrors(newValidationErrors);
    //   return;
    // }
    // setValidationErrors({});

    const data = {
      fullName: values?.fullName,
    };

    await updateUser(data);
    table.setEditingRow(null); //exit editing mode
  };


  useEffect(() => {
    const IdOfSelected = Object.keys(rowSelection).map(Number);
    setRowSelectionId(IdOfSelected)
    

  }, [teamSelected,rowSelection]);

  const table = useMaterialReactTable({
    columns,
    enableRowSelection: true,
    data: fetchedUsers || [],
    createDisplayMode: 'modal',
    editDisplayMode: 'modal',
    enableEditing: true,
    positionActionsColumn: 'last',
    onRowSelectionChange: setRowSelection,
    state: { rowSelection },
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
    onCreatingRowCancel: () => setValidationErrors({}),
    onCreatingRowSave: handleCreateUser,
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: handleSaveUser,
    renderCreateRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle variant="h5">Create New User</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <TextField
            style={{ marginTop: '10px' }}
            id="outlined-controlled"
            label="Name"
            value={fullName}
            onChange={(event) => {
              setFullName(event.target.value);
            }}
          />
          <TextField
            style={{ marginTop: '10px' }}
            id="outlined-controlled"
            label="username"
            value={username}
            onChange={(event) => {
              setuserName(event.target.value);
            }}
          />

          <TextField
            type="password"
            style={{ marginTop: '10px' }}
            id="outlined-controlled"
            label="password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
            }}
          />
        </DialogContent>
        <DialogActions>
          <MRT_EditActionButtons variant="text" table={table} row={row} />
        </DialogActions>
      </>
    ),
    //optionally customize modal content
    renderEditRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle variant="h3">Edit User</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {internalEditComponents}
        </DialogContent>
        <DialogActions>
          <MRT_EditActionButtons variant="text" table={table} row={row} />
        </DialogActions>
      </>
    ),
    renderRowActions: ({ row, table }) => (
      <Box sx={{ display: 'flex', gap: '1rem' }}>
        <Tooltip title="Edit">
          <IconButton onClick={() => table.setEditingRow(row)}>
            <EditIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),
    renderBottomToolbarCustomActions: ({ table }) => (
      <Button
          variant="contained"
          style={{
            width: '10%',
            margin: '5px',
            padding: '10px',
            backgroundColor: 'green',
            color: 'white',
          }}
          onClick={handleCreateUser}
        >
          {isUpdatingUser?"Adding..":"Add"}
        </Button>
    ),

    // state: {
    //   isLoading: isLoadingUsers,
    //   isSaving: isCreatingUser || isUpdatingUser || isDeletingUser,
    //   showAlertBanner: isLoadingUsersError,
    //   showProgressBars: isFetchingUsers,
    // },
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
              {fetchedTeams?.map((team,index) => (
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

export default AddToTeam;
