// Integração com API do GitHub
document.addEventListener('DOMContentLoaded', function() {
  // Mobile menu toggle
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.querySelector('.nav-menu');
  
  if (hamburger) {
    hamburger.addEventListener('click', function() {
      navMenu.classList.toggle('active');
      hamburger.classList.toggle('active');
    });
  }

  // Smooth scrolling para links internos
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Buscar estatísticas do GitHub
  fetchGitHubStats();
  
  // Animação de números
  animateNumbers();
});

async function fetchGitHubStats() {
  try {
    const response = await fetch('https://api.github.com/repos/jonatasrs/sei');
    const data = await response.json();
    
    // Atualizar estatísticas
    updateStat('github-stars', data.stargazers_count);
    updateStat('github-forks', data.forks_count);
    
    // Buscar contribuidores
    const contributorsResponse = await fetch('https://api.github.com/repos/jonatasrs/sei/contributors');
    const contributors = await contributorsResponse.json();
    updateStat('github-contributors', contributors.length);
    
  } catch (error) {
    console.log('Erro ao buscar dados do GitHub:', error);
    // Valores fallback
    updateStat('github-stars', '50+');
    updateStat('github-forks', '20+');
    updateStat('github-downloads', '10K+');
    updateStat('github-contributors', '15+');
  }
}

function updateStat(elementId, value) {
  const element = document.getElementById(elementId);
  if (element) {
    element.textContent = value;
  }
}

function formatNumber(num) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

function animateNumbers() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const element = entry.target;
        const finalNumber = element.textContent;
        
        if (!isNaN(finalNumber) && finalNumber !== '-') {
          animateNumber(element, 0, parseInt(finalNumber), 2000);
        }
      }
    });
  });

  document.querySelectorAll('.stat-number').forEach(el => {
    observer.observe(el);
  });
}

function animateNumber(element, start, end, duration) {
  const startTime = performance.now();
  
  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    const current = Math.floor(start + (end - start) * easeOutQuart(progress));
    element.textContent = current;
    
    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      element.textContent = end;
    }
  }
  
  requestAnimationFrame(update);
}

function easeOutQuart(t) {
  return 1 - (--t) * t * t * t;
}
