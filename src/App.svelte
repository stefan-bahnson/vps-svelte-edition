<script>
  import { Route, active } from "tinro"
  import ApolloClient from "apollo-boost"
  import { setClient } from "svelte-apollo"
  import Orders from "./pages/Orders.svelte"
  import Animations from "./pages/Animations.svelte"
  import NewOrder from "./pages/NewOrder.svelte"
  // props
  export let name

  const client = new ApolloClient({
    uri: "https://zdce41a92-zc4c24716-gtw.qovery.io:4000/graphql",

    onError: ({ networkError, graphQLErrors }) => {
      console.log("graphQLErrors", graphQLErrors)
      console.log("networkError", networkError)
    },
  })

  setClient(client)
</script>

<style lang="scss">
  :global(:root) {
    --color-white: #ffffff;
    --header-height: 60px;
  }
  :global(body) {
    padding: 0;
    margin: 0;
    width: 100%;
    background: #f7f7f7;
  }
  :global(*) {
    box-sizing: border-box;
  }
  :global(input) {
    width: 100%;
    border: none;
    border-bottom: 1px solid #dedede;
    outline: none;
    padding: 2px 0;
    &:focus {
      border-bottom: 1px solid #000;
    }
  }
  :global(textarea) {
    width: 100%;
    resize: none;
  }
  :global(label) {
    margin-bottom: 4px;
    color: #9c9c9c;
  }

  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: var(--header-height);
    padding: 0 1rem;
    border-bottom: 1px solid #dedede;
    background: var(--color-white);
    box-shadow: 0 2px 4px hsla(0, 0, 0, 0.1);
    nav {
      :global(a.active) {
        color: black;
        -webkit-text-stroke-width: 1px;
        -webkit-text-stroke-color: black;
      }
      a {
        text-decoration: none;
        color: inherit;
        padding: 2px 6px;
      }
    }
  }
  main {
    height: calc(100vh - var(--header-height));
    overflow-y: hidden;
  }
</style>

<svelte:head>
  <title>{name}</title>
</svelte:head>

<header>
  <h3>VPS Svelte Edition</h3>
  <nav>
    <a href="/orders/new" class="link" use:active>+ New order</a>
  </nav>
</header>

<main>
  <Route path="/" redirect="/orders"><h1>This is the main page</h1></Route>
  <Route path="/orders/*" let:meta>
    <Orders {meta} />
    <Route path="/new">
      <NewOrder />
    </Route>
  </Route>
  <Route path="/animations">
    <Animations />
  </Route>
  <Route fallback>No page found</Route>
</main>
