<?php

namespace ScandiPWA\StripeGraphQl\Plugin\Sales\Model\Service;

use Magento\Framework\GraphQl\Exception\GraphQlInputException;

class OrderService
{
    /**
     * OrderService constructor.
     * @param \StripeIntegration\Payments\Helper\Rollback $rollback
     * @param \StripeIntegration\Payments\Helper\GenericFactory $helperFactory
     */
    public function __construct(
        \StripeIntegration\Payments\Helper\Rollback $rollback,
        \StripeIntegration\Payments\Helper\GenericFactory $helperFactory
    ) {
        $this->rollback = $rollback;
        $this->helperFactory = $helperFactory;
    }

    /**
     * @param $subject
     * @param \Closure $proceed
     * @param $order
     * @return mixed
     * @throws GraphQlInputException
     * @throws \Magento\Framework\Exception\CouldNotSaveException
     * @throws \Magento\Framework\Exception\LocalizedException
     */
    public function aroundPlace($subject, \Closure $proceed, $order)
    {
        try
        {
            $this->rollback->reset();
            $returnValue = $proceed($order);
            $this->rollback->reset();
        }
        catch (\Exception $e)
        {
            $helper = $this->helperFactory->create();

            if ($order->getId())
            {
                // The order has already been saved, so we don't want to run the rollback. The exception likely occurred in an order_save_after observer.
                $this->rollback->reset();
                $helper->dieWithError($e->getMessage(), $e);
            }
            else
            {
                $msg = $e->getMessage();

                if (!$this->isAuthenticationRequiredMessage($msg)) {
                    $this->rollback->run($e);
                }
                else {
                    $this->rollback->reset(); // In case some customization is trying to place multiple split-orders
                }

                throw new GraphQlInputException(__('%message', ['message' => $e->getMessage()]), $e);
            }
        }

        return $returnValue;
    }

    // We can't use the helper method because of a circular dependency
    private function isAuthenticationRequiredMessage($message)
    {
        if (strpos($message, "Authentication Required: ") === 0) {
            return true;
        }

        return false;
    }
}
