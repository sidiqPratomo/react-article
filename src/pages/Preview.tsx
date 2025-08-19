import { useQuery } from '@tanstack/react-query';
import { getArticles, type Article } from '../services/api';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../components/ui/card';
import { useMemo, useState } from 'react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';

const Preview = () => {
  const [page, setPage] = useState(0);
  const limit = 3; // Number of articles per page

  const { data, isLoading, isError } = useQuery({ 
    queryKey: ['articles'], 
    queryFn: () => getArticles(100, 0)
  });

  const articles = useMemo(() => data?.data || [], [data]);

  const publishedArticles = articles.filter(article => article.status === 'publish');
  const paginatedArticles = publishedArticles.slice(page * limit, (page + 1) * limit);
  const totalPages = Math.ceil(publishedArticles.length / limit);


  if (isLoading) return <div className="text-center p-10">Loading articles...</div>;
  if (isError) return <div className="text-center p-10 text-red-500">Error loading articles.</div>;

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight">From the Blog</h1>
        <p className="mt-2 text-lg text-muted-foreground">The latest news and updates from our team.</p>
      </div>

      {paginatedArticles.length === 0 ? (
        <div className="text-center p-10">
            <p className="text-muted-foreground">No published articles found.</p>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {paginatedArticles.map(article => (
            <Card key={article.id} className="flex flex-col">
              <CardHeader>
                <Badge variant="outline" className="w-fit mb-2">{article.category}</Badge>
                <CardTitle className="text-2xl font-bold hover:text-primary transition-colors">
                    {article.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-muted-foreground line-clamp-4">{article.content}</p>
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                    {new Date(article.updated_date.Time).toLocaleDateString()}
                </span>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <Button
            onClick={() => setPage(old => Math.max(old - 1, 0))}
            disabled={page === 0}
            variant="outline"
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page + 1} of {totalPages}
          </span>
          <Button
            onClick={() => setPage(old => Math.min(old + 1, totalPages - 1))}
            disabled={page === totalPages - 1}
            variant="outline"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default Preview;

