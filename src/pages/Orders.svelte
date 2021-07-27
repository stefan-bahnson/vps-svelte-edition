<script>
  import { slide, fade } from "svelte/transition"
  import { active } from "tinro"
  import { format } from "date-fns"
  import { query, mutation } from "svelte-apollo"
  import {
    CREATE_ORDER,
    DELETE_ORDER,
    GET_ORDERS,
    UPDATE_ORDER,
  } from "../queries"
  import debounce from "lodash/debounce"
  import { activeOrder } from "../stores"
  const STATUSES = ["Pending", "Started", "Completed", "Cancelled"]

  export let meta

  const INITIAL_FIELDS = {
    title: "",
    description: "",
    status: "Pending",
  }
  let fields = { ...INITIAL_FIELDS }
  let statuses = []

  const orders = query(GET_ORDERS)
  const createOrder = mutation(CREATE_ORDER)
  const updateOrder = mutation(UPDATE_ORDER)
  const deleteOrder = mutation(DELETE_ORDER)

  async function copyOrder() {
    const { id, __typename, created, status, title, ...orderInput } =
      $activeOrder

    try {
      const res = await createOrder({
        variables: { input: { ...orderInput, title: title + " - copy" } },
      })
      const { createOrder: orderCopy } = res.data
      orders.refetch()
      activeOrder.set(orderCopy)
    } catch (error) {
      console.error("failed to create order", error)
    }
  }

  async function deleteOrderById(id) {
    try {
      await deleteOrder({ variables: { id } })
      orders.refetch()
      activeOrder.set({})
    } catch (error) {
      console.error("failed to delete order", error)
    }
  }

  const updateField = (key, value) => {
    fields[key] = value
    save(key, value)
  }

  const save = debounce((key, value) => {
    updateOrder({ variables: { id: $activeOrder.id, input: { [key]: value } } })
    orders.refetch()
  }, 300)

  function handleClickOrder(selectedOrder) {
    if ($activeOrder.id === selectedOrder.id) {
      activeOrder.set(INITIAL_FIELDS)
    } else {
      activeOrder.set(selectedOrder)
    }
  }

  const countOccurrences = (arr, val, key) =>
    arr.reduce((a, v) => {
      if (key && val) {
        return v[key] === val ? a + 1 : a
      }
      return v === val ? a + 1 : a
    }, 0)

  $: fields = $activeOrder
  $: {
    if (!!$orders.data) {
      statuses = STATUSES.map((status) => {
        const count = countOccurrences($orders.data.orders, status, "status")
        return { label: status, count }
      })
    }
  }
</script>

<style lang="scss">
  .page-orders {
    display: flex;
    height: 100%;
  }
  .side-panel-left {
    flex-basis: 20%;
    min-width: 200px;
    padding: 1rem;
    border-right: 1px solid #dedede;
    background: #fff;
    z-index: 0;

    :global(a.active) {
      color: black;
      -webkit-text-stroke-width: 1px;
      -webkit-text-stroke-color: black;
    }

    .main-link {
      display: flex;
      color: inherit;
      font-weight: bold;
      font-size: 1.25em;
      padding: 6px 0;
      text-decoration: none;
    }
    .sub-link {
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: inherit;
      padding: 4px 4px 4px 16px;
      text-decoration: none;
    }
  }
  .preview-panel {
    flex-basis: 30%;
    padding: 1rem;
    border-left: 1px solid #dedede;
    background: #fff;
    z-index: 0;

    .form {
      height: 100%;
    }
  }
  .table {
    flex-basis: 100%;
    padding: 0 2rem;
    .orders-table {
      overflow-y: auto;
      height: calc(100vh - 160px);
      padding: 2px;
      &::-webkit-scrollbar {
        width: 12px; /* width of the entire scrollbar */
      }
      &::-webkit-scrollbar-track {
        background: transparent; /* color of the tracking area */
      }
      &::-webkit-scrollbar-thumb {
        background-color: #dedede; /* color of the scroll thumb */
        border-radius: 20px; /* roundness of the scroll thumb */
        border: 4px solid #f7f7f7; /* creates padding around scroll thumb */
      }
    }
  }
  .order {
    display: flex;
    align-items: center;
    height: 80px;
    padding: 0 1rem;
    margin-bottom: 6px;
    background: #fff;
    box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px,
      rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
    outline: 1px solid transparent;
    transition: all 200ms ease-in;
    > * {
      &:first-child {
        width: 5%;
      }
      &:nth-child(2) {
        width: 40%;
      }
      &:nth-child(3) {
        width: 10%;
        min-width: 90px;
      }
      &:nth-child(4) {
        width: 40%;
      }
      &:nth-child(5) {
        width: 5%;
        min-width: 60px;
      }
    }

    &.placeholder {
      opacity: 0.3;
    }

    &.active {
      outline-color: blueviolet;
    }

    h3 {
      width: 200px;
    }
    button {
      margin: 0;
    }

    > * {
      margin-right: 1rem;
    }
  }
</style>

<div class="page-orders">
  <!-- Left side panel -->
  <div class="side-panel-left">
    <a href="/orders" class="main-link">Orders</a>
    {#each statuses as status}
      <a
        href={`/orders/?filter=${status.label}`}
        class="sub-link"
        use:active
        class:active={status.label === meta.query.filter}
        exact
      >
        <span>{status.label}</span>
        <span>({status.count})</span>
      </a>
    {/each}
  </div>

  <!-- Orders table -->
  <div class="table" on:click={() => handleClickOrder(INITIAL_FIELDS)}>
    <h1>Orders</h1>
    {#if $orders.loading}
      <div>Loading...</div>
    {/if}
    {#if $orders.error}
      <div>ERROR: {$orders.error.message}</div>
    {/if}
    <div class="orders-table custom-scrollbar" transition:fade>
      {#if !$orders.loading}
        {#each $orders.data.orders as order, index (order)}
          <div
            class="order"
            class:active={order.id === $activeOrder.id}
            transition:slide|local
            on:click|stopPropagation={() => handleClickOrder(order)}
          >
            <p>{index + 1}</p>
            <h3>{order.title}</h3>
            <p>
              {order.created
                ? format(new Date(parseInt(order.created)), "yyyy-MM-dd")
                : ""}
            </p>
            <p>{order.description || ""}</p>
            <p>{order.status || ""}</p>
          </div>
        {/each}
      {/if}
    </div>
  </div>

  <!-- Right side panel -->
  <aside class="preview-panel">
    {#if $activeOrder.id}
      <div transition:fade={{ duration: 150 }}>
        <button on:click={copyOrder}>Copy</button>
        <button
          on:click={() => deleteOrderById($activeOrder.id)}
          style="color: #fff; background: salmon;">Delete</button
        >
        <label for="order-title">Project name</label>
        <input
          id="order-title"
          type="text"
          bind:value={fields.title}
          on:input={(e) => updateField("title", e.target.value)}
        />
        <label for="order-description">Description</label>
        <textarea
          id="order-description"
          bind:value={fields.description}
          on:input={(e) => updateField("description", e.target.value)}
          rows="6"
        />
        <select
          bind:value={fields.status}
          on:change={() => updateField("status", fields.status)}
        >
          {#each STATUSES as status}
            <option value={status}>
              {status}
            </option>
          {/each}
        </select>
      </div>
    {/if}
  </aside>
</div>
