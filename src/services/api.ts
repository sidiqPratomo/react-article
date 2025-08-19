import axios from 'axios';

const API_URL = 'http://localhost:8080/article';

export interface Article {
  id: number;
  title: string;
  content: string;
  category: string;
  status: 'publish' | 'draft' | 'thrash';
  created_date: {
    Time: string;
    Valid: boolean;
  };
  updated_date: {
    Time: string;
    Valid: boolean;
  };
}

export type CreateArticleDTO = Omit<Article, 'id' | 'created_date' | 'updated_date'>;
export type UpdateArticleDTO = Partial<CreateArticleDTO>;

export interface ArticleResponse {
  data: Article[];
  total: number;
}

export const getArticles = async (limit: number, offset: number): Promise<ArticleResponse> => {
  const response = await axios.get(`${API_URL}/list/${limit}/${offset}`);
  return response.data;
};

export const getArticle = async (id: number): Promise<Article> => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

export const createArticle = async (article: CreateArticleDTO): Promise<Article> => {
  const response = await axios.post(`${API_URL}/`, article);
  return response.data;
};

export const updateArticle = async (id: number, article: UpdateArticleDTO): Promise<Article> => {
  const response = await axios.put(`${API_URL}/${id}`, article);
  return response.data;
};

export const deleteArticle = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};
