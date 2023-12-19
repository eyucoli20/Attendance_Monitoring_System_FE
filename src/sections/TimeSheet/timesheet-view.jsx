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
  MRT_GlobalFilterTextField,
  MRT_TableBodyCellValue,
  MRT_TablePagination,
  MRT_ToolbarAlertBanner,
  flexRender,
  useMaterialReactTable,
} from 'material-react-table';

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
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';

import { useGet } from '../../service/useGet';
import { usePost } from '../../service/usePost';
// import { validateUser } from "../utils/validation";
import { useUpdate } from '../../service/useUpdate';
import { useDelete } from '../../service/useDelete';
import AddTimeSheetMOdal from './AddTimeSheetModal';

function TimesheetPage() {
  const [validationErrors, setValidationErrors] = useState({});
  const [attendanceDuration, setAttendanceDuration] = React.useState('');
  const [teamId, setTeamId] = React.useState('');
  const [teamSelected, setTeamSelected] = useState(0);
  const [open, setOpen] = React.useState(false);
  const [todayId, setTodayId] = React.useState(null);
  const userRole = localStorage.getItem('role')
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const {
    data  } = useGet('/api/v1/users/me');
  
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

 

  const columns = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: 'Time Sheet Id',
        enableEditing: false,
        size: 80,
      },
      // {
      //   accessorKey: 'userId',
      //   header: 'userId',
      // },
      {
        accessorKey: 'status',
        header: 'status',
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
        accessorKey: 'approved',
        header: 'approved',
        Cell: ({ cell }) => cell.getValue() === true ?"TRUE":"FALSE",
      },
      {
        accessorKey: 'date',
        header: 'date',
        enableEditing: false,
        Cell: ({ cell }) => cell?.getValue()?.split('T')[0],
      },
    ],
    [validationErrors]
  );

  //call CREATE hook
  const { mutateAsync: createUser, isPending: isCreatingUser } = usePost('/api/v1/attendance-records');
  //call READ hook
  const {
    data: fetchedTimeSheet,
    isError: isLoadingUsersError,
    isFetching: isFetchingUsers,
    isLoading: isLoadingUsers,
  } = useGet(`/api/v1/attendance-records/teams/${teamSelected}`);
  // eslint-disable-next-line spaced-comment
  //call read hook of role api

  const {
    data: fetchedTeam,
    isPending
  } = useGet('/api/v1/teams');

  const {
    data: fetchedTeams  } = useGet(`/api/v1/users/${data?.userId}/teams`);
   
      
  // eslint-disable-next-line spaced-comment
  //call UPDATE hook
  const { mutateAsync: submitAttendance, isPending: isSubmitingAttendance } = useUpdate(`api/v1/attendance-records/${todayId}/fill`);
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
        "attendanceDuration": attendanceDuration,
        "teamId": teamId
    }


    await createUser(transformedData);
    table.setCreatingRow(null); //exit creating mode
    setAttendanceDuration('')
    setTeamId('')
  };

  //UPDATE action
  const handleSubmit = async (row) => {
    setTodayId(row?.id)
    if (window.confirm('Are you sure you want to submit?')) {
      await submitAttendance();
    }

    
    

    
    
  };

  const table = useMaterialReactTable({
    columns,
    data: fetchedTimeSheet || [],
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
    // onEditingRowSave: handleSaveUser,
    renderCreateRowDialogContent: ({ table, row, internalEditComponents }) => (
        <>
        <DialogTitle variant="h5">Create New Time Sheet</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <TextField
            style={{ marginTop: '10px' }}
            id="outlined-controlled"
            label="Attendance Duration"
            value={attendanceDuration}
            onChange={(event) => {
                setAttendanceDuration(event.target.value);
            }}
          />

          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Team</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={teamId}
              label="Team"
              onChange={(event) => {
                setTeamId(event.target.value);
              }}
            >
              
              
              {fetchedTeam?.map((team,index)=>(
                <MenuItem key={index} value={team?.id}>{isPending?"Loading..":team?.name}</MenuItem>
              ))}
              
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <MRT_EditActionButtons variant="text" table={table} row={row} />
        </DialogActions>
      </>
    ),

    //optionally customize modal content
    renderEditRowDialogContent: ({ table, row, internalEditComponents }) => (
        <>
        <DialogTitle variant="h5">Create New Time Sheet</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <TextField
            style={{ marginTop: '10px' }}
            id="outlined-controlled"
            label="Attendance Duration"
            value={attendanceDuration}
            onChange={(event) => {
                setAttendanceDuration(event.target.value);
            }}
          />

        
        </DialogContent>
        <DialogActions>
          <MRT_EditActionButtons variant="text" table={table} row={row} />
        </DialogActions>
      </>
    ),

    renderRowActions: ({ row, table }) => (
      <Box sx={{ display: 'flex', gap: '1rem' }}>
        <Tooltip title="Submit">
          <IconButton onClick={() =>  handleSubmit(row)}>
           <Button
          variant="contained"
          style={{
          
            backgroundColor: 'green',
            color: 'white',
          }}
        >
          Submit
        </Button>
          </IconButton>
        </Tooltip>
      </Box>
    ),

    renderTopToolbarCustomActions: ({ table }) => (
        <>
        </>
    //   <Button
    //       variant="contained"
    //       style={{
    //         width: '10%',
    //         margin: '5px',
    //         padding: '10px',
    //         backgroundColor: 'green',
    //         color: 'white',
    //       }}
    //       onClick={() => {
    //         table.setCreatingRow(true);
    //       }}
    //     >
    //       Create TimeSheet
    //     </Button>
    ),
    initialState: {
      pagination: { pageSize: 5, pageIndex: 0 },
      showGlobalFilter: true,
    },
    muiPaginationProps: {
      rowsPerPageOptions: [5, 10, 15],
      variant: 'outlined',
    },
    paginationDisplayMode: 'pages',

    state: {
      isLoading: isLoadingUsers,
      isSaving: isCreatingUser || isSubmitingAttendance || isDeletingUser,
      showAlertBanner: isLoadingUsersError,
      showProgressBars: isFetchingUsers,
    },
  });

  return (
    <>
      <Typography variant="h4" sx={{ mb: 5 }}>
        Time Sheet
      </Typography>
      {userRole === 'ADMIN'?
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
      Create Time Sheet 
    </Button>:""}
    {userRole === 'USER'? <>
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
      {/* <MaterialReactTable table={table} /> */}

      <Stack sx={{ m: '2rem 0' }}>
      <Typography variant="h4">List Of Time Sheet</Typography>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {/**
         * Use MRT components along side your own markup.
         * They just need the `table` instance passed as a prop to work!
         */}
        <MRT_GlobalFilterTextField table={table} />
        <MRT_TablePagination table={table} />
      </Box>
      {/* Using Vanilla Material-UI Table components here */}
      <TableContainer>
        <Table>
          {/* Use your own markup, customize however you want using the power of TanStack Table */}
          <TableHead>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableCell align="center" variant="head" key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.Header ??
                            header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} selected={row.getIsSelected()}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell align="center" variant="body" key={cell.id}>
                    {/* Use MRT's cell renderer that provides better logic than flexRender */}
                    <MRT_TableBodyCellValue cell={cell} table={table} />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <MRT_ToolbarAlertBanner stackAlertBanner table={table} />
    </Stack>
    </>:""}
    <AddTimeSheetMOdal open={open} handleClose={handleClose} />
        
    </>
  );
}

export default TimesheetPage;
