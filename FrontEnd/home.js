const gallery = document.querySelector(".gallery");

fetch('http://localhost:5678/api/works')
  .then(function(res) {
    if (res.ok) {
      return res.json();
    }
  })
  .then(function(data) {
    console.log(data)
    data.forEach((project) => {
      const projects = `<figure class='${project.categoryId}'>
        <img crossorigin="anonymous" src="${project.imageUrl}" alt="${project.title}">
        <figcaption>${project.title}</figcaption>
      </figure>`
      gallery.insertAdjacentHTML("beforeend", projects)
    });
  })
  .catch(function(err) {
    // Une erreur est survenue
  });

const buttons = document.querySelectorAll(".btn-filter")
buttons.forEach((button) => {
  button.addEventListener('click', (event) => {
    const categorySelected = event.currentTarget.id;
    const categoriesArr = document.querySelectorAll('figure')
    filterCategories(categorySelected, categoriesArr)
  })
})

const filterCategories = (categorySelected, categoriesArr) => {
  categoriesArr.forEach((e) => {
    if (categorySelected === 'all') {
      e.style.display = 'block'
    } else if (e.className === categorySelected) {
      e.style.display = 'block'
    } else {
      e.style.display = 'none'
    }
  })
}

if (sessionStorage.getItem('token') != null) {
    const edit = document.getElementById('edit')
    edit.style.display = null
}
