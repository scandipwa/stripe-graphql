# ScandiPWA_StripeGraphQl
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
