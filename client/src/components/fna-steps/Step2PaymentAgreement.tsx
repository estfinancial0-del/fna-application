import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { Loader2, CreditCard, FileCheck } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useEffect } from "react";
import { SignaturePad } from "@/components/SignaturePad";

interface Step2Props {
  submissionId: number;
  onNext: () => void;
  onPrevious: () => void;
}

interface PaymentAgreementFormData {
  paymentMethod: "cash" | "cheque" | "credit_card";
  fullName: string;
  paymentDescription: string;
  cardHolderName: string;
  amount: string;
  cardType: string;
  cardNumber: string;
  cardExpiry: string;
  agree290Payment: boolean;
  agreeRefundPolicy: boolean;
  agreeBringDocuments: boolean;
  agree2Hours: boolean;
  clientName1: string;
  clientSignature1: string;
  clientDate1: string;
  clientName2?: string;
  clientSignature2?: string;
  clientDate2?: string;
}

export function Step2PaymentAgreement({ submissionId, onNext, onPrevious }: Step2Props) {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<PaymentAgreementFormData>({
    defaultValues: {
      paymentMethod: "credit_card",
      amount: "290.00",
      agree290Payment: false,
      agreeRefundPolicy: false,
      agreeBringDocuments: false,
      agree2Hours: false,
    }
  });

  const paymentMethod = watch("paymentMethod");

  // Fetch existing data
  const { data: existingData, isLoading } = trpc.fna.getPaymentAgreement.useQuery(
    { fnaSubmissionId: submissionId },
    { enabled: !!submissionId }
  );

  // Save mutation
  const saveMutation = trpc.fna.savePaymentAgreement.useMutation({
    onSuccess: () => {
      toast.success("Payment & Agreement saved successfully");
      onNext();
    },
    onError: (error) => {
      toast.error(`Failed to save: ${error.message}`);
    },
  });

  // Load existing data
  useEffect(() => {
    if (existingData) {
      Object.keys(existingData).forEach((key) => {
        const value = existingData[key as keyof typeof existingData];
        if (value !== null && value !== undefined) {
          setValue(key as keyof PaymentAgreementFormData, value as any);
        }
      });
    }
  }, [existingData, setValue]);

  const onSubmit = (data: PaymentAgreementFormData) => {
    saveMutation.mutate({
      fnaSubmissionId: submissionId,
      ...data,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <CreditCard className="h-6 w-6 text-primary" />
          Payment & Agreement
        </h2>
        <p className="text-gray-600">
          Please provide payment information and acknowledge the appointment terms
        </p>
      </div>

      {/* Payment Information */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Information</CardTitle>
          <CardDescription>
            est Financial hereby acknowledges receipt in the amount of $290.00 (incl GST) from the following payment source
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Payment Method */}
          <div className="space-y-3">
            <Label>Payment Method *</Label>
            <RadioGroup
              value={paymentMethod}
              onValueChange={(value) => setValue("paymentMethod", value as any)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="cash" id="cash" />
                <Label htmlFor="cash" className="font-normal cursor-pointer">Cash</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="cheque" id="cheque" />
                <Label htmlFor="cheque" className="font-normal cursor-pointer">Cheque</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="credit_card" id="credit_card" />
                <Label htmlFor="credit_card" className="font-normal cursor-pointer">Credit Card</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                {...register("fullName", { required: "Full name is required" })}
                placeholder="Enter full name"
              />
              {errors.fullName && (
                <p className="text-sm text-red-600">{errors.fullName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="paymentDescription">Payment Description</Label>
              <Input
                id="paymentDescription"
                {...register("paymentDescription")}
                placeholder="e.g., Consultation Fee"
                defaultValue="Consultation Fee"
              />
            </div>
          </div>

          {paymentMethod === "credit_card" && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cardHolderName">Name of Card Holder *</Label>
                  <Input
                    id="cardHolderName"
                    {...register("cardHolderName", {
                      required: paymentMethod === "credit_card" ? "Card holder name is required" : false
                    })}
                    placeholder="Enter card holder name"
                  />
                  {errors.cardHolderName && (
                    <p className="text-sm text-red-600">{errors.cardHolderName.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cardType">Type of Card *</Label>
                  <Input
                    id="cardType"
                    {...register("cardType", {
                      required: paymentMethod === "credit_card" ? "Card type is required" : false
                    })}
                    placeholder="e.g., Visa, Mastercard"
                  />
                  {errors.cardType && (
                    <p className="text-sm text-red-600">{errors.cardType.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount $ *</Label>
                  <Input
                    id="amount"
                    {...register("amount", { required: "Amount is required" })}
                    placeholder="290.00"
                    type="number"
                    step="0.01"
                  />
                  {errors.amount && (
                    <p className="text-sm text-red-600">{errors.amount.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Card Number *</Label>
                  <Input
                    id="cardNumber"
                    {...register("cardNumber", {
                      required: paymentMethod === "credit_card" ? "Card number is required" : false
                    })}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                  />
                  {errors.cardNumber && (
                    <p className="text-sm text-red-600">{errors.cardNumber.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cardExpiry">Expiry *</Label>
                  <Input
                    id="cardExpiry"
                    {...register("cardExpiry", {
                      required: paymentMethod === "credit_card" ? "Expiry date is required" : false
                    })}
                    placeholder="MM/YY"
                    maxLength={5}
                  />
                  {errors.cardExpiry && (
                    <p className="text-sm text-red-600">{errors.cardExpiry.message}</p>
                  )}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Agreement Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileCheck className="h-5 w-5" />
            Agreement & Acknowledgment
          </CardTitle>
          <CardDescription>
            Please read and agree to the following terms
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start space-x-3">
            <Checkbox
              id="agree290Payment"
              checked={watch("agree290Payment")}
              onCheckedChange={(checked) => setValue("agree290Payment", checked as boolean)}
            />
            <Label htmlFor="agree290Payment" className="font-normal leading-relaxed cursor-pointer">
              I/We hereby agree to pay $290 for our initial meeting with an est Financial Specialist.
            </Label>
          </div>

          <div className="flex items-start space-x-3">
            <Checkbox
              id="agreeRefundPolicy"
              checked={watch("agreeRefundPolicy")}
              onCheckedChange={(checked) => setValue("agreeRefundPolicy", checked as boolean)}
            />
            <Label htmlFor="agreeRefundPolicy" className="font-normal leading-relaxed cursor-pointer">
              I/We understand that if est Financial is unable to assist us in any way whatsoever, this investment will be totally refunded with no questions asked.
            </Label>
          </div>

          <div className="flex items-start space-x-3">
            <Checkbox
              id="agreeBringDocuments"
              checked={watch("agreeBringDocuments")}
              onCheckedChange={(checked) => setValue("agreeBringDocuments", checked as boolean)}
            />
            <Label htmlFor="agreeBringDocuments" className="font-normal leading-relaxed cursor-pointer">
              I/We agree to bring the documents listed in the 'What To Bring With You To Your Appointment' list so that our financial situation may be accurately assessed.
            </Label>
          </div>

          <div className="flex items-start space-x-3">
            <Checkbox
              id="agree2Hours"
              checked={watch("agree2Hours")}
              onCheckedChange={(checked) => setValue("agree2Hours", checked as boolean)}
            />
            <Label htmlFor="agree2Hours" className="font-normal leading-relaxed cursor-pointer">
              I/We agree to allocate a minimum of 2 hours for the appointment and, if married or de facto, we will both attend the scheduled appointment.
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Client Signatures */}
      <Card>
        <CardHeader>
          <CardTitle>Client Acknowledgment</CardTitle>
          <CardDescription>
            The information I/we have provided in this document is complete and accurate to the best of my/our knowledge
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Client 1 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="space-y-2">
              <Label htmlFor="clientName1">Client's Name *</Label>
              <Input
                id="clientName1"
                {...register("clientName1", { required: "Client name is required" })}
                placeholder="Enter client name"
              />
              {errors.clientName1 && (
                <p className="text-sm text-red-600">{errors.clientName1.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <SignaturePad
                label="Client's Signature"
                value={watch("clientSignature1")}
                onChange={(sig) => setValue("clientSignature1", sig)}
                required
                error={errors.clientSignature1?.message}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="clientDate1">Date *</Label>
              <Input
                id="clientDate1"
                type="date"
                {...register("clientDate1", { required: "Date is required" })}
              />
              {errors.clientDate1 && (
                <p className="text-sm text-red-600">{errors.clientDate1.message}</p>
              )}
            </div>
          </div>

          {/* Client 2 (Optional) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="space-y-2">
              <Label htmlFor="clientName2">Client's Name (Optional)</Label>
              <Input
                id="clientName2"
                {...register("clientName2")}
                placeholder="Enter second client name"
              />
            </div>

            <div className="space-y-2">
              <SignaturePad
                label="Client's Signature"
                value={watch("clientSignature2")}
                onChange={(sig) => setValue("clientSignature2", sig || "")}
                required={false}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="clientDate2">Date (Optional)</Label>
              <Input
                id="clientDate2"
                type="date"
                {...register("clientDate2")}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6">
        <Button type="button" variant="outline" onClick={onPrevious}>
          Previous
        </Button>
        <Button type="submit" disabled={saveMutation.isPending}>
          {saveMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save & Continue
        </Button>
      </div>
    </form>
  );
}
