import { useState } from 'react';

import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';

import { toast } from 'react-toastify';
import TOAST_CONFIG from '../config/toast';

import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

import { Link } from 'react-router-dom';

import axios from 'axios';
import CONFIG from '../config/config';
import { login } from '../utils/localStorage';

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);

  return (
    <Container className="my-4" style={{ maxWidth: 480 }}>
      <h2 className="text-center">Change Password</h2>
    </Container>
  );
}

export default ForgotPassword;
