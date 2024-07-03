import * as React from 'react';
import { Admin, Resource } from 'react-admin';
import { UserList, UserEdit, UserCreate } from '../users';
import dataProvider from '../dataProvider';

const App = () => (
    <Admin dataProvider={dataProvider}>
        <Resource name="users" list={UserList} edit={UserEdit} create={UserCreate} />
    </Admin>
);

export default App;
