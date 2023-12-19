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
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';

import AddToTeam from '../team';
import TeamMembers from '../team-members';
import { useGet } from '../../../service/useGet';
import { usePost } from '../../../service/usePost';
// import { validateUser } from "../utils/validation";
import { useUpdate } from '../../../service/useUpdate';
import { useDelete } from '../../../service/useDelete';

function TeamPage() {
  const [validationErrors, setValidationErrors] = useState({});
  const [name, setName] = React.useState('');
  const [manager, setManager] = React.useState('');
  const [description, setDescription] = React.useState('');

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

  // eslint-disable-next-line spaced-comment
  //call read hook of role api

  // api/v1/users?role=MANAGER
  const {
    data: fetchedManager,
    isPending: isLoadingManager,
  } = useGet('/api/v1/users?role=MANAGER');

  const managerNames = fetchedManager?.map((manager) => manager.fullName);

  console.log(fetchedManager);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: 'Id',
        enableEditing: false,
        size: 80,
      },
      {
        accessorKey: 'name',
        header: 'Team Name',
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
        accessorKey: 'manager',
        header: 'Team manager',
        editVariant: 'select',
        editSelectOptions: managerNames,
        muiEditTextFieldProps: {
          select: true,
          error: !!validationErrors?.role,
          helperText: validationErrors?.role,
        },
      },
      {
        accessorKey: 'description',
        header: 'description',
      },
    ],
    [managerNames, validationErrors]
  );

  //call CREATE hook
  const { mutateAsync: createUser, isPending: isCreatingUser } = usePost('/api/v1/teams');
  //call READ hook
  const {
    data: fetchedUsers,
    isError: isLoadingUsersError,
    isFetching: isFetchingUsers,
    isLoading: isLoadingUsers,
  } = useGet('/api/v1/teams');

  // eslint-disable-next-line spaced-comment
  //call UPDATE hook
  const { mutateAsync: updateUser, isPending: isUpdatingUser } = useUpdate('/api/v1/teams');
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
      "name": name,
      "description": description,
      "managerId": manager
    }
    console.log(values);
    console.log(values);
    await createUser(transformedData);
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
        <DialogTitle variant="h5">Create New Team</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <TextField
            style={{ marginTop: '10px' }}
            id="outlined-controlled"
            label="Team Name"
            value={name}
            onChange={(event) => {
              setName(event.target.value);
            }}
          />

          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Manager</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={manager}
              label="Manager"
              onChange={(event) => {
                setManager(event.target.value);
              }}
            >
              
              
              {fetchedManager?.map((manager,index)=>(
                <MenuItem key={index} value={manager?.userId}>{isLoadingManager?"Loading..":manager?.fullName}</MenuItem>
              ))}
              
            </Select>
          </FormControl>
          <TextField
            style={{ marginTop: '10px' }}
            id="outlined-controlled"
            label="Description"
            value={description}
            onChange={(event) => {
              setDescription(event.target.value);
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
        Create New Team
      </Button>
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
        Team list
      </Typography>
      <MaterialReactTable table={table} />
      <Typography variant="h4" sx={{ mb: 5 }}>
        Add To Team 
      </Typography>
      <AddToTeam/> 
      <Typography variant="h4" sx={{ mb: 5 }}>
        Team Members
      </Typography>
      <TeamMembers/>

    </>
  );
}

export default TeamPage;
