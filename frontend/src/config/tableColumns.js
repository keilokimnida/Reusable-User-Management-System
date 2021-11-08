import { ReactSVG } from 'react-svg';
import Chip from '@mui/material/Chip';

import MCSVG from "../assets/svg/MC.svg";
import visaSVG from "../assets/svg/Visa_2021.svg";
import amexSVG from "../assets/svg/Amex.svg";

export const billingHistoryColumn = (handleFailedPayment) => {
    return [
        {
            dataField: 'invoiceReferenceNumber',
            text: 'Reference Number',
            formatter: (cell) => {
                if (cell) {
                    return cell
                } else {
                    return "N.a."
                }
            }
        },
        {
            dataField: 'amount',
            text: 'Amount',
            formatter: (cell, row) => {
                if (cell) {
                    return <p>S${cell}</p>
                } else {
                    return "N.a.";
                }
            }
        },
        {
            dataField: 'accountBalance',
            text: 'Account Balance',
            formatter: (cell, row) => {
                if (cell) {
                    if (parseFloat(cell) <= 0) {
                        // Negative values are treated as a credit (a reduction in the amount owed by the customer) that you can apply to the next invoice.
                        // Positive values are treated as a debit (an increase in the amount owed by the customer to you) that you can apply to the next invoice.
                        return <p>S${Math.abs(parseFloat(cell)).toFixed(2)} Credit</p>
                    } else {
                        return <p>S${Math.abs(parseFloat(cell)).toFixed(2)} Debit</p>
                    }
                    
                } else {
                    return "N.a."
                }
            } 
        },
        {
            dataField: 'cardType',
            text: 'Card Type',
            formatter: (cell, row) => {
                if (!cell) {
                    return "N.a."
                }
    
                if (cell === "visa") {
                    return <ReactSVG
                        src={visaSVG}
                        className="c-Payment-history__SVG c-SVG__Visa"
                    />
                } else if (cell === "mastercard") {
                    return <ReactSVG
                        src={MCSVG}
                        className="c-Payment-history__SVG c-SVG__Master"
                    />
                } else if (cell === "amex") {
                    return <ReactSVG
                        src={amexSVG}
                        className="c-Payment-history__SVG c-SVG__Amex"
                    />
                } else {
                    return cell;
                }
            }
        },
        {
            dataField: 'last4',
            text: 'Last 4 Digit',
            formatter: (cell) => {
                if (cell) {
                    return "●●●● " + cell
                } else {
                    return "N.a."
                }
            }
        },
        {
            dataField: 'paidOn',
            text: 'Paid on',
            formatter: (cell) => {
                if (cell) {
                    return cell
                } else {
                    return "N.a."
                }
            }
        },
        {
            dataField: 'status',
            text: 'Status',
            formatter: (cell) => {
                if (cell === "succeeded") {
                    return <Chip label="Paid" color="success" size="small" />
                } else if (cell === "requires_action") {
                    return <Chip label="Requires Action" color="error" size="small" />
                } else if (cell === "requires_payment_method") {
                    return <Chip label="Failed" size="small" color="error" />
                } else if (cell === "canceled") {
                    return <Chip label="Canceled" size="small" />
                } else {
                    return cell;
                }
            }
        },
        {
            dataField: 'clientSecret',
            text: '',
            hidden: true
        },
        {
            dataField: 'action',
            text: '',
            formatter: (cell, row) => {
                if (cell) {
                    return <button type="button" className="c-Btn c-Btn--link" onClick={() => handleFailedPayment(row.clientSecret)}>Pay Now</button>
                } else {
                    return <p>No action</p>;
                }
            }
        }
    ];
}; 
export const paymentMethodsColumn = (handleRemoveCard) => {
    return [
        {
            dataField: 'serialNo',
            text: '#',
        },
        {
            dataField: 'cardType',
            text: 'Card Type',
            formatter: (cell, row) => {
                if (cell === "visa") {
                    return <ReactSVG
                        src={visaSVG}
                        className="c-Payment-history__SVG c-SVG__Visa"
                    />
                } else if (cell === "mastercard") {
                    return <ReactSVG
                        src={MCSVG}
                        className="c-Payment-history__SVG c-SVG__Master"
                    />
                } else if (cell === "amex") {
                    return <ReactSVG
                        src={amexSVG}
                        className="c-Payment-history__SVG c-SVG__Amex"
                    />
                } else {
                    return cell;
                }
            }
        },
        {
            dataField: 'last4',
            text: 'Last 4 Digit',
            formatter: (cell) => (
                "●●●● " + cell
            )
        },
        {
            dataField: 'expDate',
            text: 'Valid Thru',
        },
        {
            dataField: 'createdAt',
            text: 'Added on'
        },
        {
            dataField: 'action_delete',
            text: '',
            formatter: (cell) => {
                return <p onClick={() => handleRemoveCard(cell)}>Remove Card</p>
            }
        }
    ];
};