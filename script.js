/**
 * EDGE MACHINE - Script principal
 * Controles: tema dark/light, menu mobile, scroll to top
 */

document.addEventListener('DOMContentLoaded', function() {
  // =============================================
  // Configuração do Tema Dark/Light
  // =============================================
  const themeToggle = document.getElementById('theme-toggle');
  const htmlElement = document.documentElement;
  
  // Verificar preferência salva ou do sistema
  function getPreferredTheme() {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      return storedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }
  
  // Aplicar tema inicial
  function applyInitialTheme() {
    const preferredTheme = getPreferredTheme();
    htmlElement.setAttribute('data-theme', preferredTheme);
    updateThemeIcon(preferredTheme);
    
    // Se for o primeiro acesso, salva a preferência do sistema
    if (!localStorage.getItem('theme')) {
      localStorage.setItem('theme', preferredTheme);
    }
  }
  
  // Atualizar ícone do botão de tema
  function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector('i');
    icon.classList.toggle('fa-sun', theme === 'light');
    icon.classList.toggle('fa-moon', theme === 'dark');
    
    // Acessibilidade: atualizar aria-label
    themeToggle.setAttribute('aria-label', 
      theme === 'dark' ? 'Alternar para tema claro' : 'Alternar para tema escuro');
  }
  
  // Alternar tema
  function toggleTheme() {
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
    
    // Disparar evento personalizado para outros scripts
    document.dispatchEvent(new CustomEvent('themeChanged', { detail: newTheme }));
  }
  
  // =============================================
  // Menu Mobile
  // =============================================
  const mobileMenuButton = document.querySelector('.mobile-menu-button');
  const mobileMenu = document.querySelector('.mobile-menu');
  
  function toggleMobileMenu() {
    const isExpanded = mobileMenuButton.getAttribute('aria-expanded') === 'true';
    mobileMenuButton.setAttribute('aria-expanded', !isExpanded);
    mobileMenu.classList.toggle('active');
    
    // Bloquear/liberar scroll do body quando menu está aberto
    document.body.style.overflow = !isExpanded ? 'hidden' : '';
  }
  
  function closeMobileMenu() {
    mobileMenuButton.setAttribute('aria-expanded', 'false');
    mobileMenu.classList.remove('active');
    document.body.style.overflow = '';
  }
  
  // =============================================
  // Botão "Voltar ao Topo"
  // =============================================
  const backToTopButton = document.getElementById('back-to-top');
  
  function handleScroll() {
    if (window.pageYOffset > 300) {
      backToTopButton.classList.add('visible');
    } else {
      backToTopButton.classList.remove('visible');
    }
  }
  
  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
  
  // =============================================
  // Event Listeners
  // =============================================
  
  // Tema
  applyInitialTheme();
  themeToggle.addEventListener('click', toggleTheme);
  
  // Observar mudanças na preferência do sistema
  window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', e => {
    if (!localStorage.getItem('theme')) {
      const newTheme = e.matches ? 'light' : 'dark';
      htmlElement.setAttribute('data-theme', newTheme);
      updateThemeIcon(newTheme);
    }
  });
  
  // Menu Mobile
  mobileMenuButton.addEventListener('click', toggleMobileMenu);
  
  // Fechar menu ao clicar em um link
  document.querySelectorAll('.mobile-menu a').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });
  
  // Botão "Voltar ao Topo"
  window.addEventListener('scroll', handleScroll);
  backToTopButton.addEventListener('click', scrollToTop);
  
  // =============================================
  // Outras Funcionalidades
  // =============================================
  
  // Adicionar classe de hover para dispositivos com mouse
  function detectHover() {
    const hasHover = window.matchMedia('(hover: hover)').matches;
    if (hasHover) {
      document.body.classList.add('has-hover');
    }
  }
  
  detectHover();
  window.addEventListener('resize', detectHover);
  
  // Suavizar scroll para âncoras
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });
  
  // Log para debug (pode ser removido em produção)
  console.log('EDGE MACHINE - Script carregado com sucesso');
});