import { redirect } from 'next/navigation';

export default async function RefundPolicyPage({
  searchParams,
}: {
  searchParams: Promise<{ tenant?: string }>;
}) {
  const resolvedParams = await searchParams;
  const tenant = resolvedParams.tenant || 'smartvolt';
  redirect(`/policies/refund-policy?tenant=${tenant}`);
}
