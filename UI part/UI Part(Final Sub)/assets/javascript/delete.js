const openEraseButtons = document.querySelectorAll('[data-erase-target]')
const closeEraseButtons = document.querySelectorAll('[data-close-erase-button]')
const eraseOverlay = document.getElementById('overlay2')

openEraseButtons.forEach(button => {
  button.addEventListener('click', () => {
    const erase = document.querySelector(button.dataset.eraseTarget)
    openErase(erase)
  })
})

eraseOverlay.addEventListener('click', () => {
  const erase1 = document.querySelectorAll('.erase.active')
  erase1.forEach(erase => {
    closeErase(erase)
  })
})

closeEraseButtons.forEach(button => {
  button.addEventListener('click', () => {
    const erase = button.closest('.erase')
    closeErase(erase)
  })
})

function openErase(erase) {
  if (erase == null) return
  erase.classList.add('active')
  eraseOverlay.classList.add('active')
}

function closeErase(erase) {
  if (erase == null) return
  erase.classList.remove('active')
  eraseOverlay.classList.remove('active')
}