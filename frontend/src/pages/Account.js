import { useState, useEffect } from 'react';
import { useHistory } from 'react-router';

import { getAll, logout } from '../utils/localStorage';

import axios from 'axios';
import APP_CONFIG from '../config/appConfig';

import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

import { toast } from 'react-toastify';
import PageLayout from '../layout/PageLayout';
import Loading from '../components/Loading';
import Error from '../components/Error';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { ArrowClockwise } from 'react-bootstrap-icons';

import jwtDecode from 'jwt-decode';

const ManageUser = () => {
  // states used for fetching user details
  const [account, setAccount] = useState(null);
  // when the page first loads and fetches user details
  const [firstLoading, setFirstLoading] = useState(true);
  const [error, setError] = useState(null);

  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const getAccount = async () => {
    const { token } = getAll();
    const { account_id } = jwtDecode(token);

    try {
      const res = await axios.get(`${APP_CONFIG.baseUrl}/users/account/${account_id}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      setAccount(res.data.results);
    }
    catch (error) {
      const reauth = error.response?.status === 401;
      if (reauth) {
        logout();
        alert("Reauthentication is required");
        return history.push("/login");
      }

      setError(error);
      console.error("ERROR", { ...error });
    }
  }

  useEffect(() => {
    setFirstLoading(true);
    getAccount().then(() => setFirstLoading(false));
    // eslint-disable-next-line
  }, []);

  const handleSubmit = (values) => {
    setLoading(true);
    console.log(values);
    toast.info("Clicked on submit");
    setLoading(false);
  }

  return (
    <PageLayout title = "Manage Account">
      {firstLoading
        ? <Loading />
        : error
          ? <Error error={error} />
          : <div className = "c-Account">
            {/* <div className={styles.header}>
              <div> */}
            <h1 className = "c-Account__Heading">Hey, {account?.lastname}</h1>
            <p className = "c-Account__Description">Your account settings</p>
            {/* </div>
              <Button variant="outline-success">
                <ArrowClockwise size="2rem" />
              </Button>
            </div> */}
            <hr />
            <Formik
              initialValues={{
                firstname: account?.firstname,
                lastname: account?.lastname,
                email: account?.email,
                // title: account?.title,
                // address_line_one: account?.address?.address_line_one,
                // address_line_two: account?.address?.address_line_two,
                // city: account?.address?.city,
                // state: account?.address?.state,
                // postal_code: account?.address?.postal_code,
                // country: account?.address?.country
              }}
              onSubmit={handleSubmit}
            >
              {(errors, touched) => (
                <Form className = "c-Account__Form c-Form">
                  <h2 className = "c-Form__Heading">General</h2>
                  <Row>
                    <Col className="c-Form__Col" xs={12} sm={6}>
                      <label htmlFor="firstname" className="form-label">Firstname</label>
                      <Field
                        id="firstname"
                        name="firstname"
                        className="form-control"
                        type="text"
                      />
                    </Col>

                    <Col className="c-Form__Col" xs={12} sm={6}>
                      <label htmlFor="lastname" className="form-label">Lastname</label>
                      <Field
                        id="lastname"
                        name="lastname"
                        className="form-control"
                        type="text"
                      />
                    </Col>
                  </Row>

                  <Row>
                    <Col className="c-Form__Col">
                      <label htmlFor="email" className="form-label">Email</label>
                      <Field
                        id="email"
                        name="email"
                        className="form-control"
                        type="email"
                      />
                    </Col>

                    {/* <Col className="mb-3" xs={12} md={6}>
                      <label htmlFor="title" className="form-label">Job Title</label>
                      <Field
                        id="title"
                        name="title"
                        className="form-control"
                        type="text"
                      />
                    </Col> */}
                  </Row>

                  {/* <hr />
                  <h5>Address</h5>
                  <div className="mb-3">
                    <label htmlFor="address_line_one" className="form-label">Line One</label>
                    <Field
                      id="address_line_one"
                      name="address_line_one"
                      className="form-control"
                      type="text"
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="address_line_two" className="form-label">Line Two</label>
                    <Field
                      id="address_line_two"
                      name="address_line_two"
                      className="form-control"
                      type="text"
                    />
                  </div>

                  <Row>
                    <Col className="mb-3" xs={12} md={6} lg={3}>
                      <label htmlFor="city" className="form-label">City</label>
                      <Field
                        id="city"
                        name="city"
                        className="form-control"
                        type="text"
                      />
                    </Col>

                    <Col className="mb-3" xs={12} md={6} lg={3}>
                      <label htmlFor="state" className="form-label">State</label>
                      <Field
                        id="state"
                        name="state"
                        className="form-control"
                        type="text"
                      />
                    </Col>

                    <Col className="mb-3" xs={12} md={6} lg={3}>
                      <label htmlFor="country" className="form-label">Country</label>
                      <Field
                        id="country"
                        name="country"
                        className="form-control"
                        type="text"
                      />
                    </Col>

                    <Col className="mb-3" xs={12} md={6} lg={3}>
                      <label htmlFor="postal_code" className="form-label">Postal Code</label>
                      <Field
                        id="postal_code"
                        name="postal_code"
                        className="form-control"
                        type="text"
                      />
                    </Col>
                  </Row> */}

                  <div className="c-Account__Btn">
                    <Button className = "c-Btn c-Btn--submit" type="submit" disabled={loading}>Save</Button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
      }
    </PageLayout >
  );
}

export default ManageUser;
