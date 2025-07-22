// lib/fetch-resource.js
export async function fetchResources(search = '', page = 1, pageSize = 5) {
  const qs = require('qs');
  const query = qs.stringify({
    populate: {
      steps: {
        populate: ['file']
      },
    },
    filters: {
      title: {
        $containsi: search
      },
    },
    pagination: {
      page,
      pageSize
    }
  });

  const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/resources`);
  const data = await res.json();
  return data;
}
