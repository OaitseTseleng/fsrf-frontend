import { gql } from '@apollo/client';
import fetch from '@/lib/fetch-service';
import Image from 'next/image';

const ORG_DETAIL_QUERY = gql`
  query ($slug: String!) {
    organizations(filters: { slug: { eq: $slug } }) {
      data {
        attributes {
          name
          longDescription
          email
          phone
          website
          logo {
            data {
              attributes {
                url
              }
            }
          }
        }
      }
    }
  }
`;

export default async function OrgDetailPage({ params }: { params: { slug: string } }) {
  const { data } = await fetch(ORG_DETAIL_QUERY, { slug: params.slug });
  const org = data?.organizations?.data?.[0]?.attributes;

  if (!org) {
    return <div className="p-6">Organization not found.</div>;
  }

  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
  const logoUrl = org.logo?.data?.attributes?.url
    ? baseUrl + org.logo.data.attributes.url
    : null;

  return (
    <section className="max-w-3xl mx-auto px-4 py-12">
      {logoUrl && (
        <div className="h-24 w-24 relative mb-4">
          <Image src={logoUrl} alt={org.name} fill className="object-contain" />
        </div>
      )}
      <h1 className="text-3xl font-bold mb-4">{org.name}</h1>
      <div
        className="prose prose-lg text-gray-800"
        dangerouslySetInnerHTML={{ __html: org.longDescription }}
      />
      <div className="mt-8 space-y-2 text-sm">
        {org.email && <p><strong>Email:</strong> {org.email}</p>}
        {org.phone && <p><strong>Phone:</strong> {org.phone}</p>}
        {org.website && (
          <p>
            <strong>Website:</strong>{' '}
            <a href={org.website} target="_blank" rel="noopener" className="text-blue-600 underline">
              {org.website}
            </a>
          </p>
        )}
      </div>
    </section>
  );
}
