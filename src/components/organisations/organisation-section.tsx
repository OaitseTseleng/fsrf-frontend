'use client';

import { gql } from '@apollo/client';
import fetch from '@/lib/fetch-service';
import Loader from '@/components/common/loader';
import Link from 'next/link';
import Image from 'next/image';

const ORGS_QUERY = gql`
  query {
    organisations {
      name
      slug
      shortDescription
      logo {
        url
      }
    }
  }
`;

const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

interface Organization {
  name: string;
  slug: string;
  shortDescription: string;
  logo?: string;
}

export default function OrganisationsSection() {
  const { data, loading, error } = fetch(ORGS_QUERY);

  const organizations: Organization[] = data?.organisations?.map((org: any) => ({
    name: org.name,
    slug: org.slug,
    shortDescription: org.shortDescription,
    logo: org.logo?.url ? baseUrl + org.logo.url : undefined,
  })) || [];

  if (loading) return <div className="p-6"><Loader /></div>;
  if (error) return (
    <div className="text-red-500 bg-red-100 border border-red-400 p-4 rounded-md m-4">
      <h2 className="font-bold">Something went wrong</h2>
      <p>{error.message || 'Unable to load data. Please try again later.'}</p>
    </div>
  );

  return (
    <section className="bg-white py-20 px-6 mx-auto">
      {/* Intro Section */}
      <div className="text-center mb-16 max-w-3xl mx-auto">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Understanding Financial Regulation in Botswana
        </h2>
        <p className="text-gray-700 text-lg leading-relaxed">
          This site aims to make it easier for individuals and businesses to navigate the frameworks and regulations related to financial services in Botswana. Whether you're starting a bank, a non-bank financial institution, or simply need clarity on compliance, licenses, or policy, we’ve curated a list of key regulatory bodies to help guide your journey.
        </p>
      </div>

      {/* Organizations Display */}
      <div className="space-y-10">
        {organizations.map((org) => (
          <Link key={org.slug} href={`/pages/organisations/${org.slug}`}>
            <div className="border-t border-gray-200 pt-10 pb-10 hover:bg-gray-50 transition rounded-lg cursor-pointer">
              <div className="flex flex-col items-center text-center gap-4 max-w-3xl mx-auto">
                {org.logo && (
                  <div className="h-16 w-16 relative bg-gray-100 rounded-md border border-gray-300 overflow-hidden">
                    <Image
                      src={org.logo}
                      alt={org.name}
                      fill
                      className="object-contain p-1"
                    />
                  </div>
                )}
                <div className="text-2xl font-semibold text-blue-700">
                  {org.name}
                </div>
                <p className="text-gray-800 text-sm leading-relaxed">
                  {org.shortDescription}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
