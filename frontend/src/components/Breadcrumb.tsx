/* eslint-disable no-nested-ternary */
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

import Link, { LinkProps } from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import { Box, Breadcrumbs, Container } from '@material-ui/core';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

import RouteParser from 'route-parser';
import { Route } from 'react-router';
import { Location } from 'history';
import routes from '../routes';

const breadcrumbNameMap: { [key: string]: string } = {};
routes.forEach(route => breadcrumbNameMap[route.path as string] = route.label);

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    linkRouter: {
      color: '#4db5ab',
      "&:focus, &:active": {
        color: '#4db5ab',
      },
      "&:hover" : {
        color: '#055a52'
      }
    }
  }),
);

interface LinkRouterProps extends LinkProps {
  to: string;
  replace?: boolean;
}

const LinkRouter = (props: LinkRouterProps) => <Link {...props} component={RouterLink as any} />;

export default function Breadcrumb() {
  const classes = useStyles();

  function makeBreadcrumb(location: Location) {
    const pathnames = location.pathname.split('/').filter((x: string) => x);
    pathnames.unshift('/');
    
    return (
      <Breadcrumbs aria-label="breadcrumb">
        {pathnames.map((value: string, index: number) => {
          const last = index === pathnames.length - 1;
          const to = `${pathnames.slice(0, index + 1).join('/').replace('//', '/')}`;
          const route = Object
                          .keys(breadcrumbNameMap)
                          .find(path => new RouteParser(path)
                          .match(to));

          console.log(route);

          if (route === undefined) {
            return false;
          }

          return last ? (
            <Typography color="textPrimary" key={to}>
              {breadcrumbNameMap[route]}
            </Typography>
          ) : (
            <LinkRouter color="inherit" to={to} key={to} className={classes.linkRouter}>
              {breadcrumbNameMap[route]}
            </LinkRouter>
          );
        })}
      </Breadcrumbs>
    );
  }

  return (

    <Container maxWidth={'xl'}>
      <Box paddingTop={2} paddingBottom={1}>
      <Route>
        {
          ({location}: {location: Location}) => makeBreadcrumb(location)
        }
      </Route>
      </Box>
    </Container>
  );
}
