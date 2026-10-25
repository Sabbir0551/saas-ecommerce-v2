import { redirect } from 'next/navigation';

export default async function PrivacyPolicyPage({
  searchParams,
}: {
  searchParams: Promise<{ tenant?: string }>;
}) {
  const resolvedParams = await searchParams;
  const tenant = resolvedParams.tenant || 'smartvolt';
  redirect(`/policies/privacy?tenant=${tenant}`);
}
