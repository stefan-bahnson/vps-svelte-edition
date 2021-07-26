import { gql } from "apollo-boost"

export const GET_ORDERS = gql`
  {
    orders {
      id
      title
      description
      status
      created
    }
  }
`

export const CREATE_ORDER = gql`
  mutation CreateOrderMutation($input: OrderInput) {
    createOrder(input: $input) {
      id
      title
      description
      created
    }
  }
`

export const UPDATE_ORDER = gql`
  mutation UpdateOrderMutation($id: ID, $input: OrderInput) {
    updateOrder(id: $id, input: $input) {
      id
      title
      description
      created
    }
  }
`

export const DELETE_ORDER = gql`
  mutation DeleteOrderMutation($id: ID) {
    deleteOrder(id: $id)
  }
`
