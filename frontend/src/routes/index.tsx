import {RouteProps} from 'react-router-dom';
import CategoryList from '../pages/category/PagList';
import CategoryForm from '../pages/category/PageForm';
import GenreList from '../pages/genre/PageList';
import GenreForm from '../pages/genre/PageForm';
import CastMemberList from '../pages/cast-member/PageList';
import CastMemberForm from '../pages/cast-member/PageForm';
import Dashboard from '../pages/Dashboard';


export interface MyRouteProps extends RouteProps {
    name: string;
    label: string;
}

const routes: MyRouteProps[] = [
    {
        name: 'dashboard',
        label: 'Dashboard',
        path: '/',
        component: Dashboard,
        exact: true
    }, 
    {
        name: 'categories.list',
        label: 'Listagem Categorias',
        path: '/categories',
        component: CategoryList,
        exact: true
    }, 
    {
        name: 'categories.create',
        label: 'Criar Categorias',
        path: '/categories/create',
        component: CategoryForm,
        exact: true
    }, 
    {
        name: 'categories.edit',
        label: 'Editar Categorias',
        path: '/categories/:id/edit',
        component: CategoryForm,
        exact: true
    },
    {
        name: 'genres.list',
        label: 'Listagem Generos',
        path: '/genres',
        component: GenreList,
        exact: true
    }, 
    {
        name: 'genres.create',
        label: 'Criar Generos',
        path: '/genres/create',
        component: GenreForm,
        exact: true
    },
    {
        name: 'genres.edit',
        label: 'Editar Generos',
        path: '/genres/:id/edit',
        component: GenreForm,
        exact: true
    },
    {
        name: 'cast_members.list',
        label: 'Listagem Membros de elenco',
        path: '/cast-members',
        component: CastMemberList,
        exact: true
    }, 
    {
        name: 'cast_members.create',
        label: 'Criar Membros de elenco',
        path: '/cast-members/create',
        component: CastMemberForm,
        exact: true
    },
    {
        name: 'cast_members.edit',
        label: 'Editar Membros de elenco',
        path: '/cast-members/:id/edit',
        component: CastMemberForm,
        exact: true
    }, 
]

export default routes;