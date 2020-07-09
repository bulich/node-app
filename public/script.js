document.addEventListener("DOMContentLoaded", () => {
  const $btns = document.querySelectorAll('.btn-remove')
  if ($btns.length) {
    $btns.forEach((item) => {
      item.addEventListener('click', (event) => {
        const id = event.target.dataset.id
        fetch('/card/remove/' + id, {
          method: "delete"
        })
          .then(response => window.location.reload())
      })
    })
  }
})