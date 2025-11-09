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

    const { data } = await response.json();
    return data?.publication?.posts?.edges?.map((edge: any) => edge.node) || [];
  } catch (error) {
    console.error('Error fetching Hashnode blogs:', error);
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
