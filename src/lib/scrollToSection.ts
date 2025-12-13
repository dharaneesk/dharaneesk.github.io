export function scrollToSection(id: string, offset: number = 80) {
  const element = document.getElementById(id);
  if (element) {
    window.scrollTo({
      top: element.offsetTop - offset,
      behavior: 'smooth',
    });
  }
}
