import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createArticle, type CreateArticleDTO } from '../services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const AddNew = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { register, handleSubmit, setValue } = useForm<CreateArticleDTO>();

  const mutation = useMutation({
    mutationFn: createArticle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      navigate('/');
    },
  });

  const onSubmit = (data: CreateArticleDTO) => {
    mutation.mutate(data);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Article</CardTitle>
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
            <Button type="submit" variant="ghost" onClick={() => setValue('status', 'publish')}>Publish</Button>
            <Button type="submit" variant="secondary" onClick={() => setValue('status', 'draft')}>Save as Draft</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddNew;
