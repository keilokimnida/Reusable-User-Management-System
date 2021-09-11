import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import { toast } from 'react-toastify';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';

import axios from 'axios';
import CONFIG from '../config/config';
import { login } from '../utils/localStorage';

const Login = () => {
  const [loading, setLoading] = useState(false);

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
    const promise = axios.post(`${CONFIG.baseUrl}/admin/login`, values);
    toast.promise(promise, {
      pending: {
        render: () => "Logging you in..."
      },
      success: {
        render: ({ data: res }) => {
          setLoading(false);
          login(res.data);
          return "Logged in successfully";
        }
      },
      error: {
        render: ({ data: { response: res } }) => {
          setLoading(false);
          if (res.data.message) return res.data.message;
          if (!res.data.found) return "Account was not found";
          if (res.data.locked) return "Account has been locked";
          return "Wrong password";
        }
      }
    });
  }

  return (
    <Container className="my-4" style={{ maxWidth: 480 }}>
      <h2 className="text-center">Login</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {/* 
          I cannot use the React-Bootstrap components here
          because I have to use Formik
          I could have if I used the useFormik hook but that was not working
          Thus, some ugly code below
        */}
        {({ errors, touched }) => (
          <Form>
            <div className="mb-4">
              <label htmlFor="username" className="form-label">Username</label>
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

            <div className="mb-4">
              <label htmlFor="password" className="form-label">Password</label>
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

            <div className="d-grid gap-2">
              <Button type="submit" disabled={loading}>Login</Button>
            </div>
          </Form>
        )}
      </Formik>
    </Container>
  );
}

export default Login;
