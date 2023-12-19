
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import { useGet } from 'src/service/useGet';

import AppWidgetSummary from '../app-widget-summary';

// ----------------------------------------------------------------------

export default function AppView() {
 
  const { data: user, isFetching: isFetchingUsers } = useGet('/api/v1/users');
  const { data: teams, isFetching: isFetchingTeams } = useGet('/api/v1/teams');
  const { data: manager, isFetching: isFetchingManager } = useGet('/api/v1/users?role=MANAGER');

  const TotalUser = user?.length;
  const TotalPosition = teams?.length;
  const TotalManager = manager?.length;



  return (
    <Container maxWidth="xl">
      <Typography variant="h4" sx={{ mb: 5 }}>
        Hi, Welcome back to Attendance DashBoard
      </Typography>

      <Grid container spacing={3}>
        <Grid xs={12} sm={6} md={12}>
          <AppWidgetSummary
            title="Total Team"
            total={isFetchingTeams ? 'loading...' : TotalPosition}
            color="success"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_message.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={12}>
          <AppWidgetSummary
            title="Total Users"
            total={isFetchingUsers ? 'Loading...' : TotalUser}
            color="info"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_users.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={12}>
          <AppWidgetSummary
            title="Total Candidates"
            total={isFetchingManager ? '' : TotalManager}
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_users.png" />}
          />
        </Grid>

        
      </Grid>
    </Container>
  );
}
