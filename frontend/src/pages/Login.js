import { useState } from 'react';

import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Title from '../layout/Title';

import { toast } from 'react-toastify';
import TOAST_CONFIG from '../config/toastConfig';

import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

import { Link, useHistory } from 'react-router-dom';

import axios from 'axios';
import APP_CONFIG from '../config/appConfig';
import { login } from '../utils/localStorage';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const initialValues = {
    username: "",
    password: "12345678!"
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string().required(),
    password: Yup.string().required()
  });

  const handleSubmit = (values) => {
    setLoading(true);
    const promise = axios.post(`${APP_CONFIG.baseUrl}/auth/admin/login`, values);
    toast.promise(promise, {
      pending: {
        render: () => "Logging you in..."
      },
      success: {
        render: ({ data: res }) => {
          setLoading(false);
          login(res.data);
          history.push("/");
          return "Logged in successfully";
        },
        autoClose: TOAST_CONFIG.duration.quick
      },
      error: {
        render: ({ data: error }) => {
          setLoading(false);
          console.error("LOGIN FAIL", { ...error });
          let { response: res } = error;
          if (res) {
            if (res.data.message) return res.data.message;
            if (!res.data.found) return "Account was not found";
            if (res.data.locked) return "Account has been locked";
            return "Wrong password";
          }
          return error.message;
        }
      }
    });
  }

  return (
    <div className="c-Login">
      <Title title="Login" />
      <h2 className="text-center">Login</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched }) => (
          <Form>
            <div className="c-Card__Username">
              <label htmlFor="username">Username</label>
              <Field
                id="username"
                name="username"
                className="form-control"
                type="text"
              />
              {errors.username && touched.username
                ? <div className="form-text">Please provide a username</div>
                : null
              }
            </div>

            <div className="c-Card__Password">
              <label htmlFor="password">Password</label>
              <Field
                id="password"
                name="password"
                className="form-control"
                type="password"
              />
              {errors.password && touched.password
                ? <div className="form-text">Please provide a password</div>
                : null
              }
              <Link to="/forgot-password" className="form-text">Forgot your password?</Link>
            </div>

            <Button className="c-Btn c-Btn--login" type="submit" disabled={loading}>{loading ? "Loading..." : "Login"}</Button>

            <div className="c-Card__Create-account">
              Need an account?<Link to="/create-account"> Sign Up</Link>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default Login;
