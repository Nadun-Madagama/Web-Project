document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.d2');
  const sections = document.querySelectorAll('.dept-content');
  const deptGrid = document.querySelector('.d1');
  const backButtons = document.querySelectorAll('.back-btn');

  cards.forEach(function (card) {
          card.addEventListener('dblclick', () => {
              const targetId = card.getAttribute('data-target');
              const targetSection = document.getElementById(targetId);

              
              deptGrid.classList.add('hidden');
              sections.forEach(section => section.classList.add('hidden'));

              
              if (targetSection) {
                  targetSection.classList.remove('hidden');
              }
          });
      });

  backButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      sections.forEach(section => section.classList.add('hidden'));
      deptGrid.classList.remove('hidden');
    });
  });
});