import { PaymentRequestButtonElement } from 'react-stripe-elements';


export class StripeOneClickPayment extends ExtensiblePureComponent {
    render() {
        const { paymentRequest } = this.props;

        return (
            <div block="InjectedStripeCheckoutForm" elem="ButtonPay">
                <PaymentRequestButtonElement
                  paymentRequest={ paymentRequest }
                />
            </div>
        );
    }
}

export default middleware(StripeOneClickPayment, 'ScandiPWA/StripeGraphQl/Component/StripeOneClickPayment/Component');
