<script>
  import { fly } from "svelte/transition"
  import { bounceInOut, quintInOut, elasticInOut } from "svelte/easing"
  import { spring } from "svelte/motion"
  let name = ""
  let isActive = true

  function customAnimation(node, params) {
    return {
      css: (t) => {
        return `
          transform: scale(${t});
        `
      },
      easing: elasticInOut,
      duration: 2000,
    }
  }

  function drag(node) {
    let x
    let y
    // intial coordinates
    const coords = spring({ x: 0, y: 0 })
    coords.subscribe((current) => {
      node.style.transform = `translate3d(${current.x}px, ${current.y}px, 0)`
    })

    node.addEventListener("mousedown", mousedown)

    function mousedown(event) {
      x = event.clientX
      y = event.clientY

      window.addEventListener("mouseup", mouseup)
      window.addEventListener("mousemove", mousemove)
    }

    function mouseup() {
      window.removeEventListener("mouseup", mouseup)
      window.removeEventListener("mousemove", mousemove)

      coords.update(() => {
        return { x: 0, y: 0 }
      })

      // custom event
      node.dispatchEvent(
        new CustomEvent("dragstop", {
          detail: {
            x,
            y,
          },
        })
      )

      // x = 0
      // y = 0
    }

    function mousemove(event) {
      let deltaX = event.clientX - x
      let deltaY = event.clientY - y

      x = event.clientX
      y = event.clientY

      coords.update((current) => {
        return {
          x: current.x + deltaX,
          y: current.y + deltaY,
        }
      })
    }
  }
</script>

<div class="container">
  <h1>Animation in Svelte</h1>

  <button on:click={() => (isActive = !isActive)}>
    {#if isActive}
      Hide Box
    {:else}
      Show box
    {/if}
  </button>
  {#if isActive}
    <div
      class="box"
      transition:customAnimation
      use:drag
      on:dragstop={(event) => {
        if (event.detail.x > 300) {
          isActive = false
        }
      }}
    />
  {/if}
</div>

<style lang="scss">
  .container {
    text-align: center;
  }
  .box {
    width: 100px;
    height: 100px;
    background: red;
    margin: auto;
  }
</style>
