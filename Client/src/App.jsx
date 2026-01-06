import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {gql} from '@apollo/client';
import {useQuery} from '@apollo/client/react';

const query = gql`
  query getTodosWithUser {
  getAllTodos{
    id,
    title,
    completed,
    user{
      name
    }
}
  }
`;

function App() {

  const {loading,error,data} = useQuery(query);;

  console.log(data)

  if(loading) return <h1>Loading...</h1>

  return (
    <>
      <table>
        <tbody>
          {
            data.getAllTodos.map(todo => <tr key={todo.id}>
                <td>{todo.title}</td>
                <td>{todo.completed ? "Completed" : "Not Completed"}</td>
                <td>{todo.user.name}</td>
              </tr>
            )
          }
        </tbody>
      </table>
    </>
  )
}

export default App
