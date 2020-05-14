document.addEventListener("DOMContentLoaded", () => {
  const $btns = document.querySelectorAll('.btn-remove')
  if ($btns.length) {
    $btns.forEach((item) => {
      item.addEventListener('click', (event) => {
        const id = event.target.dataset.id
        fetch('/card/remove/' + id, {
          method: "delete"
        })
          .then(response => response.json())
          .then(data => {
            let rowHtml = data.courses.map(c => {
              return `<tr><td><a href="/courses/${c.id}">Товар</a></td>
              <td>${c.count}</td>
              <td><button data-id="${c.id}" class="btn btn-primary btn-remove">Удалить</button></td></tr>`
            }).join()
            document.querySelector('#row').innerHTML = rowHtml
            document.querySelector('#price').textContent = data.price
            window.location.reload()
          })
      })
    })
  }
})