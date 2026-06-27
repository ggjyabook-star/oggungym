document.addEventListener('DOMContentLoaded', () => {
  /* ==========================================================================
     NAV BAR SCROLL EFFECT
     ========================================================================== */
  const header = document.querySelector('.header');
  
  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll);
  // Run once on load in case page is loaded scrolled
  handleScroll();

  /* ==========================================================================
     MOBILE NAVIGATION MENU
     ========================================================================== */
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      
      // Change icon between burger and close
      const icon = navToggle.querySelector('i');
      if (icon) {
        if (navMenu.classList.contains('open')) {
          icon.className = 'fas fa-times';
        } else {
          icon.className = 'fas fa-bars';
        }
      }
    });

    // Close menu when a link is clicked
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        const icon = navToggle.querySelector('i');
        if (icon) {
          icon.className = 'fas fa-bars';
        }
      });
    });
  }

  /* ==========================================================================
     INTERSECTION OBSERVER FOR SCROLL REVEAL
     ========================================================================== */
  const revealElements = document.querySelectorAll('.reveal');
  
  if ('IntersectionObserver' in window && revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          // Once revealed, no need to track again
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback if IntersectionObserver is not supported
    revealElements.forEach(el => el.classList.add('active'));
  }

  /* ==========================================================================
     BMI CALCULATOR
     ========================================================================== */
  const bmiForm = document.getElementById('bmi-form');
  const calcResult = document.getElementById('calc-result');
  const bmiValSpan = document.getElementById('bmi-val');
  const bmiStatusDiv = document.getElementById('bmi-status');
  const bmiAdviceP = document.getElementById('bmi-advice');

  if (bmiForm) {
    bmiForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const height = parseFloat(document.getElementById('bmi-height').value);
      const weight = parseFloat(document.getElementById('bmi-weight').value);
      
      if (!height || !weight || height <= 0 || weight <= 0) {
        alert('Por favor introduce valores de peso y altura válidos.');
        return;
      }

      // Calculate BMI
      const heightInMeters = height / 100;
      const bmi = weight / (heightInMeters * heightInMeters);
      const bmiRounded = bmi.toFixed(1);

      // Display result value
      bmiValSpan.textContent = bmiRounded;

      // Determine classification and advice
      let status = '';
      let advice = '';
      let statusColor = '';
      let statusBg = '';

      if (bmi < 18.5) {
        status = 'Bajo Peso';
        statusBg = 'rgba(59, 130, 246, 0.15)'; // Blue
        statusColor = '#60a5fa';
        advice = 'Recomendamos un plan enfocado en hipertrofia y ganancia de masa muscular, acompañado de un plan de nutrición superávit calórico. ¡En Oggun Gym tenemos la zona de peso libre ideal para ti!';
      } else if (bmi >= 18.5 && bmi < 25) {
        status = 'Peso Normal / Saludable';
        statusBg = 'rgba(16, 185, 129, 0.15)'; // Green
        statusColor = '#34d399';
        advice = '¡Excelente! Estás en un rango saludable. Mantente en forma combinando fuerza y acondicionamiento metabólico con nuestro plan de entrenamiento funcional y clases de combate.';
      } else if (bmi >= 25 && bmi < 30) {
        status = 'Sobrepeso';
        statusBg = 'rgba(245, 158, 11, 0.15)'; // Orange
        statusColor = '#fbbf24';
        advice = 'Un plan mixto de entrenamiento de fuerza de alta intensidad (HIIT) y déficit calórico estructurado te ayudará a recomponer tu cuerpo y perder grasa de forma eficiente.';
      } else {
        status = 'Obesidad';
        statusBg = 'rgba(239, 68, 68, 0.15)'; // Red
        statusColor = '#f87171';
        advice = 'Te sugerimos un entrenamiento de fuerza progresivo de bajo impacto articular guiado y cardio metabólico moderado. La constancia forjará tu nueva versión paso a paso de forma segura.';
      }

      // Apply styles and content
      bmiStatusDiv.textContent = status;
      bmiStatusDiv.style.backgroundColor = statusBg;
      bmiStatusDiv.style.borderColor = statusColor;
      bmiStatusDiv.style.color = statusColor;
      bmiAdviceP.textContent = advice;

      // Show result card with smooth appearance
      calcResult.style.display = 'block';
      calcResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  }

  /* ==========================================================================
     CONTACT FORM (MOCKED SUBMISSION)
     ========================================================================== */
  const contactForm = document.getElementById('contact-form');
  
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      
      // Visual feedback loading state
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
      
      setTimeout(() => {
        // Reset form
        contactForm.reset();
        
        // Show success state
        submitBtn.innerHTML = '<i class="fas fa-check"></i> ¡Mensaje Enviado!';
        submitBtn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
        
        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
          submitBtn.style.background = '';
        }, 3000);
      }, 1500);
    });
  }

  /* ==========================================================================
     LOCAL STORAGE & CART STATE MANAGEMENT
     ========================================================================== */
  let cart = [];

  const loadCart = () => {
    try {
      const savedCart = localStorage.getItem('oggun_gym_cart');
      if (savedCart) {
        cart = JSON.parse(savedCart);
      }
    } catch (e) {
      console.error('Error loading cart from localStorage', e);
      cart = [];
    }
  };

  const saveCart = () => {
    localStorage.setItem('oggun_gym_cart', JSON.stringify(cart));
    updateCartBadge();
  };

  const updateCartBadge = () => {
    const cartCountSpans = document.querySelectorAll('.cart-count');
    const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountSpans.forEach(span => {
      span.textContent = totalQty;
      // Add a scale animation when badge changes
      span.style.transform = 'scale(1.2)';
      setTimeout(() => {
        span.style.transform = 'scale(1)';
      }, 200);
    });
  };

  // Load cart state on page start
  loadCart();
  updateCartBadge();

  /* ==========================================================================
     TOAST NOTIFICATIONS CREATION
     ========================================================================== */
  const showToast = (message, type = 'success') => {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    
    let iconClass = 'fas fa-info-circle';
    let iconColorClass = '';
    if (type === 'success') {
      iconClass = 'fas fa-check-circle';
      iconColorClass = 'success';
    } else if (type === 'remove') {
      iconClass = 'fas fa-trash-alt';
    }

    toast.innerHTML = `
      <i class="${iconClass} toast-icon ${iconColorClass}"></i>
      <span class="toast-message">${message}</span>
    `;

    toastContainer.appendChild(toast);

    // Remove toast after animation finishes (3 seconds)
    setTimeout(() => {
      toast.remove();
    }, 3000);
  };

  /* ==========================================================================
     CATALOG PAGE INTERACTIONS (Only executes if catalog exists)
     ========================================================================== */
  const catalogGrid = document.getElementById('catalog-grid');
  
  if (catalogGrid) {
    const searchInput = document.getElementById('search-input');
    const filterTabs = document.querySelectorAll('.filter-tab');
    const cartDrawer = document.getElementById('cart-drawer');
    const openCartBtn = document.getElementById('open-cart-btn');
    const closeCartBtn = document.getElementById('close-cart-btn');
    const cartDrawerOverlay = document.getElementById('cart-drawer-overlay');
    const cartDrawerBody = document.getElementById('cart-drawer-body');
    const checkoutBtn = document.getElementById('checkout-btn');
    
    const cartClassesCount = document.getElementById('cart-classes-count');
    const cartItemsCount = document.getElementById('cart-items-count');
    const cartSubtotal = document.getElementById('cart-subtotal');
    
    const detailModal = document.getElementById('detail-modal');
    const modalBody = document.getElementById('modal-body');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const modalOverlay = document.getElementById('modal-overlay');

    // Item Detailed Data for Modals
    const itemsData = {
      'clase-1': {
        title: "Fuerza Oggun (Hipertrofia)",
        category: "Clase de Élite",
        desc: "Entrenamiento enfocado en levantamiento de pesas pesado, perfeccionando la técnica en sentadillas, peso muerto y press de banca.",
        details: [
          "Duración: 60 minutos de pura intensidad.",
          "Enfoque: Ganancia muscular, fuerza máxima y biomecánica correcta.",
          "Nivel requerido: Intermedio a Avanzado.",
          "Horarios: Lun-Mie-Vie a las 7:00 AM, 6:00 PM y 8:00 PM.",
          "Entrenador: Eduardo Ayala (Especialista en Biomecánica y Fuerza)."
        ],
        actionText: "Reservar Clase",
        actionClass: "add-reserve-btn",
        type: "clase"
      },
      'clase-2': {
        title: "Forja CrossFit",
        category: "Intensidad Extrema",
        desc: "WODs explosivos que combinan levantamiento olímpico de pesas, gimnasia y cardio metabólico para una condición atlética insuperable.",
        details: [
          "Duración: 50 minutos.",
          "Enfoque: Capacidad aeróbica, fuerza explosiva y agilidad.",
          "Nivel requerido: Todos los niveles (ejercicios escalables).",
          "Horarios: Lunes a Sábados a las 6:00 AM, 9:00 AM, 7:00 PM.",
          "Entrenador: Alan Ayala (Coach de Acondicionamiento Físico)."
        ],
        actionText: "Reservar Clase",
        actionClass: "add-reserve-btn",
        type: "clase"
      },
      'clase-3': {
        title: "Garras de Acero (Boxeo/MMA)",
        category: "Combate & Cardio",
        desc: "Aprende técnicas reales de golpeo, esquiva y juego de piernas. Libera todo el estrés mientras tonificas y quemas calorías en el saco.",
        details: [
          "Duración: 60 minutos.",
          "Enfoque: Defensa personal, coordinación, quema calórica extrema.",
          "Equipamiento: Requiere guantes y vendas (disponibles en recepción).",
          "Horarios: Mar-Jue a las 8:00 AM y 7:00 PM. Sábados 10:00 AM.",
          "Entrenador: Alan Ayala (Coach de Acondicionamiento Físico)."
        ],
        actionText: "Reservar Clase",
        actionClass: "add-reserve-btn",
        type: "clase"
      },
      'clase-4': {
        title: "Ciclo de Fuego (Spinning)",
        category: "Cardio Ritmo",
        desc: "Clases de ciclismo indoor estructuradas por intervalos con música épica y luces LED para maximizar el consumo calórico.",
        details: [
          "Duración: 45 minutos.",
          "Enfoque: Resistencia cardiovascular, tonificación de piernas y core.",
          "Nivel requerido: Principiante a Avanzado.",
          "Horarios: Lunes a Viernes a las 6:00 AM, 7:00 PM y 8:00 PM.",
          "Entrenador: Eduardo Ayala (Especialista en Biomecánica y Fuerza)."
        ],
        actionText: "Reservar Clase",
        actionClass: "add-reserve-btn",
        type: "clase"
      },
      'suple-1': {
        title: "Proteína Oggun Whey (2kg)",
        category: "Suplemento Premium",
        desc: "Proteína de suero de leche aislada de máxima pureza, libre de azúcar y baja en carbohidratos. Sabor Vainilla Bourbon.",
        details: [
          "Porciones: 66 servicios por envase.",
          "Fórmula: 25g de aislado de proteína, 5.5g de BCAAs y 0g azúcar por scoop.",
          "Objetivo: Acelera la recuperación y favorece el desarrollo de masa muscular limpia.",
          "Cómo usar: Mezclar 1 scoop con 250ml de agua fría post-entrenamiento."
        ],
        price: 54.99,
        actionText: "Añadir al Carrito",
        actionClass: "add-cart-btn",
        type: "suplemento"
      },
      'suple-2': {
        title: "Creatina Monohidratada (300g)",
        category: "Fuerza & Potencia",
        desc: "Creatina micronizada pura que incrementa tu potencia en ejercicios explosivos y acelera de forma notable la hipertrofia muscular.",
        details: [
          "Porciones: 60 servicios (5g por scoop).",
          "Calidad: Sello Creapure® para máxima pureza y solubilidad.",
          "Objetivo: Aumento de la síntesis de ATP celular, mayor volumen celular y fuerza.",
          "Cómo usar: Tomar 5g diarios mezclados con agua o jugo, de preferencia post-entreno."
        ],
        price: 29.99,
        actionText: "Añadir al Carrito",
        actionClass: "add-cart-btn",
        type: "suplemento"
      },
      'suple-3': {
        title: "Pre-Entreno Fuego de Oggun",
        category: "Energía Explosiva",
        desc: "Fórmula extrema cargada con beta-alanina, cafeína y citrulina para darte una energía desbordante y máxima congestión muscular.",
        details: [
          "Porciones: 30 servicios.",
          "Ingredientes Clave: 3.2g Beta-Alanina, 6g L-Citrulina, 300mg Cafeína anhidra.",
          "Objetivo: Foco mental láser, retraso de la fatiga muscular y vasodilatación masiva.",
          "Advertencia: Alta concentración de estimulantes. Evaluar tolerancia con medio scoop."
        ],
        price: 34.99,
        actionText: "Añadir al Carrito",
        actionClass: "add-cart-btn",
        type: "suplemento"
      },
      'suple-4': {
        title: "Shaker Térmico de Acero",
        category: "Accesorios de Élite",
        desc: "Mezclador térmico de acero inoxidable con doble pared aislante. Mantiene tus bebidas heladas hasta por 12 horas. Hermético.",
        details: [
          "Capacidad: 750 ml (25 oz) con marcas de medida internas.",
          "Material: Acero inoxidable de grado alimentario 18/8 libre de BPA.",
          "Características: Tapa de rosca a prueba de fugas y asa de transporte plegable.",
          "Limpieza: Apto para lavavajillas, no retiene olores metálicos."
        ],
        price: 19.99,
        actionText: "Añadir al Carrito",
        actionClass: "add-cart-btn",
        type: "suplemento"
      },
      'equip-1': {
        title: "Jaula de Potencia (Power Rack)",
        category: "Equipamiento de Élite",
        desc: "Jaula definitiva para levantamientos pesados de sentadilla y press, fabricada en acero estructural de calibre 11 super reforzado.",
        details: [
          "Capacidad de Carga: Certificada y probada para soportar hasta 500 kg.",
          "Accesorios: Incluye J-Cups acolchados, barras de seguridad y agarre multi-agarre para dominadas.",
          "Ubicación: Zona de Peso Libre Principal.",
          "Normas: Siempre usar soportes de seguridad y solicitar asistencia para pesos máximos."
        ],
        actionText: "Ver Equipos",
        actionClass: "view-equip-btn",
        type: "equipamiento"
      },
      'equip-2': {
        title: "Poleas Convergentes de Élite",
        category: "Musculación Guiada",
        desc: "Estación biomecánica de polea dual regulable de alta gama para trabajar todos los ángulos musculares con tensión constante.",
        details: [
          "Pila de Peso: Dos columnas independientes de 100 kg cada una.",
          "Ajustabilidad: Vertical en 20 posiciones y poleas giratorias de 180°.",
          "Accesorios: Disponible con agarre de estribo, cuerda de tríceps y barra recta.",
          "Ubicación: Zona de Fuerza Integrada."
        ],
        actionText: "Ver Equipos",
        actionClass: "view-equip-btn",
        type: "equipamiento"
      }
    };

    /* -----------------------------------------
       1. Filtering & Search Logic
       ----------------------------------------- */
    const filterItems = () => {
      const searchTerm = searchInput.value.toLowerCase().trim();
      const activeFilter = document.querySelector('.filter-tab.active').getAttribute('data-filter');
      const cards = catalogGrid.querySelectorAll('.catalog-card');

      cards.forEach(card => {
        const category = card.getAttribute('data-category');
        const title = card.querySelector('.card-title').textContent.toLowerCase();
        const desc = card.querySelector('.card-desc').textContent.toLowerCase();
        
        const matchesCategory = (activeFilter === 'all' || category === activeFilter);
        const matchesSearch = (title.includes(searchTerm) || desc.includes(searchTerm));

        if (matchesCategory && matchesSearch) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    };

    // Event listener for search
    searchInput.addEventListener('input', filterItems);

    // Event listeners for filter tabs
    filterTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        filterTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        filterItems();
      });
    });

    /* -----------------------------------------
       2. Cart Drawer Toggle
       ----------------------------------------- */
    const openCart = () => {
      cartDrawer.classList.add('open');
      document.body.style.overflow = 'hidden'; // Lock background scroll
      renderCart();
    };

    const closeCart = () => {
      cartDrawer.classList.remove('open');
      document.body.style.overflow = ''; // Unlock scroll
    };

    openCartBtn.addEventListener('click', openCart);
    closeCartBtn.addEventListener('click', closeCart);
    cartDrawerOverlay.addEventListener('click', closeCart);

    // Link inside empty state
    const emptyStateLink = document.querySelector('.close-cart-link');
    if (emptyStateLink) {
      emptyStateLink.addEventListener('click', (e) => {
        e.preventDefault();
        closeCart();
      });
    }

    /* -----------------------------------------
       3. Drawer Cart Operations
       ----------------------------------------- */
    const addToCart = (id, name, price, type) => {
      const existingItem = cart.find(item => item.id === id);
      
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({
          id,
          name,
          price: parseFloat(price) || 0,
          type,
          quantity: 1
        });
      }

      saveCart();
      
      const categoryMsg = type === 'clase' ? 'Clase reservada' : 'Suplemento añadido';
      showToast(`¡${name}! ${categoryMsg} con éxito.`, 'success');
      
      // Update drawer if open
      if (cartDrawer.classList.contains('open')) {
        renderCart();
      }
    };

    const removeFromCart = (id) => {
      const itemIndex = cart.findIndex(item => item.id === id);
      if (itemIndex > -1) {
        const itemName = cart[itemIndex].name;
        cart.splice(itemIndex, 1);
        saveCart();
        showToast(`Se eliminó "${itemName}" del carrito.`, 'remove');
        renderCart();
      }
    };

    const updateQty = (id, change) => {
      const item = cart.find(item => item.id === id);
      if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
          removeFromCart(id);
        } else {
          saveCart();
          renderCart();
        }
      }
    };

    const renderCart = () => {
      // Clear drawer body except empty state template
      const items = cart.filter(item => item.quantity > 0);
      
      if (items.length === 0) {
        cartDrawerBody.innerHTML = `
          <div class="cart-empty-state">
            <i class="fas fa-box-open"></i>
            <p>Tu carrito está vacío. ¡Empieza a forjar tus metas reservando clases o añadiendo suplementación!</p>
            <a href="#" class="btn btn-primary close-cart-link">Explorar Catálogo</a>
          </div>
        `;
        // Re-bind click event to close cart link
        cartDrawerBody.querySelector('.close-cart-link').addEventListener('click', (e) => {
          e.preventDefault();
          closeCart();
        });
        
        cartClassesCount.textContent = '0';
        cartItemsCount.textContent = '0';
        cartSubtotal.textContent = '$0.00';
        return;
      }

      cartDrawerBody.innerHTML = '';
      let classesCount = 0;
      let supplementsCount = 0;
      let subtotalSum = 0;

      items.forEach(item => {
        const itemHtml = document.createElement('div');
        itemHtml.className = 'cart-item';
        
        const isClase = item.type === 'clase';
        const icon = isClase ? '<i class="fas fa-calendar-alt"></i>' : '<i class="fas fa-prescription-bottle"></i>';
        const metaText = isClase ? 'Reserva de Clase' : 'Suplemento';
        const priceDisplay = isClase ? 'Incluido en Membresía' : `$${(item.price * item.quantity).toFixed(2)}`;
        
        if (isClase) {
          classesCount += item.quantity;
        } else {
          supplementsCount += item.quantity;
          subtotalSum += item.price * item.quantity;
        }

        itemHtml.innerHTML = `
          <div class="cart-item-icon">${icon}</div>
          <div class="cart-item-details">
            <h4 class="cart-item-title">${item.name}</h4>
            <div class="cart-item-meta">
              <span>${metaText}</span>
            </div>
            <div class="cart-item-price">${priceDisplay}</div>
          </div>
          <div class="cart-item-controls">
            <div class="cart-item-qty">
              <button class="qty-btn dec-qty" data-id="${item.id}"><i class="fas fa-minus"></i></button>
              <span class="qty-num">${item.quantity}</span>
              <button class="qty-btn inc-qty" data-id="${item.id}"><i class="fas fa-plus"></i></button>
            </div>
            <button class="cart-item-remove" data-id="${item.id}"><i class="fas fa-trash-alt"></i></button>
          </div>
        `;

        cartDrawerBody.appendChild(itemHtml);
      });

      // Bind controls events
      cartDrawerBody.querySelectorAll('.dec-qty').forEach(btn => {
        btn.addEventListener('click', () => updateQty(btn.getAttribute('data-id'), -1));
      });
      cartDrawerBody.querySelectorAll('.inc-qty').forEach(btn => {
        btn.addEventListener('click', () => updateQty(btn.getAttribute('data-id'), 1));
      });
      cartDrawerBody.querySelectorAll('.cart-item-remove').forEach(btn => {
        btn.addEventListener('click', () => removeFromCart(btn.getAttribute('data-id')));
      });

      // Update counters
      cartClassesCount.textContent = classesCount;
      cartItemsCount.textContent = supplementsCount;
      cartSubtotal.textContent = `$${subtotalSum.toFixed(2)}`;
    };

    // Add click listeners to Add buttons on cards
    catalogGrid.addEventListener('click', (e) => {
      const target = e.target;
      
      if (target.classList.contains('add-cart-btn')) {
        const id = target.getAttribute('data-id');
        const name = target.getAttribute('data-name');
        const price = target.getAttribute('data-price');
        const type = target.getAttribute('data-type');
        addToCart(id, name, price, type);
      }

      if (target.classList.contains('add-reserve-btn')) {
        const id = target.getAttribute('data-id');
        const name = target.getAttribute('data-name');
        const type = target.getAttribute('data-type');
        addToCart(id, name, 0, type); // classes are 0 price mockup
      }
    });

    /* -----------------------------------------
       4. Details Modal Logic
       ----------------------------------------- */
    const openModal = (id) => {
      const data = itemsData[id];
      if (!data) return;

      let sectionTitle = data.type === 'clase' ? 'Detalles de la Clase' : (data.type === 'suplemento' ? 'Ficha Técnica' : 'Especificaciones');
      let pointsHtml = data.details.map(pt => `<li><i class="fas fa-circle-chevron-right"></i> ${pt}</li>`).join('');
      let priceHtml = data.price ? `<div class="modal-item-price">$${data.price}</div>` : `<div class="modal-item-price" style="font-size: 1.1rem; color: var(--text-muted);">Incluido en Planes</div>`;
      
      let actionBtnHtml = '';
      if (data.type === 'clase') {
        actionBtnHtml = `<button class="btn btn-primary modal-action-btn add-reserve-btn" data-id="${id}" data-name="${data.title}" data-type="clase">Reservar Clase</button>`;
      } else if (data.type === 'suplemento') {
        actionBtnHtml = `<button class="btn btn-primary modal-action-btn add-cart-btn" data-id="${id}" data-name="${data.title}" data-price="${data.price}" data-type="suplemento">Añadir al Carrito</button>`;
      } else {
        actionBtnHtml = `<a href="index.html#contacto" class="btn btn-primary modal-action-btn">Preguntar en Recepción</a>`;
      }

      modalBody.innerHTML = `
        <span class="modal-item-badge">${data.category}</span>
        <h2 class="modal-item-title">${data.title}</h2>
        <p class="modal-item-desc">${data.desc}</p>
        
        <div class="modal-item-section">
          <h3 class="modal-item-section-title">${sectionTitle}</h3>
          <ul class="modal-item-list">
            ${pointsHtml}
          </ul>
        </div>
        
        <div class="modal-item-footer">
          ${priceHtml}
          ${actionBtnHtml}
        </div>
      `;

      detailModal.classList.add('open');
      document.body.style.overflow = 'hidden';

      // Re-bind actions inside modal
      const modalAddCartBtn = modalBody.querySelector('.add-cart-btn');
      if (modalAddCartBtn) {
        modalAddCartBtn.addEventListener('click', () => {
          addToCart(id, data.title, data.price, 'suplemento');
          closeModal();
        });
      }

      const modalAddReserveBtn = modalBody.querySelector('.add-reserve-btn');
      if (modalAddReserveBtn) {
        modalAddReserveBtn.addEventListener('click', () => {
          addToCart(id, data.title, 0, 'clase');
          closeModal();
        });
      }
    };

    const closeModal = () => {
      detailModal.classList.remove('open');
      // If cart drawer is also closed, unlock scrolling
      if (!cartDrawer.classList.contains('open')) {
        document.body.style.overflow = '';
      }
    };

    // Open modal click on grid items (Ver Detalles, and card icons/titles if desired)
    catalogGrid.addEventListener('click', (e) => {
      const target = e.target;
      if (target.classList.contains('view-details-btn')) {
        const id = target.getAttribute('data-id');
        openModal(id);
      }
    });

    closeModalBtn.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', closeModal);

    /* -----------------------------------------
       5. Checkout Confirmation (Mock Submit to WhatsApp)
       ----------------------------------------- */
    checkoutBtn.addEventListener('click', () => {
      const items = cart.filter(item => item.quantity > 0);
      if (items.length === 0) return;

      let msg = '¡Hola Oggun Gym! Me interesa confirmar las siguientes reservas y compras:\n\n';
      let classes = items.filter(i => i.type === 'clase');
      let suples = items.filter(i => i.type === 'suplemento');

      if (classes.length > 0) {
        msg += '*Reservas de Clases:*\n';
        classes.forEach(c => {
          msg += `- ${c.name} (Cant: ${c.quantity})\n`;
        });
        msg += '\n';
      }

      if (suples.length > 0) {
        msg += '*Suplementación:*\n';
        let totalVal = 0;
        suples.forEach(s => {
          msg += `- ${s.name} (Cant: ${s.quantity}) - $${(s.price * s.quantity).toFixed(2)}\n`;
          totalVal += s.price * s.quantity;
        });
        msg += `*Subtotal:* $${totalVal.toFixed(2)}\n\n`;
      }

      msg += '¿Me podrían indicar los siguientes pasos para completarlo? ¡Muchas gracias!';
      
      const whatsappUrl = `https://wa.me/525576400882?text=${encodeURIComponent(msg)}`;
      
      // Open in new tab
      window.open(whatsappUrl, '_blank');
      
      // Reset cart
      cart = [];
      saveCart();
      closeCart();
      showToast('¡Redirigiendo a WhatsApp para confirmar! Carrito restablecido.', 'success');
    });
  }

  /* ==========================================================================
     LOGIN MODAL & SESSION MANAGEMENT
     ========================================================================== */
  const loginNavLink = document.getElementById('login-nav-link');
  const logoutNavLink = document.getElementById('logout-nav-link');
  const loginModal = document.getElementById('login-modal');
  const closeLoginBtn = document.getElementById('close-login-btn');
  const loginOverlay = document.getElementById('login-overlay');
  const loginForm = document.getElementById('login-form');

  // Verify and update session links in header on load
  const syncSessionUI = () => {
    try {
      const savedUser = sessionStorage.getItem('oggun_user');
      if (savedUser) {
        const userData = JSON.parse(savedUser);
        if (loginNavLink) {
          loginNavLink.textContent = 'Mi Panel';
          if (userData.role === 'admin') {
            loginNavLink.href = 'dashboard-admin.html';
          } else if (userData.role === 'trainer') {
            loginNavLink.href = 'dashboard-entrenador.html';
          } else {
            loginNavLink.href = 'dashboard-usuario.html';
          }
          // Remove potential click listeners opening modal
          loginNavLink.onclick = null;
        }
        if (logoutNavLink) {
          logoutNavLink.style.display = 'inline-block';
        }
      } else {
        if (loginNavLink) {
          loginNavLink.textContent = 'Iniciar Sesión';
          loginNavLink.href = '#';
        }
        if (logoutNavLink) {
          logoutNavLink.style.display = 'none';
        }
      }
    } catch (e) {
      console.error('Error syncing session UI', e);
    }
  };

  // Run on load
  syncSessionUI();

  // Open Modal logic
  if (loginNavLink) {
    loginNavLink.addEventListener('click', (e) => {
      const savedUser = sessionStorage.getItem('oggun_user');
      if (!savedUser) {
        e.preventDefault();
        if (loginModal) {
          loginModal.classList.add('open');
          document.body.style.overflow = 'hidden';
        }
      }
    });
  }

  // Close Modal logic
  const closeLoginModal = () => {
    if (loginModal) {
      loginModal.classList.remove('open');
      document.body.style.overflow = '';
    }
  };

  if (closeLoginBtn) {
    closeLoginBtn.addEventListener('click', closeLoginModal);
  }
  if (loginOverlay) {
    loginOverlay.addEventListener('click', closeLoginModal);
  }

  // Login Role Tabs Switcher
  const loginTabBtns = document.querySelectorAll('.login-tab-btn');
  const credentialsHint = document.getElementById('login-credentials-hint');
  const emailInput = document.getElementById('login-email');
  const passwordInput = document.getElementById('login-password');

  if (loginTabBtns && loginTabBtns.length > 0) {
    loginTabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Toggle active button style
        loginTabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const role = btn.getAttribute('data-role');
        
        // Update credentials helper hint & autofill credentials
        if (role === 'user') {
          if (credentialsHint) {
            credentialsHint.innerHTML = `<p>Premium: <code style="color: var(--primary-light);">usuario@oggungym.com</code> / <code style="color: var(--primary-light);">usuario123</code></p>`;
          }
          if (emailInput) emailInput.value = 'usuario@oggungym.com';
          if (passwordInput) passwordInput.value = 'usuario123';
        } else if (role === 'trainer') {
          if (credentialsHint) {
            credentialsHint.innerHTML = `<p>Eduardo: <code style="color: var(--primary-light);">eduardo@oggungym.com</code> / <code style="color: var(--primary-light);">eduardo123</code></p>
                                         <p style="margin-top: 0.25rem;">Alan: <code style="color: var(--primary-light);">alan@oggungym.com</code> / <code style="color: var(--primary-light);">alan123</code></p>`;
          }
          if (emailInput) emailInput.value = 'eduardo@oggungym.com';
          if (passwordInput) passwordInput.value = 'eduardo123';
        } else if (role === 'admin') {
          if (credentialsHint) {
            credentialsHint.innerHTML = `<p>Admin: <code style="color: var(--primary-light);">admin@oggungym.com</code> / <code style="color: var(--primary-light);">admin123</code></p>`;
          }
          if (emailInput) emailInput.value = 'admin@oggungym.com';
          if (passwordInput) passwordInput.value = 'admin123';
        }
      });
    });

    // Run first tab click on load to auto-fill
    // but only if fields are empty
    const activeTab = document.querySelector('.login-tab-btn.active');
    if (activeTab && emailInput && emailInput.value === '') {
      activeTab.click();
    }
  }

  // Handle submit
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const email = document.getElementById('login-email').value.trim();
      const password = document.getElementById('login-password').value;

      // Mock Credentials Check
      if (email === 'usuario@oggungym.com' && password === 'usuario123') {
        // User Premium Session
        const sessionData = {
          email: email,
          name: 'Juan Pérez',
          role: 'user'
        };
        sessionStorage.setItem('oggun_user', JSON.stringify(sessionData));
        showToast('¡Acceso concedido! Entrando a la forja...', 'success');
        
        setTimeout(() => {
          window.location.href = 'dashboard-usuario.html';
        }, 1000);

      } else if (email === 'eduardo@oggungym.com' && password === 'eduardo123') {
        // Trainer Eduardo Ayala
        const sessionData = {
          email: email,
          name: 'Eduardo Ayala',
          role: 'trainer'
        };
        sessionStorage.setItem('oggun_user', JSON.stringify(sessionData));
        showToast('¡Acceso Coach concedido! Hola Eduardo.', 'success');

        setTimeout(() => {
          window.location.href = 'dashboard-entrenador.html';
        }, 1000);

      } else if (email === 'alan@oggungym.com' && password === 'alan123') {
        // Trainer Alan Ayala
        const sessionData = {
          email: email,
          name: 'Alan Ayala',
          role: 'trainer'
        };
        sessionStorage.setItem('oggun_user', JSON.stringify(sessionData));
        showToast('¡Acceso Coach concedido! Hola Alan.', 'success');

        setTimeout(() => {
          window.location.href = 'dashboard-entrenador.html';
        }, 1000);

      } else if (email === 'admin@oggungym.com' && password === 'admin123') {
        // Admin Session
        const sessionData = {
          email: email,
          name: 'Staff Oggun',
          role: 'admin'
        };
        sessionStorage.setItem('oggun_user', JSON.stringify(sessionData));
        showToast('¡Acceso Administrativo concedido!', 'success');

        setTimeout(() => {
          window.location.href = 'dashboard-admin.html';
        }, 1000);

      } else {
        // Error Credentials
        showToast('Credenciales incorrectas. Intenta de nuevo.', 'remove');
      }
    });
  }

  // Logout Click
  if (logoutNavLink) {
    logoutNavLink.addEventListener('click', (e) => {
      e.preventDefault();
      sessionStorage.removeItem('oggun_user');
      showToast('Sesión cerrada correctamente. Volviendo al inicio...', 'success');
      
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1000);
    });
  }

  /* ==========================================================================
     TRAINER FEEDBACK SUBMISSION
     ========================================================================== */
  const trainerFeedbackForm = document.getElementById('trainer-feedback-form');
  if (trainerFeedbackForm) {
    trainerFeedbackForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const trainer = document.getElementById('feedback-trainer').value;
      const name = document.getElementById('feedback-name').value.trim();
      const rating = document.getElementById('feedback-rating').value;
      const comment = document.getElementById('feedback-comment').value.trim();

      if (!trainer || !name || !comment) {
        showToast('Por favor completa todos los campos.', 'remove');
        return;
      }

      // Create new comment object
      const newComment = {
        id: Date.now(),
        trainer: trainer,
        user: name,
        rating: parseInt(rating),
        comment: comment,
        date: new Date().toISOString().split('T')[0]
      };

      // Load existing comments from localStorage
      let comments = [];
      try {
        const stored = localStorage.getItem('oggun_trainer_comments');
        if (stored) {
          comments = JSON.parse(stored);
        }
      } catch (err) {
        console.error('Error loading trainer comments', err);
      }

      // Add to array and save
      comments.push(newComment);
      localStorage.setItem('oggun_trainer_comments', JSON.stringify(comments));

      // Show success toast and reset
      showToast('¡Comentario enviado! Solo visible para el administrador.', 'success');
      trainerFeedbackForm.reset();
    });
  }
});

