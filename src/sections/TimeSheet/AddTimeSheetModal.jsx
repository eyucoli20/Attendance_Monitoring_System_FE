import * as React from 'react';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { Select, MenuItem, InputLabel, FormControl } from '@mui/material';

import { useGet } from 'src/service/useGet';
import { usePost } from 'src/service/usePost';

// eslint-disable-next-line react/prop-types
export default function AddTimeSheetMOdal({ open, handleClose }) {
  const [attendanceDuration, setAttendanceDuration] = React.useState(1);
  const [teamId, setTeamId] = React.useState('');

  const { mutateAsync: createUser, isPending: isCreatingUser } = usePost(
    '/api/v1/attendance-records'
  );

  const { data: fetchedTeam, isPending } = useGet('/api/v1/teams');

  const handleCreateManager = async () => {
    const transformedData = {
      attendanceDuration,
      teamId,
    };
    await createUser(transformedData);
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
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
            {fetchedTeam?.map((team, index) => (
              <MenuItem key={index} value={team?.id}>
                {isPending ? 'Loading..' : team?.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleCreateManager}>{isCreatingUser ? 'loading..' : 'Save'}</Button>
      </DialogActions>
    </Dialog>
  );
}
