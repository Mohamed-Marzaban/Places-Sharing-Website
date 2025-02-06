import React, { useEffect, useState } from 'react';

import UsersList from '../components/UsersList';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/http-hook'
const Users = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient()
  const [users, setUsers] = useState()
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const responseData = await sendRequest('http://localhost:5000/api/users')

        setUsers(responseData.users)

      }
      catch (error) {
      }
    }
    fetchUsers()
  }, [sendRequest])

  return <>
    <ErrorModal error={error} onClear={clearError} />
    {isLoading && (<div className="center"><LoadingSpinner asOverlay /></div>)}
    {!isLoading && users && <UsersList items={users} />}
  </>;
};

export default Users;
