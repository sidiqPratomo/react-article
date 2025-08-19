import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getArticle, updateArticle, type UpdateArticleDTO } from '../services/api';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { Textarea } from '../components/ui/textarea';

const EditPost = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { register, handleSubmit, setValue, reset } = useForm<UpdateArticleDTO>();

  const { data: article } = useQuery({ 
    queryKey: ['article', id], 
    queryFn: () => getArticle(Number(id)),
    enabled: !!id,
  });

  useEffect(() => {
    if (article) {
      reset(article);
    }
  }, [article, reset]);

  const mutation = useMutation({
    mutationFn: (data: UpdateArticleDTO) => updateArticle(Number(id), data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      queryClient.invalidateQueries({ queryKey: ['article', id] });
      navigate('/');
    },
  });

  const onSubmit = (data: UpdateArticleDTO) => {
    mutation.mutate(data);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Article</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="title">Title</label>
            <Input id="title" {...register('title', { required: true })} />
          </div>
          <div>
            <label htmlFor="content">Content</label>
            <Textarea id="content" {...register('content', { required: true })} />
          </div>
          <div>
            <label htmlFor="category">Category</label>
            <Input id="category" {...register('category', { required: true })} />
          </div>
          <div className="flex gap-2">
            <Button type="submit" variant="outline" onClick={() => setValue('status', 'publish')}>Publish</Button>
            <Button type="submit" variant="secondary" onClick={() => setValue('status', 'draft')}>Save as Draft</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default EditPost;
