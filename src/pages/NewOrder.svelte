<script>
  import { fade } from "svelte/transition"
  import OrderForm from "../components/OrderForm.svelte"
</script>

<div class="page" transition:fade={{ duration: 100 }}>
  <div class="modal">
    <div class="form-container">
      <h1>New Order</h1>
      <OrderForm />
    </div>
    <div class="file-container">
      <h1>Files</h1>
    </div>
  </div>
</div>

<style lang="scss">
  .page {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.4);
    padding: 2rem;

    .modal {
      display: flex;
      background: #fff;
      height: 100%;
      padding: 2rem;
      .form-container {
        flex-basis: 40%;
        padding-right: 2rem;
        border-right: 1px solid #dedede;
        max-width: 500px;
      }
      .file-container {
        padding-left: 2rem;
      }
    }
  }
</style>
