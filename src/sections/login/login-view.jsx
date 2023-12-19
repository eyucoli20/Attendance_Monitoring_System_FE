// eslint-disable-next-line import/no-extraneous-dependencies
// import jwt from "jsonwebtoken";
// eslint-disable-next-line import/no-duplicates
import { useState } from 'react';
// eslint-disable-next-line import/no-duplicates
import { useEffect } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';
import { QueryClient, useMutation } from '@tanstack/react-query';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import { alpha, useTheme } from '@mui/material/styles';
import InputAdornment from '@mui/material/InputAdornment';

import { useRouter } from 'src/routes/hooks';

import { bgGradient } from 'src/theme/css';
import { useAuth } from 'src/context/AuthContext';

import Iconify from 'src/components/iconify';

import api from '../../service/api';

// ----------------------------------------------------------------------

export default function LoginView() {
  const theme = useTheme();
  const { login, user } = useAuth();
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [username, setUserName] = useState(null);
  const [password, setPassword] = useState(null);

  const { mutate: loginMutation, isPending } = useMutation({
    // eslint-disable-next-line consistent-return
    mutationFn: async (credentials) => {
      try {
        const config = {
          headers: {
            'Content-Type': 'application/json',
          },
        };
        const response = await api.post('login', credentials, config);

        if (response.status === 200) {
          const decodedToken = jwtDecode(response?.data?.access_token);

          const decodedUser = {
            username: decodedToken?.sub,
            role: decodedToken?.role[0],
          };
          localStorage.setItem('role', decodedToken?.role);
          localStorage.setItem('user', decodedToken?.sub);
          localStorage.setItem('access_token', response?.data?.access_token);

          await login({ user: JSON.stringify(decodedUser) });

          toast.success('Success Login !', {
            position: toast.POSITION.TOP_RIGHT,
          });
          return response.data;
        }
      } catch (error) {
        if (error.response) {
          toast.error(`${error.message}`, {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
        return '';
      }
    },
    onSuccess: () => {
      QueryClient.invalidateQueries('users');
    },
  });

  const Role = localStorage.getItem('role');

  useEffect(() => {
    if (user && Role === 'ADMIN') {
      router.push('/dashboard');
    } else if (user && Role === 'USER') {
      router.push('/dashboard/timesheet');
    }else if (user && Role === 'MANAGER') {
      router.push('/dashboard/approve-timesheet');
    }
  }, [Role, router, user]);

  const handleSubmit = (event) => {
    event.preventDefault();

    loginMutation({
      username,
      password,
    });
  };

  const renderForm = (
    <>
      <Stack spacing={4}>
        <TextField name="username" onChange={(e) => setUserName(e.target.value)} label="User Name / Email" />
        <TextField
          name="password"
          label="Password"
          onChange={(e) => setPassword(e.target.value)}
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>
      <Stack direction="row" alignItems="center" justifyContent="flex-end" sx={{ my: 3 }}>
        <Link variant="subtitle2" underline="hover">
          Forgot password?
        </Link>
      </Stack>

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        color="inherit"
        onClick={handleSubmit}
        loading={isPending}
      >
        Login
      </LoadingButton>
    </>
  );

  return (
    <Box
      sx={{
        ...bgGradient({
          color: alpha(theme.palette.background.default, 0.9),
          imgUrl: '/assets/background/overlay_4.jpg',
        }),
        height: 1,
      }}
    >
      <Stack alignItems="center" justifyContent="center" sx={{ height: 1 }}>
        <Card
          sx={{
            p: 5,
            width: 1,
            maxWidth: 420,
          }}
        >
          <Typography style={{ marginBottom: '30px' }} variant="h4">
            Sign in to Attendance System
          </Typography>
          {renderForm}
        </Card>
      </Stack>
    </Box>
  );
}
