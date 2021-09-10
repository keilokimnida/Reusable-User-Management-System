import { Container, Button } from 'react-bootstrap';
import { Formik, Form, Field } from 'formik';

import axios from 'axios';
import CONFIG from '../config/config';

const Login = () => {
  const initialValues = {
    username: "",
    password: ""
  };

  const handleSubmit = (values) => {
    console.log(values);
    console.log(CONFIG.baseUrl);
  }

  return (
    <Container className="my-4" style={{ maxWidth: 480 }}>
      <h2 className="text-center">Login</h2>
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        {/* 
          I cannot use the React-Bootstrap components here
          because I have to use Formik
          I could have if I used the useFormik hook but that was not working
          Thus, some ugly code below
        */}
        <Form>
          <div className="mb-4">
            <label htmlFor="username" className="form-label">Username</label>
            <Field
              id="username"
              name="username"
              className="form-control"
              type="text"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="form-label">Password</label>
            <Field
              id="password"
              name="password"
              className="form-control"
              type="password"
            />
            <div className="form-text">Forgot your password?</div>
          </div>

          <div className="d-grid gap-2">
            <Button type="submit">Login</Button>
          </div>
        </Form>
      </Formik>
    </Container>
  );
}

export default Login;
