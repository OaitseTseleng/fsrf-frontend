import { notFound } from "next/navigation";
import Image from "next/image";
import fetchStrapi from "@/lib/fetch-3";

interface OrgData {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  shortDescription: string;
  email: string;
  phone: string;
  website: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  logoUrl?: string;
}

interface Props {
  params: {
    slug: string;
  };
}

export default async function OrgDetailPage({ params }: Props) {
  const { slug } = params;
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1337";

  let orgData: OrgData | undefined;
  try {
    const response = await fetchStrapi<OrgData[]>(
      `/organisations?filters[slug][$eq]=${encodeURIComponent(slug)}&populate=logo`
    );
    const item = response.data?.[0];
    if (item) {
      const logoPath = (item as any).logo?.url;
      orgData = { ...item, logoUrl: logoPath ? `${baseUrl}${logoPath}` : undefined };
    }
  } catch {
    return notFound();
  }

  if (!orgData) {
    return notFound();
  }

  const org = orgData;

  return (
    <div className="px-25 py-10 bg-[#001f3f]">
      {/* Header: Logo & Name */}
      <div className="flex flex-col items-center mb-8">
        {org.logoUrl && (
          <div className="h-20 w-20 mb-4 relative">
            <Image
              src={org.logoUrl}
              alt={`${org.name} logo`}
              fill
              className="object-cover rounded-full"
            />
          </div>
        )}
        <h1 className="text-3xl font-extrabold text-white">{org.name}</h1>
      </div>

      {/* Short Description */}
      <div className="mb-8 text-white leading-relaxed">
        {org.shortDescription}
      </div>

      {/* Details */}
      {/* <div className="mb-8">
        <h2 className="text-2xl font-semibold text-white mb-3">Organization Details</h2>
        <ul className="list-disc list-inside text-white space-y-2">
          <li><span className="font-medium">ID:</span> {org.id}</li>
          <li><span className="font-medium">Document ID:</span> {org.documentId}</li>
          <li><span className="font-medium">Slug:</span> {org.slug}</li>
        </ul>
      </div> */}

      {/* Contact */}
      <div>
        <h2 className="text-2xl font-semibold text-white mb-3">Contact Information</h2>
        <ul className="space-y-2 text-white">
          <li>
            <span className="font-medium">Email:</span>{" "}
            <a href={`mailto:${org.email}`} className="underline text-white hover:text-gray-300">
              {org.email}
            </a>
          </li>
          <li>
            <span className="font-medium">Phone:</span>{" "}
            <a href={`tel:${org.phone}`} className="underline text-white hover:text-gray-300">
              {org.phone}
            </a>
          </li>
          <li>
            <span className="font-medium">Website:</span>{" "}
            <a
              href={`https://${org.website}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-white hover:text-gray-300"
            >
              {org.website}
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
