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
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';

import {
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';

import { useGet } from '../../service/useGet';
// import { validateUser } from "../utils/validation";
import { useUpdate } from '../../service/useUpdate';

function TimesheetPage() {
  const [teamSelected, setTeamSelected] = useState(0);
  // const [tobeapprovedId, setToBeApproveId] = React.useState(null);
  const [rowSelection, setRowSelection] = useState({});
  const [rowSelectionId, setRowSelectionId] = useState([]);

  const { data } = useGet('/api/v1/users/me');

  const columns = useMemo(
    () => [
      {
        accessorKey: 'userId',
        header: 'User Id',
        enableEditing: false,
        size: 80,
      },
      {
        accessorKey: 'fullName',
        header: 'Full Name',
      },
      {
        accessorKey: 'role',
        header: 'role',
      },
      {
        accessorKey: 'approved',
        header: 'approved',
        Cell: ({ cell }) => (cell === true ? 'TRUE' : 'FALSE'),
      },
      {
        accessorKey: 'lastLoggedIn',
        header: 'Last LoggedIn',
        enableEditing: false,
        Cell: ({ cell }) => cell?.getValue()?.split('T')[0],
      },
      {
        accessorKey: 'createdAt',
        header: 'Created At',
        enableEditing: false,
        Cell: ({ cell }) => cell?.getValue()?.split('T')[0],
      },
      {
        accessorKey: 'updatedAt',
        header: 'Updated At',
        enableEditing: false,
        Cell: ({ cell }) => cell?.getValue()?.split('T')[0],
      },
    ],
    []
  );

  //call CREATE hook

  //call READ hook
  const { data: fetchedTimeSheet, isError: isLoadingUsersError } = useGet(
    `/api/v1/attendance-records/unapproved/team/${teamSelected}`
  );
  // api/v1/attendance-records/unapproved/team/5
  // eslint-disable-next-line spaced-comment
  //call read hook of role api

  const { data: fetchedTeams } = useGet(`/api/v1/teams?managerId=${data?.userId}`);

  // eslint-disable-next-line spaced-comment
  //call UPDATE hook
  const { mutateAsync: submitAttendance, isPending } = useUpdate(
    `/api/v1/attendance-records/approve/team/${teamSelected}`
  );
  //call DELETE hook

  //CREATE action

  //UPDATE action
  const handleSubmit = async (row) => {
    console.log('rrrr', rowSelectionId);
    // setToBeApproveId(row?.id)
    if (window.confirm('Are you sure you want to submit?')) {
      await submitAttendance(rowSelectionId);
    }

    setRowSelection({});
    setTeamSelected(null);
  };

  useEffect(() => {
    const IdOfSelected = Object.keys(rowSelection).map(Number);
    setRowSelectionId(IdOfSelected);
  }, [teamSelected, rowSelection]);

  const table = useMaterialReactTable({
    columns,
    data: fetchedTimeSheet || [],
    onCreatingRowSave: handleSubmit,
    createDisplayMode: 'modal',
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    state: { rowSelection },
    positionActionsColumn: 'last',
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
        onClick={handleSubmit}
      >
        {isPending ? 'Submit..' : 'Submit'}
      </Button>
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
  });

  return (
    <>
      <Typography variant="h4" sx={{ mb: 5 }}>
        To Be Approved Time Sheet
      </Typography>
      <Container style={{ display: 'flex', justifyContent: 'space-between' }}>
        <FormControl sx={{ m: 1, minWidth: 500 }}>
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
      </Container>
      <MaterialReactTable table={table} />
    </>
  );
}

export default TimesheetPage;
