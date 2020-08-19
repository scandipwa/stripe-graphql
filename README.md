# Stripe extension for ScandiPWA

> **Note 1**: In order to get this payment method, you need to install additional extensions.

Stripe is implemented via stripe `react-stripe-elements` component. In the checkout it looks like this for simple card payments:

![image](https://user-images.githubusercontent.com/29531824/69980856-c1628580-1539-11ea-9a9d-cf24a53c766e.png)

**To install**:

> **Note 2**: it is recommended to install from Magento Marketplace - bellow is the manual instruction

1. Go to https://stripe.com/docs/plugins/magento/install 
2. Click on "Download" button, get the Stripe module
3. Create new folder in the Magento 2 root (if using [scandipwa-base](https://github.com/scandipwa/scandipwa-base): `src` folder) call it `localmodules`.
3. Extract archive `app/code/StripeIntegration` folder content to newly created folder.
4. Add folder to composer repository list: `app` container: `composer config repositories.stripe path localmodules/Payments`
5. Require the module: `composer require stripe/module-payments`
6. Require ScaniPWA GraphQL definition extension: `composer require scandipwa/stripe-graphql`
7. Update the M2 modules: `magento se:up`

**To configure**:
1. Go to https://dashboard.stripe.com/ - signup
2. Go to *Developer > Api Keys*, copy credentials
3. Go to *Store > Configuration > Sales > Payment Methods > Stripe* and enter credentials from above

**Technical details**:

Extends the Magento store config to include the publishable Stripe API keys and the current mode. These can be configured in the Magento Admin panel, in Stores > Settings: Configuration > Sales: Payment Methods > Stripe > Basic Settings

Example query:

```graphql
query {
  storeConfig {
    stripe_mode
    stripe_live_pk
    stripe_test_pk
  } 
}
```
