import { Helmet } from 'react-helmet-async';

import { ApproveTimesheetView} from 'src/sections/ApproveTimeSheet/view';

// ----------------------------------------------------------------------

export default function ApproveTimeSheetPage() {
  return (
    <>
      <Helmet>
        <title> Approve Time Sheet </title>
      </Helmet>

      <ApproveTimesheetView />
    </>
  );
}
