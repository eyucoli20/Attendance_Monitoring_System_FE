import * as React from 'react';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';

import { usePost } from 'src/service/usePost';

// eslint-disable-next-line react/prop-types
export default function AddManagerModal({ open, handleClose }) {
  const [fullName, setFullName] = React.useState('');
  const [username, setuserName] = React.useState('');
  const [password, setPassword] = React.useState('');

  const { mutateAsync: createUser, isPending: isCreatingUser } = usePost('/api/v1/users/manager');

  const handleCreateManager = async () => {
    const transformedData = {
      password,
      fullName,
      username,
    };

    console.log(transformedData);
    await createUser(transformedData);
    handleClose()
    setFullName('')
    setuserName('')
    setPassword('')
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Add manager</DialogTitle>
      <DialogContent>
        <DialogContentText>To Add manager</DialogContentText>
        <TextField
          fullWidth
          style={{ marginTop: '10px' }}
          id="outlined-controlled"
          label="Name"
          value={fullName}
          onChange={(event) => {
            setFullName(event.target.value);
          }}
        />
        <TextField
          fullWidth
          style={{ marginTop: '10px' }}
          id="outlined-controlled"
          label="username"
          value={username}
          onChange={(event) => {
            setuserName(event.target.value);
          }}
        />

        <TextField
          fullWidth
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
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleCreateManager}>{isCreatingUser ? 'loading..' : 'Save'}</Button>
      </DialogActions>
    </Dialog>
  );
}
