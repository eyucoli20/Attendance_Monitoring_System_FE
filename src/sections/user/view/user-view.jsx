/* eslint-disable react/prop-types */
/* eslint-disable import/named */
/* eslint-disable perfectionist/sort-named-imports */
/* eslint-disable no-shadow */
/* eslint-disable react/jsx-pascal-case */
/* eslint-disable spaced-comment */
/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import React, { useMemo, useState } from 'react';
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
  IconButton,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';

import { useGet } from '../../../service/useGet';
import AddManagerModal from '../AddManagerModal';
import { usePost } from '../../../service/usePost';
// import { validateUser } from "../utils/validation";
import { useUpdate } from '../../../service/useUpdate';
import { useDelete } from '../../../service/useDelete';

function UserPage() {
  const [validationErrors, setValidationErrors] = useState({});
  const [open, setOpen] = React.useState(false);
  const [fullName, setFullName] = React.useState('');
  const [username, setuserName] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };


  const { data: roles } = useGet('/api/v1/roles');
  const roleNames = roles?.map((role) => role.roleName);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'userId',
        header: 'Id',
        enableEditing: false,
        size: 80,
      },
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
        header: 'user Name / Email',
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
      {
        accessorKey: 'lastLoggedIn',
        header: 'Last LoggedIn',
        enableEditing: false,
        Cell: ({ cell }) => cell?.getValue()?.split('T')[0],
      },
      {
        accessorKey: 'createdAt',
        header: 'CreatedAt',
        enableEditing: false,
        Cell: ({ cell }) => cell?.getValue()?.split('T')[0],
      },
      {
        accessorKey: 'updatedAt',
        header: 'updatedAt',
        enableEditing: false,
        Cell: ({ cell }) => cell.getValue().split('T')[0],
      },
    ],
    [roleNames, validationErrors]
  );

  //call CREATE hook
  const { mutateAsync: createUser, isPending: isCreatingUser } = usePost('/api/v1/users');
  //call READ hook
  const {
    data: fetchedUsers,
    isError: isLoadingUsersError,
    isFetching: isFetchingUsers,
    isLoading: isLoadingUsers,
  } = useGet('/api/v1/users');
  // eslint-disable-next-line spaced-comment
  //call read hook of role api

  // eslint-disable-next-line spaced-comment
  //call UPDATE hook
  const { mutateAsync: updateUser, isPending: isUpdatingUser } = useUpdate('/api/v1/users');
  //call DELETE hook
  const { isPending: isDeletingUser } = useDelete();

  //CREATE action
  const handleCreateUser = async ({ values }) => {
    // const newValidationErrors = validateUser(values);
    // if (Object.values(newValidationErrors).some((error) => error)) {
    //   setValidationErrors(newValidationErrors);
    //   return;
    // }
    // setValidationErrors({});

    const transformedData = {
      password,
      fullName,
      username,
    };

    console.log(transformedData);
    await createUser(transformedData);
    setFullName('')
    setuserName('')
    setPassword('')
    table.setCreatingRow(null); //exit creating mode
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

  const table = useMaterialReactTable({
    columns,
    data: fetchedUsers || [],
    createDisplayMode: 'modal',
    editDisplayMode: 'modal',
    enableEditing: true,
    positionActionsColumn: 'last',
    getRowId: (row) => row.id,
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
    renderTopToolbarCustomActions: ({ table }) => (
      <>
        <Button
          variant="contained"
          style={{
            width: '10%',
            margin: '5px',
            padding: '10px',
            backgroundColor: 'green',
            color: 'white',
          }}
          onClick={() => {
            table.setCreatingRow(true);
          }}
        >
          Create New User
        </Button>
        <Button
          variant="contained"
          style={{
            width: '10%',
            margin: '5px',
            padding: '10px',
            backgroundColor: 'green',
            color: 'white',
          }}
          onClick={handleClickOpen}
        >
          Add manager
        </Button>
      </>
    ),

    state: {
      isLoading: isLoadingUsers,
      isSaving: isCreatingUser || isUpdatingUser || isDeletingUser,
      showAlertBanner: isLoadingUsersError,
      showProgressBars: isFetchingUsers,
    },
  });

  return (
    <>
      <Typography variant="h4" sx={{ mb: 5 }}>
        User List
      </Typography>
      
      <AddManagerModal open={open} handleClose={handleClose} />

      <MaterialReactTable table={table} />
    </>
  );
}

export default UserPage;
