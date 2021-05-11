# Stripe extension for ScandiPWA
Heads up! This extension installation will only make you halfway to success. Supplementing it with a [Stripe extension front-end](https://github.com/scandipwa/stripe-payments) is a **must**

Learn more about installing Scandipwa extensions in our [official docs 🚀](https://docs.scandipwa.com/magento/working-with-magento-modules)

> **Note 1**: In order to get this payment method, you need to install additional extensions.

Stripe is implemented via stripe `react-stripe-elements` component. In the checkout it looks like this for simple card payments:

![image](https://user-images.githubusercontent.com/29531824/69980856-c1628580-1539-11ea-9a9d-cf24a53c766e.png)

## Installation:

> **Note 2**: it is recommended to purchase and install from Magento Marketplace to avoid having sudden bugs. We will cover this installation process

**Heads-up!** Ensure you have purchased the module on your current Magento account (`echo $COMPOSER_AUTH`)! Since Stripe removed packages from packagist, this is the only way to proceed!!

1. Place an order for the module through the [Magento Marketplace](https://marketplace.magento.com/stripe-stripe-payments.html)
2. Create new folder in the Magento 2 root and call it `localmodules`, or simply extract it to the `app/code` directory and skip *Step 3* (If you are building a module to be used by a single project, you can start by creating a new folder using a pattern <VENDOR>/<NAME> in app/code folder)
3. Require ScaniPWA GraphQL definition extension: `composer require scandipwa/stripe-graphql`
4. Update the Magento 2 modules: `magento se:up`

**To configure**:
1. Go to https://dashboard.stripe.com/ - signup
2. Go to *Developer > Api Keys*, copy credentials
3. Go to *Store > Configuration > Sales > Payment Methods > Stripe* and enter credentials from above

**Manual installation**:
For manual installation please follow the [Install the module manually](https://stripe.com/docs/plugins/magento/install#manual) guide from Stripe. Please then repeat all steps from the guide hereinbefore!

## Technical details:

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
