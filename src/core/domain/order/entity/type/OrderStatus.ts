export enum OrderStatus {
  PaymentPending = 'Payment Pending',
  PaymentApproved = 'Payment Approved',
  PaymentDenied = 'Payment Denied',
  Sent = 'Sent',
  outForDelivery = 'Out for delivery',
  delivered = 'Delivered',
}

export type UpdateOrderStatus = {
  status: OrderStatus;
};
