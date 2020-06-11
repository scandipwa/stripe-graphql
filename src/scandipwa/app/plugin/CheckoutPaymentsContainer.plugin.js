import { STRIPE } from './CheckoutPayments.plugin';

class CheckoutPaymentsContainerPlugin {
    aroundContainerFunctions = (originalMember, instance) => ({
        ...originalMember,
        setStripeRef: this.setStripeRef.bind(instance),
    })

    aroundDataMap = (originalMember, instance) => ({
        ...originalMember,
        [STRIPE]: this.getStripeData.bind(this, instance),
    })

    setStripeRef(ref) {
        this.stripeRef = ref;
    }

    getStripeData = (instance) => {
        return { asyncData: instance.stripeRef.submit() };
    }
}

const {
    aroundContainerFunctions,
    aroundDataMap
} = new CheckoutPaymentsContainerPlugin();

const config = {
    'Component/CheckoutPayments/Container': {
        'member-property': {
            'containerFunctions': [
                {
                    position: 100,
                    implementation: aroundContainerFunctions
                }
            ],
            'dataMap': [
                {
                    position: 100,
                    implementation: aroundDataMap
                }
            ]
        }
    }
};

export default config;
