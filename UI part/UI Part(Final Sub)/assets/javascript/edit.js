const openEditButtons = document.querySelectorAll('[data-edit-target]')
const closeEditButtons = document.querySelectorAll('[data-close-edit-button]')
const editOverlay = document.getElementById('overlay1')

openEditButtons.forEach(button => {
  button.addEventListener('click', () => {
    const edit = document.querySelector(button.dataset.editTarget)
    openEdit(edit)
  })
})

editOverlay.addEventListener('click', () => {
  const edits = document.querySelectorAll('.edit.active')
  edits.forEach(edit => {
    closeEdit(edit)
  })
})

closeEditButtons.forEach(button => {
  button.addEventListener('click', () => {
    const edit = button.closest('.edit')
    closeEdit(edit)
  })
})

function openEdit(edit) {
  if (edit == null) return
  edit.classList.add('active')
  editOverlay.classList.add('active')
}

function closeEdit(edit) {
  if (edit == null) return
  edit.classList.remove('active')
  editOverlay.classList.remove('active')
}