const HASHNODE_API = 'https://gql.hashnode.com';
const HASHNODE_HOST = 'blogs.haripatel.dev';

export interface HashnodeBlog {
  id: string;
  title: string;
  brief: string;
  slug: string;
  coverImage?: {
    url: string;
  };
  publishedAt: string;
  url: string;
  readTimeInMinutes: number;
  tags?: Array<{ name: string }>;
  series?: {
    name: string;
    slug: string;
  };
}

export async function getHashnodeBlogs(limit: number = 10): Promise<HashnodeBlog[]> {
  const query = `
    query Publication($host: String!) {
      publication(host: $host) {
        posts(first: ${limit}) {
          edges {
            node {
              id
              title
              brief
              slug
              coverImage {
                url
              }
              publishedAt
              url
              readTimeInMinutes
              tags {
                name
              }
              series {
                name
                slug
              }
            }
          }
        }
      }
    }
  `;

  try {
    const response = await fetch(HASHNODE_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables: { host: HASHNODE_HOST },
      }),
    });

    // Hashnode retired free GraphQL access (2026-05-13): unauthenticated
    // requests now redirect to an HTML announcement page. Guard against
    // non-OK / non-JSON responses so we degrade to an empty list quietly
    // instead of throwing a JSON parse stack trace on every build.
    const contentType = response.headers.get('content-type') || '';
    if (!response.ok || !contentType.includes('application/json')) {
      console.warn(
        `Hashnode API unavailable (status ${response.status}, ${contentType || 'no content-type'}); returning no blogs. ` +
          'The free GraphQL API now requires a Pro plan — switch to the RSS feed or upgrade to restore blogs.'
      );
      return [];
    }

    const { data } = await response.json();
    return data?.publication?.posts?.edges?.map((edge: any) => edge.node) || [];
  } catch (error) {
    console.warn('Hashnode blog fetch failed; returning no blogs:', error instanceof Error ? error.message : error);
    return [];
  }
}

export function groupBlogsBySeries(blogs: HashnodeBlog[]): Record<string, HashnodeBlog[]> {
  const grouped: Record<string, HashnodeBlog[]> = {};
  
  blogs.forEach(blog => {
    const seriesName = blog.series?.name || 'Uncategorized';
    
    if (!grouped[seriesName]) {
      grouped[seriesName] = [];
    }
    grouped[seriesName].push(blog);
  });
  
  return grouped;
}
