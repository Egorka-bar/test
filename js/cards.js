document.addEventListener('DOMContentLoaded', function() {
  const containerLeft = document.getElementById('cardContainerLeft');
  const cardLeft = document.getElementById('cardLeft');

  if (containerLeft && cardLeft) {
    containerLeft.addEventListener('click', function() {
      cardLeft.classList.toggle('flipped');
    });
  }

  const containerRight = document.getElementById('cardContainerRight');
  const cardRight = document.getElementById('cardRight');

  if (containerRight && cardRight) {
    containerRight.addEventListener('click', function() {
      cardRight.classList.toggle('flipped');
    });
  }
});