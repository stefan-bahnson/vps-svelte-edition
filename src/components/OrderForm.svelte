<script>
  import { router } from "tinro"
  import { mutation, query } from "svelte-apollo"
  import { CREATE_ORDER, GET_ORDERS } from "../queries"
  import { activeOrder } from "../stores"
  const STATUSES = ["Pending", "Started", "Completed", "Cancelled"]

  const INITIAL_FIELDS = {
    title: "",
    description: "",
    status: "Pending",
  }
  let fields = { ...INITIAL_FIELDS }

  const createOrder = mutation(CREATE_ORDER)
  const orders = query(GET_ORDERS)

  async function createNewOrder() {
    console.log(fields)

    try {
      const res = await createOrder({ variables: { input: { ...fields } } })
      const { createOrder: newOrder } = res.data

      activeOrder.set(newOrder)
      orders.refetch()
      router.goto("/orders")
    } catch (error) {
      console.error("failed to create order", error)
    }
  }
</script>

<style lang="scss"></style>

<form on:submit|preventDefault={createNewOrder}>
  <label for="order-title">Project name</label>
  <input
    id="order-title"
    type="text"
    bind:value={fields.title}
    on:change={(e) => {
      fields.title = e.target.value
    }}
  />
  <label for="order-description">Description</label>
  <textarea
    id="order-description"
    bind:value={fields.description}
    on:change={(e) => {
      fields.description = e.target.value
    }}
    rows="6"
  />
  <select bind:value={fields.status}>
    {#each STATUSES as status}
      <option value={status}>
        {status}
      </option>
    {/each}
  </select>
  <div>
    <button type="submit">New order</button>
    <button on:click|preventDefault={() => router.goto("/orders")}
      >cancel</button
    >
  </div>
</form>
