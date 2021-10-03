import { useState, useEffect } from 'react';
import { useHistory } from 'react-router';

import PageLayout from '../../layout/PageLayout';
import Loading from '../../components/Loading';
import Error from '../../components/Error';
import Button from 'react-bootstrap/Button';
import BootstrapTable from 'react-bootstrap-table-next';
import styles from './Index.module.css';

import { getAll, logout } from '../../utils/localStorage';
import axios from 'axios';
import APP_CONFIG from '../../config/appConfig';
import { toast } from 'react-toastify';

const Users = () => {
  const history = useHistory();
  const [users, setUsers] = useState([]);
  const [firstLoading, setFirstLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const {
      token,
      decoded: { company_id }
    } = getAll();

    axios.get(`${APP_CONFIG.baseUrl}/company/${company_id}/employees`, {
      params: {
        "roles": "true",
        "address": "true"
      },
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then((res) => {
        setUsers(res.data.results);
      })
      .catch((err) => {
        const reauth = err.response?.status === 401;
        if (reauth) {
          logout();
          alert("Reauthentication is required");
          return history.push("/login");
        }
        setError(err);
        console.error("ERROR", { ...err });
      })
      .finally(() => {
        setFirstLoading(false);
      });
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
    dataField: "account.status",
    text: "Status"
  }];

  const expandRow = {
    renderer: (row) => (
      <div className={styles.expandContainer}>
        <div>
          <h6>Job Title</h6>
          {row.title}
        </div>
        <div>
          <h6>Username</h6>
          {row.account.username}
        </div>
        <div>
          <h6>Created</h6>
          {/* not proper implementation with time zoning */}
          {new Date(row.created_at).toDateString()}
        </div>
      </div>
    )
  }

  return (
    <PageLayout>
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
              expandRow={expandRow}
            />
          </>
      }
    </PageLayout>
  );
}

export default Users;
