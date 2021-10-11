import React, { useState } from 'react';
import { useHistory } from "react-router-dom";
import axios from 'axios';
import Title from '../../layout/Title';
import { toast, ToastContainer } from 'react-toastify';
import { BiArrowBack } from 'react-icons/bi';
import { Container, Row, Col } from 'react-bootstrap';
import { IconContext } from 'react-icons';
import toastConfig from '../../config/toastConfig';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import ReCAPTCHA from "react-google-recaptcha";
import Button from 'react-bootstrap/Button';
import APP_CONFIG from '../../config/appConfig';

const ForgotPassword = () => {
    const history = useHistory();
    const [loading, setLoading] = useState(false);
    const toastTiming = toastConfig.duration.quick;
    const [isRecaptchaValidated, setIsRecaptchaValidated] = useState(false);
    const [userTriedToSubmit, setUserTriedToSubmit] = useState(false);

    // Handler for form submission
    // Need change endpoint
    const handleFormSubmit = (values) => {
        setUserTriedToSubmit(true);
        // If captcha is not validated, don't allow 
        if (isRecaptchaValidated === false) return;

        setLoading(() => (true));
        axios.post(`${APP_CONFIG.baseUrl}/auth/forgot-password/request`, values, {})
            .then((res) => {
                console.log("Sent Verification Email successfully!");
                const data = res.data;
                console.log(data);
                setLoading(() => (false));
                toast.success(<>Success!<br />Message: <b>Verification Email has been sent!</b></>);
            })
            .catch((err) => {
                console.log(err.response);
                let errCode = "Error!";
                let errMsg = "Error!"
                if (err.response !== undefined) {
                    errCode = err.response.status;
                    errMsg = err.response.data.message;
                }
                toast.error(<>Error Code: <b>{errCode}</b><br />Message: <b>{errMsg}</b></>);
                setLoading(() => (false));
            })
    }

    // Handler for Recaptcha
    const recaptchaOnChange = (value) => {
        console.log("Captcha value:", value);
        setIsRecaptchaValidated(() => true);
    }

    const initialValues = {
        usernameOrEmail: "",
    };

    const validationSchema = Yup.object().shape({
        usernameOrEmail: Yup.string().required(),
    });

    return (
        <>
            <ToastContainer
                position="top-center"
                autoClose={toastTiming}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            <Title title="Forgot Password" />
            <div className="c-Forgot-password">
                <div className="l-Forgot-password__Card">
                    <div className="c-Forgot-password__Card">
                        {/* Title */}
                        <Container>
                            <Row>
                                <Col className="c-Card__Back-btn" xs={1}>
                                    <IconContext.Provider value={{ size: "21px" }}>
                                        <BiArrowBack onClick={() => history.goBack()}></BiArrowBack>
                                    </IconContext.Provider>
                                </Col>
                                <Col xs={11}><h4>Forgot Password</h4></Col>
                            </Row>
                            <Row>
                                <p className="c-Card__Instructions">Please enter your Username or E-mail and follow the instructions sent to your email in order to set a new password.</p>
                            </Row>
                        </Container>
                        <Formik
                            initialValues={initialValues}
                            validationSchema={validationSchema}
                            onSubmit={handleFormSubmit}
                        >
                            {({ errors, touched }) => (
                                <Form>
                                    <div className="c-Email">
                                        <label htmlFor="usernameOrEmail">Username / E-mail</label>
                                        <Field
                                            id="usernameOrEmail"
                                            name="usernameOrEmail"
                                            className="form-control"
                                            type="text"
                                        />
                                        {errors.usernameOrEmail && touched.usernameOrEmail
                                            ? <div className="form-text">Please provide a valid e-mail</div>
                                            : null
                                        }
                                    </div>

                                    <div className="c-Card__Recaptcha">
                                        <ReCAPTCHA
                                            // Using Test key for localhost for now
                                            sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
                                            // Real key below for when website is hosted online but will need to add website domain to recaptcha on google settings
                                            // sitekey="6LfUgcEcAAAAAFTCie0MuC_Lg7GtKpYDEbA3FIge"    
                                            onChange={recaptchaOnChange}
                                        />
                                        {
                                            !isRecaptchaValidated && userTriedToSubmit ? <div className="form-text">Invalid captcha</div>
                                                : null
                                        }
                                    </div>

                                    <Button className="c-Btn c-Btn--login" type="submit" disabled={loading}>{loading ? "Loading..." : "Get Verification Email"}</Button>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ForgotPassword;