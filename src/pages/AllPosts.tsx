import { useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getArticles, updateArticle, deleteArticle, type Article } from '../services/api';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  type Table as ReactTable,
} from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Link } from 'react-router-dom';
import { Edit, Trash, Undo, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const AllPosts = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('published');

  const { data, isLoading } = useQuery({
    queryKey: ['articles'],
    queryFn: () => getArticles(100, 0), // Fetch all articles
  });

  const articles = useMemo(() => data?.data || [], [data]);

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: 'thrash' | 'publish' | 'draft' }) =>
      updateArticle(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteArticle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
    },
  });

  const handleTrash = (id: number) => {
    updateStatusMutation.mutate({ id, status: 'thrash' });
  };

  const handleRestore = (id: number) => {
    updateStatusMutation.mutate({ id, status: 'draft' });
  };

  const handleDeletePermanently = (id: number) => {
    deleteMutation.mutate(id);
  };

  const columnHelper = createColumnHelper<Article>();

  const columns = [
    columnHelper.accessor('title', {
      header: 'Title',
      cell: (info) => <span className="font-medium block truncate" title={info.getValue()}>{info.getValue()}</span>,
    }),
    columnHelper.accessor('category', {
      header: 'Category',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('updated_date.Time', {
        header: 'Last Modified',
        cell: (info) => new Date(info.getValue()).toLocaleDateString(),
      }),
    columnHelper.accessor('id', {
      header: 'Actions',
      cell: (info) => (
        <div className="flex gap-2">
          <Link to={`/edit/${info.getValue()}`}>
            <Button variant="outline" size="icon">
              <Edit className="h-4 w-4" />
            </Button>
          </Link>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <Trash className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action will move the article to the trash.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction className='text-black' onClick={() => handleTrash(info.getValue())}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ),
    }),
  ];

  const trashedColumns = [
    columnHelper.accessor('title', {
        header: 'Title',
        cell: (info) => <span className="font-medium block truncate" title={info.getValue()}>{info.getValue()}</span>,
      }),
      columnHelper.accessor('category', {
        header: 'Category',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('updated_date.Time', {
          header: 'Last Modified',
          cell: (info) => new Date(info.getValue()).toLocaleDateString(),
        }),
      columnHelper.accessor('id', {
        header: 'Actions',
        cell: (info) => (
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={() => handleRestore(info.getValue())}>
                <Undo className="h-4 w-4" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Permanently?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the article.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleDeletePermanently(info.getValue())}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        ),
      }),
  ];

  const published = useMemo(
    () => articles.filter((a) => a.status === 'publish'),
    [articles]
  );
  const drafts = useMemo(
    () => articles.filter((a) => a.status === 'draft'),
    [articles]
  );
  const trashed = useMemo(
    () => articles.filter((a) => a.status === 'thrash'),
    [articles]
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const useTable = (data: Article[], columns: any) => {
    console.log(data);
    return useReactTable({
      data,
      columns,
      getCoreRowModel: getCoreRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      initialState: {
        pagination: {
          pageSize: 5,
        },
      },
    })};

  const tablePublished = useTable(published, columns);
  const tableDrafts = useTable(drafts, columns);
  const tableTrashed = useTable(trashed, trashedColumns);

  const renderTable = (table: ReactTable<Article>) => (
    <div className="space-y-4">
        <div className="rounded-md border overflow-x-auto">
      <Table className="w-full table-fixed">
        <colgroup>
          <col className="w-[50%]" />
          <col className="w-[20%]" />
          <col className="w-[20%]" />
          <col className="w-[10%]" />
        </colgroup>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      </div>
      <div className="flex items-center justify-end space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-4">
        <h1 className="text-3xl font-bold">All Posts</h1>
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList>
        <TabsTrigger value="published">Published</TabsTrigger>
        <TabsTrigger value="drafts">Drafts</TabsTrigger>
        <TabsTrigger value="trashed">Trashed</TabsTrigger>
      </TabsList>
      <TabsContent value="published">{renderTable(tablePublished)}</TabsContent>
      <TabsContent value="drafts">{renderTable(tableDrafts)}</TabsContent>
      <TabsContent value="trashed">{renderTable(tableTrashed)}</TabsContent>
    </Tabs>
    </div>
  );
};

export default AllPosts;
