import {RouteProps} from 'react-router-dom';
import CategoryList from '../pages/category/PagList';
import GenreList from '../pages/genre/PageList';
import CastMemberList from '../pages/cast-member/PageList';
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
        component: CategoryList,
        exact: true
    }, 
    {
        name: 'categories.edit',
        label: 'Editar Categorias',
        path: '/categories/:id/edit',
        component: CategoryList,
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
        component: GenreList,
        exact: true
    },
    {
        name: 'genres.edit',
        label: 'Editar Generos',
        path: '/genres/:id/edit',
        component: CastMemberList,
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
        component: CastMemberList,
        exact: true
    },
    {
        name: 'cast_members.edit',
        label: 'Editar Membros de elenco',
        path: '/cast-members/:id/edit',
        component: CastMemberList,
        exact: true
    }, 
]

export default routes;