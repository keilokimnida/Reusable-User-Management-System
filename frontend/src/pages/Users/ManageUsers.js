import { useState, useEffect } from 'react';
import { useHistory } from 'react-router';

import PageLayout from '../../layout/PageLayout';
import Loading from '../../components/Loading';
import Error from '../../components/Error';
import Button from 'react-bootstrap/Button';
import BootstrapTable from 'react-bootstrap-table-next';

import { getAll, logout } from '../../utils/localStorage';
import axios from 'axios';
import APP_CONFIG from '../../config/appConfig';
import { toast } from 'react-toastify';

const ManageUsers = () => {
  const history = useHistory();
  const [users, setUsers] = useState([]);
  const [firstLoading, setFirstLoading] = useState(true);
  const [error, setError] = useState(null);

  const { token } = getAll();

  const getUsers = async () => {
    try {
      const res = await axios.get(`${APP_CONFIG.baseUrl}/admin/accounts`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      setUsers(res.data.results);
    }
    catch (err) {
      const reauth = err.response?.status === 401;
      if (reauth) {
        logout();
        alert("Reauthentication is required");
        return history.push("/login");
      }
      setError(err);
      console.error("ERROR", { ...err });
    }
  }

  useEffect(() => {
    setFirstLoading(true);
    getUsers().then(() => setFirstLoading(false));
    // eslint-disable-next-line
  }, []);

  const columns = [{
    dataField: "firstname",
    text: "Firstname"
  }, {
    dataField: "lastname",
    text: "Lastname"
  }, {
    dataField: "email",
    text: "Email"
  }, {
    dataField: "status",
    text: "Status"
  }];

  return (
    <PageLayout title = "Manage Users">
      {firstLoading
        ? <Loading />
        : error
          ? <Error error={error} />
          : <>
            <h1>All Users</h1>
            <p>Users at a glance</p>
            <hr />
            <BootstrapTable
              keyField="employee_id"
              columns={columns}
              data={users}
            />
          </>
      }
    </PageLayout>
  );
}

export default ManageUsers;
