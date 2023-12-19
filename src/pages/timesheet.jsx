import { Helmet } from 'react-helmet-async';

import { TimesheetView} from 'src/sections/TimeSheet/view';

// ----------------------------------------------------------------------

export default function TimeSheetPage() {
  return (
    <>
      <Helmet>
        <title> Time Sheet </title>
      </Helmet>

      <TimesheetView />
    </>
  );
}
