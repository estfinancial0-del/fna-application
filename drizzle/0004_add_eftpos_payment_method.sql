-- Add 'eftpos' to payment method enum
ALTER TABLE `payment_agreement` MODIFY COLUMN `paymentMethod` ENUM('cash', 'cheque', 'credit_card', 'eftpos');
