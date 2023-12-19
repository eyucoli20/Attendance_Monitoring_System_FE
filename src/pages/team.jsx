import { Helmet } from 'react-helmet-async';

import { TeamView } from 'src/sections/Team/view'

// ----------------------------------------------------------------------

export default function TeamPage() {
  return (
    <>
      <Helmet>
        <title> Team </title>
      </Helmet>

      <TeamView />
    </>
  );
}
