import * as React from "react";
import {
  ChakraProvider,
  Box,
  Text,
  Input,
  Button,
  Grid,
  theme,
} from "@chakra-ui/react";
import './App.css';

interface Todo{
  id: number,
  text: string,
}

type actionType = {type: "ADD", text:string} | {type: "REMOVE", id: number}

export const App = () => {

  const reducer = (state: Todo[], action: actionType) => {
    switch(action.type) {
      case "ADD":
        return [
          ...state,
          {
            id: state.length,
            text: action.text,
          }
        ]
      
      case "REMOVE":
        return state.filter(({id}) => id !== action.id)
    }
  }

  //useReducer
  const [todos, dispatch] = React.useReducer(reducer, [], () => {
    const localData = localStorage.getItem("todos")
    // console.log(localData)
    return localData ? JSON.parse(localData) : []
  })

  React.useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos))
  }, [todos])

  //useRef
  const ref = React.useRef<HTMLInputElement>(null)

  //useCallback
  const handleAddTodo = React.useCallback(() => {
   
    if(ref.current){
      dispatch({
        type: "ADD",
        text: ref.current.value
      })
      ref.current.value = '';
    }
  }, [])

   //enter to submit  
   const handleKeypress = (e: { key: string; }) => {
    //it triggers by pressing the enter key
  if (e.key === 'Enter') {
    handleAddTodo();
  }
};

  return(
    <ChakraProvider  theme={theme}>
    <Box textAlign="center" fontSize="xl">
      <Input ref={ref} placeholder="Add Your Todo" htmlSize={50} width='auto' mt="5" mb="3" onKeyPress={handleKeypress}/>
      <Button onClick={handleAddTodo} colorScheme="teal" size="md" ml="2">
        Add Todo
      </Button>
      {
        todos.map(todo => (
          <div className="container" key={todo.id}>
              <Text fontSize='xl' mr='2' pl="2">{todo.text}</Text>
              <Button onClick={() => dispatch({type: "REMOVE", id: todo.id})} colorScheme='blue' size='md'>Done</Button>
          </div>
        ))
      }
    </Box>
  </ChakraProvider>
  )
}
