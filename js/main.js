// The script is loaded at the end of <body>, so the HTML is already parsed
// and we don't need to wait for DOMContentLoaded.

// ----- Mobile menu -----
const menuButton = document.querySelector('.hamburger-button');
const mobileMenu = document.getElementById('mobile-menu');

function isMenuOpen() {
  return mobileMenu.classList.contains('active');
}

function setMenuOpen(isOpen) {
  mobileMenu.classList.toggle('active', isOpen);
  menuButton.setAttribute('aria-expanded', isOpen);
  menuButton.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
}

menuButton.addEventListener('click', () => setMenuOpen(!isMenuOpen()));

// Close the menu when one of its links is clicked
mobileMenu.addEventListener('click', (event) => {
  if (event.target.closest('a')) setMenuOpen(false);
});

// Close with Escape and give the focus back to the button
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && isMenuOpen()) {
    setMenuOpen(false);
    menuButton.focus();
  }
});

// Close when clicking anywhere outside the menu
document.addEventListener('click', (event) => {
  const clickedOutside =
    !mobileMenu.contains(event.target) && !menuButton.contains(event.target);

  if (isMenuOpen() && clickedOutside) setMenuOpen(false);
});

// Close if the screen becomes wide enough to show the desktop menu
window.matchMedia('(min-width: 671px)').addEventListener('change', (event) => {
  if (event.matches) setMenuOpen(false);
});

// ----- FAQ accordion -----
const faqContent = document.querySelector('.faq-content');
const faqGroups = Array.from(faqContent.querySelectorAll('.faq-group'));

function setGroupOpen(group, isOpen) {
  const button = group.querySelector('.faq-toggle');
  const body = group.querySelector('.faq-group-body');
  const icon = button.querySelector('i');

  button.setAttribute('aria-expanded', isOpen);
  body.hidden = !isOpen;
  icon.classList.toggle('fa-minus', isOpen);
  icon.classList.toggle('fa-plus', !isOpen);
}

// Answers are visible in the HTML (so they work without JavaScript).
// Here we collapse them and open only the first one.
faqGroups.forEach((group, index) => setGroupOpen(group, index === 0));

// One listener for all questions (event delegation)
faqContent.addEventListener('click', (event) => {
  const button = event.target.closest('.faq-toggle');
  if (!button) return;

  const clickedGroup = button.closest('.faq-group');
  const willOpen = button.getAttribute('aria-expanded') !== 'true';

  // Only one answer is open at a time
  faqGroups.forEach((group) => {
    setGroupOpen(group, group === clickedGroup && willOpen);
  });
});

// ----- FAQ category filter -----
const filterButtons = Array.from(document.querySelectorAll('.faq-menu button'));
const faqStatus = document.getElementById('faq-status');

filterButtons.forEach((filterButton) => {
  filterButton.addEventListener('click', () => {
    const filter = filterButton.dataset.filter;

    filterButtons.forEach((button) => {
      const isActive = button === filterButton;

      button.classList.toggle('active', isActive);
      button.setAttribute('aria-pressed', isActive);
    });

    let visibleCount = 0;

    faqGroups.forEach((group) => {
      const matches = filter === 'all' || group.dataset.category === filter;

      group.hidden = !matches;
      if (matches) visibleCount++;
    });

    // Announced by screen readers (aria-live)
    faqStatus.textContent = `Showing ${visibleCount} questions`;
  });
});
