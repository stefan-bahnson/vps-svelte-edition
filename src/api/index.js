import { v4 as uuidv4 } from "uuid"

let ordersData = [
  { _id: uuidv4(), name: "Project 1", created: new Date() },
  { _id: uuidv4(), name: "Project 1", created: new Date() },
  { _id: uuidv4(), name: "Project 1", created: new Date() },
]

export async function get() {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return ordersData
}

export async function post(order) {
  await new Promise((resolve) => setTimeout(resolve, 1500))
  const newOrder = {
    _id: uuidv4(),
    created: new Date(),
    ...order,
  }

  ordersData = [newOrder, ...ordersData]
  return newOrder
}
