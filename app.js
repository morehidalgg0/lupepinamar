/* ==========================================================================
   LUPE PINAMAR - LÓGICA E INTERACTIVIDAD DE LA WEB
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // ----------------------------------------------------
    // 1. Menú Móvil e Interacciones del Header
    // ----------------------------------------------------
    const menuToggle = document.getElementById('menu-toggle');
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const mainHeader = document.getElementById('main-header');

    // Abrir/Cerrar Menú
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('open');
        navbar.classList.toggle('open');
    });

    // Cerrar menú al hacer clic en un enlace
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('open');
            navbar.classList.remove('open');
            
            // Actualizar clase activa en enlaces
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });

    // Efecto de Header achicado en scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            mainHeader.classList.add('scrolled');
        } else {
            mainHeader.classList.remove('scrolled');
        }
        
        // Resaltar sección activa al hacer scroll
        highlightNavOnScroll();
    });

    // Función para actualizar enlace activo según scroll
    function highlightNavOnScroll() {
        const sections = document.querySelectorAll('section');
        let scrollPosition = window.scrollY + 120; // offset del header

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }


    // ----------------------------------------------------
    // 2. Filtro de Tratamientos
    // ----------------------------------------------------
    const filterButtons = document.querySelectorAll('.filter-btn');
    const treatmentCards = document.querySelectorAll('.treatment-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Cambiar botón activo
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            // Filtrar las tarjetas
            treatmentCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filterValue === 'todos' || category === filterValue) {
                    card.style.display = 'flex';
                    // Pequeña animación de entrada
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(10px)';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                        card.style.transition = 'var(--transition-smooth)';
                    }, 50);
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });


    // ----------------------------------------------------
    // 3. Cuestionario de Rutina de Skincare (Quiz)
    // ----------------------------------------------------
    const quizSteps = document.querySelectorAll('.quiz-step');
    const prevButtons = document.querySelectorAll('.quiz-prev-btn');
    const resetQuizBtn = document.getElementById('reset-quiz-btn');
    const sendWhatsappBtn = document.getElementById('send-quiz-whatsapp-btn');
    
    // Estado de las respuestas del usuario
    let quizData = {
        piel: '',
        preocupacion: '',
        rutina: ''
    };

    // Mapeo legible de valores para el mensaje de WhatsApp
    const labelsMap = {
        seca: 'Seca / Tirante',
        mixta_grasa: 'Mixta a Grasa',
        sensible: 'Sensible / Rojeces',
        madura: 'Madura',
        lineas_arrugas: 'Líneas de expresión / Flacidez',
        manchas_tono: 'Manchas / Tono irregular',
        poros_acne: 'Poros abiertos / Puntos negros / Acné',
        deshidratacion_opacidad: 'Deshidratación / Opacidad',
        no_tengo: 'No tengo rutina en casa',
        basica: 'Rutina Básica (limpieza)',
        intermedia: 'Rutina Intermedia (limpieza, hidratación, solar)',
        avanzada: 'Rutina Avanzada / Completa'
    };

    // Manejo de clicks en las opciones del quiz
    const optionButtons = document.querySelectorAll('.quiz-option-btn');
    optionButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const currentStepEl = btn.closest('.quiz-step');
            const stepNumber = parseInt(currentStepEl.getAttribute('data-step'));
            const optionValue = btn.getAttribute('data-value');
            
            // Guardar el valor seleccionado
            if (stepNumber === 1) {
                quizData.piel = optionValue;
            } else if (stepNumber === 2) {
                quizData.preocupacion = optionValue;
            } else if (stepNumber === 3) {
                quizData.rutina = optionValue;
            }

            // Resaltar la opción elegida
            const stepOptions = currentStepEl.querySelectorAll('.quiz-option-btn');
            stepOptions.forEach(opt => opt.classList.remove('selected'));
            btn.classList.add('selected');

            // Pequeña pausa para que la usuaria vea su selección antes de avanzar
            setTimeout(() => {
                goToStep(stepNumber + 1);
            }, 350);
        });
    });

    // Botones de anterior paso
    prevButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const currentStepEl = btn.closest('.quiz-step');
            const stepNumber = parseInt(currentStepEl.getAttribute('data-step'));
            goToStep(stepNumber - 1);
        });
    });

    // Función para navegar por los pasos
    function goToStep(step) {
        quizSteps.forEach(stepEl => {
            stepEl.classList.remove('active');
        });

        if (step === 'result' || step > 3) {
            calculateResults();
            const resultStep = document.querySelector('.quiz-step[data-step="result"]');
            resultStep.classList.add('active');
        } else {
            const nextStepEl = document.querySelector(`.quiz-step[data-step="${step}"]`);
            if (nextStepEl) {
                nextStepEl.classList.add('active');
            }
        }
    }

    // Calcular Resultados del Quiz e imprimir en pantalla
    function calculateResults() {
        const summaryTextEl = document.getElementById('result-summary-text');
        const treatmentsListEl = document.getElementById('recommended-treatments-list');
        const productsTextEl = document.getElementById('recommended-products-text');

        let skinLabel = labelsMap[quizData.piel] || quizData.piel;
        let concernLabel = labelsMap[quizData.preocupacion] || quizData.preocupacion;
        
        // 1. Resumen
        summaryTextEl.innerHTML = `Tu piel es tipo <strong>${skinLabel}</strong> y tu principal foco es tratar <strong>${concernLabel}</strong>.`;

        // 2. Recomendación de Tratamientos (Lógica)
        let recommendedTreatments = [];
        
        // Tratamiento según la preocupación principal
        if (quizData.preocupacion === 'lineas_arrugas') {
            recommendedTreatments.push('Hilos Sólidos (Colágeno) para rellenar arrugas.');
            recommendedTreatments.push('Hilos Líquidos para tensar y definir el contorno facial.');
            recommendedTreatments.push('Tratamiento Anti-Age personalizado con aparatología.');
        } else if (quizData.preocupacion === 'manchas_tono') {
            recommendedTreatments.push('Peeling Químico / Físico para renovar capas y aclarar manchas.');
            recommendedTreatments.push('BB Glow para unificar el tono y lucir una piel de porcelana.');
            recommendedTreatments.push('Dermaplaning para exfoliar y dar luminosidad inmediata.');
        } else if (quizData.preocupacion === 'poros_acne') {
            recommendedTreatments.push('Limpieza Profunda con extracción para limpiar poros.');
            recommendedTreatments.push('Peeling Químico para regular sebo y renovar textura.');
            recommendedTreatments.push('Microneedling (Dermapen) para atenuar cicatrices y poros abiertos.');
        } else if (quizData.preocupacion === 'deshidratacion_opacidad') {
            recommendedTreatments.push('Hydralips para hidratar labios profundamente.');
            recommendedTreatments.push('Limpieza Profunda con velo de colágeno hidratante.');
            recommendedTreatments.push('Microneedling (Dermapen) con cóctel de ácido hialurónico.');
        }

        // Ajustes o agregados por tipo de piel
        if (quizData.piel === 'sensible') {
            // Reemplazar tratamientos agresivos por alternativas suaves
            recommendedTreatments = recommendedTreatments.map(t => t.replace('Peeling Químico', 'Peeling Enzimático Suave'));
            if (!recommendedTreatments.some(t => t.includes('Hydralips'))) {
                recommendedTreatments.push('Hydralips (hidratación nutritiva sin aguja).');
            }
        }
        
        // Imprimir tratamientos en HTML
        treatmentsListEl.innerHTML = '';
        recommendedTreatments.forEach(t => {
            const li = document.createElement('li');
            li.textContent = t;
            treatmentsListEl.appendChild(li);
        });

        // 3. Recomendación de Rutina de Skincare
        let productsAdvice = '';
        if (quizData.piel === 'seca') {
            productsAdvice = 'Limpieza con emulsión suave + Sérum concentrado de Ácido Hialurónico + Crema nutritiva con ceramidas + Protector solar fps 50+ hidratante.';
        } else if (quizData.piel === 'mixta_grasa') {
            productsAdvice = 'Limpiador en gel espumoso + Sérum seborregulador (Niacinamida / Salicílico) + Emulsión hidratante ultra ligera (toque seco) + Protector solar fluido matificante.';
        } else if (quizData.piel === 'sensible') {
            productsAdvice = 'Limpiador syndet (sin jabón) + Tónico descongestivo (Manzanilla / Caléndula) + Crema hidratante calmante (con Centella Asiática) + Protector solar mineral.';
        } else if (quizData.piel === 'madura') {
            productsAdvice = 'Limpiador suave + Sérum con péptidos o Retinol (de noche) + Crema hidratante reafirmante con antioxidantes + Protector solar fps 50+ diario.';
        }

        productsTextEl.innerHTML = productsAdvice;
    }

    // Enviar resultados a WhatsApp
    sendWhatsappBtn.addEventListener('click', () => {
        let skinLabel = labelsMap[quizData.piel] || quizData.piel;
        let concernLabel = labelsMap[quizData.preocupacion] || quizData.preocupacion;
        let routineLabel = labelsMap[quizData.rutina] || quizData.rutina;
        
        // Obtener la lista de tratamientos en texto
        const items = document.querySelectorAll('#recommended-treatments-list li');
        let treatmentsText = '';
        items.forEach((item, index) => {
            treatmentsText += `${index + 1}. ${item.textContent}\n`;
        });

        // Armar el mensaje
        const rawMessage = `Hola Lupe Pinamar! Acabo de hacer el Test de Skincare en la web y me gustaría reservar una cita para diagnóstico.

Mis respuestas del test:
🌸 Tipo de piel: ${skinLabel}
🎯 Mayor preocupación: ${concernLabel}
🏠 Rutina actual: ${routineLabel}

Tratamientos recomendados:
${treatmentsText}
Quedo atenta para agendar un turno presencial en Pinamar. Gracias!`;

        // Codificar para URL
        const encodedMessage = encodeURIComponent(rawMessage);
        const whatsappUrl = `https://wa.me/5492254459147?text=${encodedMessage}`;
        
        // Abrir en nueva pestaña
        window.open(whatsappUrl, '_blank');
    });

    // Resetear el Quiz
    resetQuizBtn.addEventListener('click', () => {
        quizData = { piel: '', preocupacion: '', rutina: '' };
        optionButtons.forEach(opt => opt.classList.remove('selected'));
        goToStep(1);
    });


    // ----------------------------------------------------
    // 4. Animaciones en Scroll (Intersection Observer)
    // ----------------------------------------------------
    const revealElements = document.querySelectorAll('.scroll-reveal');
    
    if ('IntersectionObserver' in window) {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.15
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target); // Dejar de observar una vez revelado
                }
            });
        }, observerOptions);

        revealElements.forEach(el => {
            observer.observe(el);
        });
        
        // Agregar la clase de revelación a otras secciones para animarlas
        const sectionHeaders = document.querySelectorAll('.section-header, .section-grid, .testimonial-card');
        sectionHeaders.forEach(el => {
            el.classList.add('scroll-reveal');
            observer.observe(el);
        });
        
    } else {
        // Fallback si el navegador no soporta IntersectionObserver
        revealElements.forEach(el => {
            el.classList.add('revealed');
        });
    }

});
