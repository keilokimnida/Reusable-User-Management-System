import Chip from '@mui/material/Chip';
import axios from 'axios';
import dayjs from 'dayjs';
import { Formik, Form, Field } from 'formik';
import { useState, useEffect } from 'react';
import Alert from 'react-bootstrap/Alert';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import BootstrapTable from 'react-bootstrap-table-next';
import { confirmAlert } from 'react-confirm-alert';
import { useHistory } from 'react-router';
import { NavLink } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ReactSVG } from 'react-svg';
import jwtDecode from 'jwt-decode';
import * as Yup from 'yup';

import amexSVG from "../assets/svg/Amex.svg";
import MCSVG from "../assets/svg/MC.svg";
import visaSVG from "../assets/svg/Visa_2021.svg";
import CustomConfirmAlert from '../components/CustomConfirmAlert';
import SetupPaymentMethod from '../components/SetupPaymentMethod';
import SelectPaymentMethod from '../components/SelectPaymentMethod';
import Loading from '../components/Loading';
import Error from '../components/Error';
import APP_CONFIG from '../config/appConfig';
import { billingHistoryColumn, paymentMethodsColumn } from '../config/tableColumns';
import PageLayout from '../layout/PageLayout';
import useWatchLoginStatus from '../hooks/useWatchLoginStatus';
import TokenManager from '../utils/tokenManager';

const ManageUser = () => {
  // Used for watching whether user is logged in
  useWatchLoginStatus();
  // States used for fetching user details
  const [account, setAccount] = useState(null);
  const [firstLoading, setFirstLoading] = useState(true);  // when the page first loads and fetches user details
  const [pageError, setPageError] = useState(null);
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  // States used for Stripe
  const [changePaymentMethodBtnDisabled, setChangePaymentMethodBtnDisabled] = useState(false);
  const [billingHistory, setBillingHistory] = useState([]);
  const [subscriptionInfo, setSubscriptionInfo] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [showSetupPaymentMethod, setShowSetupPaymentMethod] = useState(false);
  const [showChangeCard, setShowChangeCard] = useState(false);
  const [rerender, setRerender] = useState(false);
  const [failedPaymentExist, setFailedPaymentExist] = useState(false);

  const decodedToken = TokenManager.getDecodedToken();
  const accountUUID = decodedToken.account_uuid;

  const getAccount = async () => {
    try {
      const res = await axios.get(`${APP_CONFIG.baseUrl}/users/account/${accountUUID}`);
      console.log(res);
      const accountData = res.data.results;
      setAccount(() => ({
        email: accountData.email,
        username: accountData.username,
        firstname: accountData.firstname,
        lastname: accountData.lastname,
        displayBalance: "S$" + Math.abs(parseFloat(accountData.balance)).toFixed(2),
        realBalance: parseFloat(accountData.balance).toFixed(2)
      }));

      setPaymentMethods(() => accountData.payment_accounts.map((paymentAccount, index) => {
        console.log(paymentAccount);
        return {
          serialNo: index + 1,
          cardType: paymentAccount.stripe_card_type,
          last4: paymentAccount.stripe_card_last_four_digit,
          expDate: paymentAccount.stripe_card_exp_date,
          stripePaymentMethodID: paymentAccount.stripe_payment_method_id,
          createdAt: dayjs(new Date(paymentAccount.created_at)).format("MMMM D, YYYY h:mm A"),
          action_delete: paymentAccount.stripe_payment_method_id,
        }
      }));

    }
    catch (error) {
      // const reauth = error.response?.status === 401;

      setPageError(() => error);
      console.error("ERROR", { ...error });
    }
  };
  console.log(paymentMethods);

  useEffect(() => {
    let componentMounted = true;

    (async () => {
      try {
        if (componentMounted) {
          setFirstLoading(() => true);
          await getAccount();
          setFirstLoading(() => false);
        }
      } catch (error) {
        console.log(error);
      }
    })();

    return (() => {
      componentMounted = false;
    });

    // eslint-disable-next-line
  }, [rerender]);

  const renderCardLogo = (cardType) => {
    if (cardType === "visa") {
      return <ReactSVG
        src={visaSVG}
        className="c-Payment-history__SVG c-SVG__Visa"
      />
    } else if (cardType === "mastercard") {
      return <ReactSVG
        src={MCSVG}
        className="c-Payment-history__SVG c-SVG__Master"
      />
    } else if (cardType === "amex") {
      return <ReactSVG
        src={amexSVG}
        className="c-Payment-history__SVG c-SVG__Amex"
      />
    } else {
      return cardType;
    }
  };

  const handleSubmit = (values) => {
    setLoading(true);
    console.log(values);
    toast.info("Clicked on submit");
    setLoading(false);
  };

  const handleShowPaymentMethod = () => {
    setShowSetupPaymentMethod((prevState) => !prevState);
  };

  // When user select payment method to change default payment method
  const handleSelectPaymentMethod = (stripePaymentMethodID) => {
    if (stripePaymentMethodID === selectedPaymentMethod) {
      setSelectedPaymentMethod(() => null);
    } else {
      setSelectedPaymentMethod(() => stripePaymentMethodID);
    }
  };

  const handleRemoveCard = (paymentMethodID) => {
    // Show confirmation modal
    confirmAlert({
      customUI: ({ onClose }) => {
        return <CustomConfirmAlert
          message="Are you sure you want to remove this card?"
          onClose={onClose}
          handler={(onClose) => executeRemoveCard(onClose)}
          heading="Confirm Remove Card?"
        />
      }
    });

    const executeRemoveCard = async (onClose) => {
      console.log(paymentMethodID);
      try {
        await axios.delete(`${APP_CONFIG.baseUrl}/stripe/payment_methods/${paymentMethodID}`);
        toast.success("Card has been successfully detached!");
        setRerender((prevState) => !prevState)
      } catch (error) {
        toast.error("Something went wrong!");
        console.log(error);
      }
      onClose();
    }
  };

  const handleCancelSubscription = () => {
    let message = "Click confirm to proceed.";
    if (subscriptionInfo?.trialEnd) {
      // if subscription is in free trial
      message = "Free trial will be counted as used."
    }
    // Show confirmation modal
    confirmAlert({
      customUI: ({ onClose }) => {
        return <CustomConfirmAlert
          message={message}
          onClose={onClose}
          handler={(onClose) => performCancelSubscription(onClose)}
          heading="Confirm Cancel Subscription?"
        />
      }
    });

    // Call endpoint to cancel subscription
    const performCancelSubscription = async (onClose) => {
      try {
        await axios.delete(`${APP_CONFIG.baseUrl}/stripe/subscriptions`);
        onClose();
        toast.success("Successfully cancelled subscription!");
        setRerender((prevState) => !prevState);
      } catch (error) {
        console.log(error);
        let errCode = "Error!";
        let errMsg = "Error!";
        if (error.response !== undefined) {
          errCode = error.response.status;
          errMsg = error.response.data.message;
        }
        toast.error(
          <>
            Error Code: <b>{errCode}</b>
            <br />
            Message: <b>{errMsg}</b>
          </>
        );
        onClose();
      }
    };
  };

  // Change subscription payment method
  const handleChangeSubscriptionPaymentMethod = async () => {
    if (selectedPaymentMethod) {
      // Prevent changing to same card
      if (subscriptionInfo?.defaultPaymentMethodID === selectedPaymentMethod) {
        toast.error("Error! No changing to same card!");
      } else {
        try {
          await axios.put(`${APP_CONFIG.baseUrl}/stripe/subscriptions`, {
            stripePaymentMethodID: selectedPaymentMethod
          });
          toast.success("Payment method changed successfully");
          setSelectedPaymentMethod(() => null);
          setShowChangeCard((prevState) => !prevState);
          setRerender((prevState) => !prevState); // tell application to rerender and run useEffect
        } catch (error) {
          console.log(error);
          toast.error("Error! Try again later!");
        }
      }
    } else {
      toast.error("Error! No payment method selected!");
    }
  };

  const handleShowChangeCard = () => {
    setSelectedPaymentMethod(() => null);
    setShowChangeCard((prevState) => !prevState);
  };

  return (
    <>
      <SetupPaymentMethod show={showSetupPaymentMethod} handleClose={handleShowPaymentMethod} setRerender={setRerender} />
      <PageLayout title="Manage Account" TokenManager={TokenManager}>
        {firstLoading
          ? <Loading />
          : pageError
            ? <Error />
            :
            <div className="c-Account">
              {/* Account information */}
              <div className="c-Account__Info c-Account__Section">
                <div className="c-Account__Heading">
                  <div className="c-Heading__Text">
                    <h1>Hey, {account?.firstname}</h1>
                    <p>Your account settings</p>
                  </div>
                </div>

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
                    <Form className="c-Account__Form c-Form">
                      <h2 className="c-Form__Heading">General</h2>
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
                        <button className="c-Btn c-Btn--stripe-purple" type="submit" disabled={loading}>Save</button>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>

              {/* Payment methods */}
              <div className="c-Account__Payment-method c-Account__Section">
                <div className="c-Account__Heading">
                  <div className="c-Heading__Text">
                    <h1>Payment Methods</h1>
                  </div>
                  <div className="c-Heading__Btn">
                    <button type="button" className="c-Btn" onClick={handleShowPaymentMethod}>Add</button>
                  </div>
                </div>
                <hr />
                {
                  paymentMethods.length === 0 ?
                    <p>No Payment Methods Found!</p>
                    :
                    <>
                      {/* Payment method table */}

                      <div className="c-Account__Payment-method-table">
                        <BootstrapTable
                          bordered={false}
                          keyField="serialNo"
                          data={paymentMethods}
                          columns={paymentMethodsColumn(handleRemoveCard)}
                        />
                      </div>
                    </>
                }
              </div>

              {/* Subscription information */}
              <div className="c-Account__Subscription c-Subscription c-Account__Section">
                <div className="c-Account__Heading">
                  <div className="c-Heading__Text">
                    <h1>Subscription</h1>
                  </div>
                </div>
                <hr />
                {
                  subscriptionInfo ?
                    <>
                      <div className="l-Subscription__Info">
                        {
                          subscriptionInfo?.trialEnd ?
                            null :
                            <h2>Current Billing Cycle: {subscriptionInfo?.billingCycle}</h2>
                        }
                        {
                          subscriptionInfo?.status === "canceling" ?
                            <p>Subscription will be canceled at the end of the billing cycle.</p> :
                            null
                        }
                        {

                        }

                        {/* Account balance */}
                        <div className="c-Subscription__Balance">
                          <p>Credits are given when downgrading plans. If you have credit/debit in your account, it will be applied in your next invoice.</p>
                        </div>

                        <div className="c-Subscription__Info c-Info">
                          {/* Current plan */}
                          <div className="c-Info__Card">
                            <h2>Current Plan</h2>
                            <h3>{subscriptionInfo?.plan}</h3>
                            <p>S${subscriptionInfo?.price} per month</p>
                            {
                              subscriptionInfo?.trialEnd ?
                                <>
                                  <Chip className="c-Info__Card-chip" label="Trialing" color="primary" />
                                  <p>Trial ends on {subscriptionInfo?.trialEnd}</p>
                                </>
                                :
                                <Chip className="c-Info__Card-chip" label="Active" color="success" />
                            }
                          </div>
                          {/* Account balance */}
                          <div className="c-Info__Card">
                            <h2>Account Balance</h2>
                            <h3>{account?.displayBalance}</h3>
                            <p>{account?.realBalance <= 0 ? "Credit" : "Debit"}</p>
                          </div>

                          <div className="c-Info__Btns">
                            {
                              subscriptionInfo.status === 'canceling' ?
                                null :
                                <>
                                  <button type="button" onClick={handleCancelSubscription} className="c-Btn c-Btn--stripe-purple-border">Cancel Subscription</button>
                                  <NavLink to="/plans/change" className="c-Btn c-Btn--stripe-purple">Change Plan</NavLink>
                                </>
                            }
                          </div>
                        </div>
                      </div>
                      {
                        subscriptionInfo.status === 'canceling' ?
                          null :
                          <div className="l-Subscription__Payment-method">
                            <div className="c-Subscription__Payment-method c-Payment-method">
                              <h2>Payment Method</h2>
                              <p>Card will be charged automatically every month!</p>
                              <hr />
                              <div className="c-Payment-method__Top">
                                {
                                  subscriptionInfo?.defaultPaymentMethodID ?
                                    <>
                                      <div className="c-Payment-method__Left">
                                        <div className="c-Left__Info">
                                          {renderCardLogo(subscriptionInfo?.cardType)}
                                          <p>●●●● {subscriptionInfo?.last4}</p>
                                        </div>
                                      </div>
                                      <div className="c-Payment-method__Right">
                                        {
                                          paymentMethods.length > 0 ?
                                            showChangeCard ?
                                              null :
                                              <button type="button" className="c-Btn c-Btn--stripe-purple-border" onClick={handleShowChangeCard}>Change Card</button> :
                                            null
                                        }
                                      </div>
                                    </>
                                    :
                                    <>
                                      <div className="c-Payment-method__Left">
                                        <p>No payment method.</p>
                                      </div>
                                      <div className="c-Payment-method__Right">
                                        <button type="button" className="c-Btn c-Btn--stripe-purple-border" onClick={handleShowChangeCard}>Add Card</button>
                                      </div>
                                    </>
                                }

                              </div>
                              {showChangeCard ?
                                <>
                                  <hr />
                                  <div className="c-Payment-method__Change c-Change">
                                    <h1>{subscriptionInfo?.defaultPaymentMethodID ? "Change" : "Add"} Payment Method</h1>
                                    {paymentMethods.length > 0 ?
                                      paymentMethods.map((paymentMethod, index) => (
                                        <div className="c-Change__Payment-methods" key={index}>
                                          <SelectPaymentMethod
                                            index={index}
                                            cardBrand={paymentMethod.cardType}
                                            last4={paymentMethod.last4}
                                            expDate={paymentMethod.expDate}
                                            stripePaymentMethodID={paymentMethod.stripepPaymentMethodID}
                                            selectedPaymentMethod={selectedPaymentMethod}
                                            handleSelectPaymentMethod={handleSelectPaymentMethod} />
                                        </div>
                                      ))
                                      :
                                      <p>No payment methods found.</p>}
                                    <div className="c-Change__Btns">
                                      <button type="button" disabled={changePaymentMethodBtnDisabled} className="c-Btn c-Btn--stripe-purple" onClick={handleChangeSubscriptionPaymentMethod}>Save</button>
                                      <button type="button" className="c-Btn c-Btn--empty" onClick={handleShowChangeCard}>Cancel</button>
                                    </div>
                                  </div>
                                </>
                                :
                                null}
                            </div>
                          </div>
                      }

                    </>
                    :
                    <div className="l-Subscription__No-subscription c-No-subscription">
                      <p>No Subscription Plan.</p>
                    </div>
                }

                <div className="c-Subscription__Billing-history c-Billing-history">
                  <h2>Billing History</h2>
                  <hr />
                  {
                    failedPaymentExist ?
                      <>
                        <Alert variant="warning" className="c-Billing-history__Warning">
                          <Alert.Heading><b>Important!</b></Alert.Heading>
                          You have a payment error, please try payment manually again or change payment method. Your subscription will be canceled on if you do not pay the bill by __.
                        </Alert>
                      </> :
                      null
                  }
                  {
                    billingHistory.length === 0 ?
                      <p>No Billing History Found!</p>
                      :
                      <>
                        {/* Billing history table */}
                        <div className="c-Billing-history__Table">
                          <BootstrapTable
                            bordered={false}
                            keyField="invoiceReferenceNumber"
                            data={billingHistory}
                            columns={billingHistoryColumn}
                          />
                        </div>
                      </>
                  }
                </div>

              </div>

            </div>
        }
      </PageLayout >
    </>
  );
}

export default ManageUser;
