import CustomerTable from "./CustomerTable/CustomerTable";
import { FetchDataCustomer } from "./CustomerTable/api/FetchDataCustomer";
import { columns } from "./CustomerTable/CustomerColumn";

function Tables() {
  return (
    <>
      <CustomerTable columns={columns} FetchDataCustomer={FetchDataCustomer} />
    </>
  );
}

export default Tables;
