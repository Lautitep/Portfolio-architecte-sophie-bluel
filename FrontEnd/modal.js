let modal = null
const editProjects = document.querySelector(".edit-projects");

var displayProjectsToEdit = (function() {
  var executed = false;
  return function() {
      if (!executed) {
          executed = true;
          fetch('http://localhost:5678/api/works')
          .then(function(res) {
            if (res.ok) {
              return res.json();
            }
          })
          .then(function(data) {
            data.forEach((project) => {
              const projects = `<div id="${project.id}" class="edit-project">
                <img crossorigin="anonymous" src="${project.imageUrl}" alt="${project.title}">
                <a>éditer</a>
                <button class="btn-delete"><i id="${project.id}" class="fa-solid fa-trash-can"></i></button>
                </div>`
              editProjects.insertAdjacentHTML("beforeend", projects)
            });
            const buttonsToDelete = document.querySelectorAll(".btn-delete");
            addEventListeners(buttonsToDelete)
          })
          .catch(function(err) {
            console.error('Error:', err)
          });
      }
  };
})();

const addEventListeners = (buttonsToDelete) => {
  buttonsToDelete.forEach((button) => {
    button.addEventListener('click', (e) => {
      const buttonId = e.target.id
      deleteProject(buttonId)
    })
  });
}

const openModal = (e) => {
  e.preventDefault()
  const target = document.querySelector(e.target.getAttribute('href'))
  target.style.display = null
  modal = target
  modal.addEventListener('click', closeModal)
  modal.querySelector('.js-modal-close').addEventListener('click', closeModal)
  modal.querySelector('.js-modal-stop').addEventListener('click', stopPropagation)
  displayProjectsToEdit()
}

const openAddModal = (e) => {
  modal.style.display = 'none'
  e.preventDefault()
  const target = document.querySelector(e.target.getAttribute('href'))
  target.style.display = null
  modal = target
  modal.addEventListener('click', closeModal)
  modal.querySelector('.js-modal-close').addEventListener('click', closeModal)
  modal.querySelector('.js-modal-stop').addEventListener('click', stopPropagation)
}

const closeModal = (e) => {
  if (modal === null) return
  e.preventDefault()
  modal.style.display = 'none'
  modal.removeEventListener('click', closeModal)
  modal.querySelector('.js-modal-close').removeEventListener('click', closeModal)
  modal.querySelector('.js-modal-stop').removeEventListener('click', stopPropagation)
  modal = null
}

const stopPropagation = (e) => {
  e.stopPropagation()
}

const deleteProject = (id) => {
  const token = sessionStorage.getItem('token')
  fetch(`http://localhost:5678/api/works/${id}`, {
    method: 'DELETE',
    headers: {
      'accept': '*/*',
      'Authorization': `Bearer ${token}`
    },
  })
    .then((res) => {
      if (res.ok) {
        console.log("Project deleted")
        document.getElementById(id).remove()
        displayProjectsToEdit()
      } else {
        console.log("Project not deleted")
      }
    })
    .catch((err) => console.log(err))
}

const addProject = (e) => {
  e.preventDefault()
  const token = sessionStorage.getItem('token');
  const formData = new FormData()
  formData.append('image', document.getElementById('image').files[0], document.getElementById('image').files[0].name)
  formData.append('title', document.querySelector('input[name="title"]').value)
  formData.append('category', document.querySelector('select[name="category"]').value)
  console.log(formData.get('image'))
  console.log(formData.get('title'))
  console.log(formData.get('category'))

  fetch('http://localhost:5678/api/works', {
    method: 'POST',
    headers: {
    'accept': 'application/json',
    'Authorization': `Bearer ${token}`,
    },
    body: formData
    })
    .then(function(res) {
      if (res.ok) {
        window.location.reload()
        return res.json();
      }
    })
    .catch((err) => console.log(err))
}

const file = document.querySelector("input[type='file']");
const parentDiv = document.querySelector(".parent-div");

file.addEventListener("change", (e) => {
  let file = e.target.files[0];
  let reader = new FileReader();

  reader.onload = function() {
    const newImg = document.createElement('img');
    newImg.src = reader.result;
    newImg.classList.add("img-target");
    const children = parentDiv.children;
    for (let i = 0; i < children.length; i++) {
      children[i].style.display = "none";
    }
    parentDiv.appendChild(newImg);
  }
  reader.readAsDataURL(file);
});

document.querySelector('.js-modal').addEventListener('click', openModal)
document.querySelector('.js-modal-add-project').addEventListener('click', openAddModal)
document.getElementById('add-project').addEventListener("submit", addProject);
