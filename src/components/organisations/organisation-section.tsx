'use client';

import { gql } from '@apollo/client';
import fetch from '@/lib/fetch-service';
import Loader from '@/components/common/loader';
import Link from 'next/link';
import Image from 'next/image';

const ORGS_QUERY = gql`
  query {
    organizations {
      data {
        id
        attributes {
          name
          slug
          shortDescription
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

const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

interface Organization {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  logo?: string;
}

export default function OrganizationsSection() {
  const { data, loading, error } = fetch(ORGS_QUERY);

  const organizations: Organization[] = data?.organizations?.data.map((org: any) => ({
    id: org.id,
    name: org.attributes.name,
    slug: org.attributes.slug,
    shortDescription: org.attributes.shortDescription,
    logo: org.attributes.logo?.data?.attributes?.url
      ? baseUrl + org.attributes.logo.data.attributes.url
      : undefined,
  })) || [];

  if (loading) return <div className="p-6"><Loader /></div>;
  if (error) return <div className="text-red-500 p-6">Error loading organizations.</div>;

  return (
    <section className="py-16 px-4 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-center">Participating Organizations</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {organizations.map((org) => (
          <div key={org.id} className="bg-white shadow-md p-6 rounded-xl border border-black/10">
            {org.logo && (
              <div className="h-16 w-16 relative mb-4">
                <Image
                  src={org.logo}
                  alt={org.name}
                  fill
                  className="object-contain"
                />
              </div>
            )}
            <h3 className="text-xl font-semibold text-blue-800 mb-2 hover:underline">
              <Link href={`/organizations/${org.slug}`}>{org.name}</Link>
            </h3>
            <p className="text-gray-700 text-sm">{org.shortDescription}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
