document.addEventListener('DOMContentLoaded', () => {
    // -----------------------------------------------------
    // 1. Elementos del DOM (Interfaz de Usuario)
    // -----------------------------------------------------
    const logoUpload = document.getElementById('logoUpload');
    const appLogo = document.getElementById('appLogo');
    const backgroundColorPicker = document.getElementById('backgroundColorPicker');
    const fontFamilySelector = document.getElementById('fontFamilySelector');
    const fontSizeSelector = document.getElementById('fontSizeSelector');
    const currentFontSizeSpan = document.getElementById('currentFontSize');
    const generalTextColorPicker = document.getElementById('generalTextColorPicker');
    const titleColorPicker = document.getElementById('titleColorPicker');
    const subtitleColorPicker = document.getElementById('subtitleColorPicker');
    const mainTitle = document.getElementById('mainTitle');
    const professionSubtitle = document.getElementById('professionSubtitle');
    const textFileUpload = document.getElementById('textFileUpload');
    const uploadButtonLabel = document.querySelector('label[for="textFileUpload"]');
    const smallOpportunityBtn = document.getElementById('smallOpportunityBtn');
    const bigOpportunityBtn = document.getElementById('bigOpportunityBtn');
    const marketBtn = document.getElementById('marketBtn');
    const whimBtn = document.getElementById('whimBtn');
    const textCard = document.getElementById('textCard');
    const displayText = document.getElementById('displayText');
    const resetMessage = document.getElementById('resetMessage');
    const configToggleButton = document.getElementById('configToggleButton');
    const exitButton = document.getElementById('exitButton');

    // Elementos del Modal de Registro
    const registrationModal = document.getElementById('registrationModal');
    const registrationForm = document.getElementById('registrationForm');
    const regName = document.getElementById('regName');
    const regEmail = document.getElementById('regEmail');
    const regWhatsapp = document.getElementById('regWhatsapp');
    const regCountry = document.getElementById('regCountry');
    const regState = document.getElementById('regState');
    const regProfession = document.getElementById('regProfession'); // Profesión real del usuario
    const enterAppBtn = document.getElementById('enterAppBtn');

    // Referencias a los contenedores de los controles que se mostrarán/ocultarán
    const personalizationControlsDiv = document.querySelector('.personalization-controls');
    
    // -----------------------------------------------------
    // 2. Variables de estado de la aplicación
    // -----------------------------------------------------
    let texts = {};
    let viewedTexts = {};
    const CONFIG_PASSWORD = 'LosmagnatesCF*'; // ¡DEFINE TU CONTRASEÑA AQUÍ!

    // URL del Google Apps Script desplegado como aplicación web
    // ¡DEBES CAMBIAR ESTA URL CON LA QUE OBTENGAS DESPUÉS DE PUBLICAR TU SCRIPT!
    const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzJTExS3bD_I59GmY1oKm4zAXknp48SCz_TpR3vVlI0V54DqElQn3nACOxS8cXdsjo6/exec'; 

    // -----------------------------------------------------
    // 3. Funciones de Carga y Guardado (localStorage)
    // -----------------------------------------------------

    const loadLogo = () => {
        const savedLogo = localStorage.getItem('appLogo');
        if (savedLogo) {
            appLogo.src = savedLogo;
            appLogo.classList.remove('hidden');
        } else {
            appLogo.classList.add('hidden');
        }
    };

    const loadPreferences = () => {
        document.body.style.backgroundColor = localStorage.getItem('backgroundColor') || 'var(--color-bg-dark)';
        backgroundColorPicker.value = localStorage.getItem('backgroundColor') || getComputedStyle(document.documentElement).getPropertyValue('--color-bg-dark').trim();

        document.body.style.fontFamily = localStorage.getItem('fontFamily') || "'Montserrat', sans-serif";
        fontFamilySelector.value = localStorage.getItem('fontFamily') || "'Montserrat', sans-serif";

        document.body.style.fontSize = (localStorage.getItem('fontSize') || '18') + 'px';
        fontSizeSelector.value = localStorage.getItem('fontSize'] || '18';
        currentFontSizeSpan.textContent = (localStorage.getItem('fontSize') || '18') + 'px';

        document.body.style.color = localStorage.getItem('generalTextColor') || 'var(--color-text-light)';
        generalTextColorPicker.value = localStorage.getItem('generalTextColor') || getComputedStyle(document.documentElement).getPropertyValue('--color-text-light').trim();

        mainTitle.style.color = localStorage.getItem('titleColor') || 'var(--color-accent-gold)';
        titleColorPicker.value = localStorage.getItem('titleColor') || getComputedStyle(document.documentElement).getPropertyValue('--color-accent-gold').trim();

        professionSubtitle.style.color = localStorage.getItem('subtitleColor') || 'var(--color-secondary-text)';
        subtitleColorPicker.value = localStorage.getItem('subtitleColor') || getComputedStyle(document.documentElement).getPropertyValue('--color-secondary-text').trim();
    };

    const loadTextsAndViewed = () => {
        const savedTexts = localStorage.getItem('appTexts');
        if (savedTexts) {
            texts = JSON.parse(savedTexts);
            const savedFileName = localStorage.getItem('uploadedTextFileName');
            if (savedFileName) {
                if (!personalizationControlsDiv.classList.contains('hidden')) {
                     uploadButtonLabel.textContent = `Archivo cargado: ${savedFileName}`;
                }
            }
        }

        const savedViewedTexts = localStorage.getItem('viewedTexts');
        if (savedViewedTexts) {
            viewedTexts = JSON.parse(savedViewedTexts);
        }
    };

    const saveTextsAndViewed = () => {
        localStorage.setItem('appTexts', JSON.stringify(texts));
        localStorage.setItem('viewedTexts', JSON.stringify(viewedTexts));
    };

    // Función para mostrar el modal de registro
    const showRegistrationModal = () => {
        registrationModal.style.display = 'flex';
        setTimeout(() => {
            registrationModal.classList.add('show-modal');
        }, 10); // Pequeño retraso para la animación
    };

    // Función para ocultar el modal de registro
    const hideRegistrationModal = () => {
        registrationModal.classList.remove('show-modal');
        setTimeout(() => {
            registrationModal.style.display = 'none';
        }, 300); // Coincide con la duración de la transición CSS
    };

    // Función para pedir la profesión del día y actualizar el subtítulo
    const askForDailyProfession = (userName) => {
        const professionOfTheDay = prompt(`¡Hola ${userName}! ¿Qué profesión desarrollarás hoy?`);
        if (professionOfTheDay) {
            localStorage.setItem('dailyProfession', professionOfTheDay); // Guardar la profesión del día
            professionSubtitle.textContent = `${userName} hoy serás: ${professionOfTheDay}`;
        } else {
            // Si el usuario no ingresa una profesión, aún así mostrar el nombre
            professionSubtitle.textContent = `${userName} hoy serás: [Profesión no especificada]`; 
        }
    };

    // -----------------------------------------------------
    // 4. Manejadores de Eventos (Interacción del Usuario)
    // -----------------------------------------------------

    // Evento para subir el logo (sin cambios)
    logoUpload.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file && file.type === 'image/png') {
            const reader = new FileReader();
            reader.onload = (e) => {
                appLogo.src = e.target.result;
                appLogo.classList.remove('hidden');
                localStorage.setItem('appLogo', e.target.result); // Siempre guardar el logo
            };
            reader.readAsDataURL(file);
        } else {
            alert('Por favor, sube un archivo PNG válido para el logo.');
            appLogo.classList.add('hidden'); // Ocultar si el archivo no es válido
            localStorage.removeItem('appLogo');
        }
    });

    // Eventos para cambiar las preferencias de personalización (sin cambios)
    backgroundColorPicker.addEventListener('input', (e) => {
        document.body.style.backgroundColor = e.target.value;
        localStorage.setItem('backgroundColor', e.target.value);
    });

    fontFamilySelector.addEventListener('change', (e) => {
        document.body.style.fontFamily = e.target.value;
        localStorage.setItem('fontFamily', e.target.value);
    });

    fontSizeSelector.addEventListener('input', (e) => {
        const newSize = e.target.value;
        document.body.style.fontSize = newSize + 'px'; // Aplica al body, luego CSS cascadea
        currentFontSizeSpan.textContent = newSize + 'px';
        localStorage.setItem('fontSize', newSize);
    });

    generalTextColorPicker.addEventListener('input', (e) => {
        document.body.style.color = e.target.value;
        localStorage.setItem('generalTextColor', e.target.value);
    });

    titleColorPicker.addEventListener('input', (e) => {
        mainTitle.style.color = e.target.value;
        localStorage.setItem('titleColor', e.target.value);
    });

    subtitleColorPicker.addEventListener('input', (e) => {
        professionSubtitle.style.color = e.target.value;
        localStorage.setItem('subtitleColor', e.target.value);
    });

    // Evento para subir el archivo de textos (sin cambios)
    textFileUpload.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file && file.type === 'text/plain') {
            const reader = new FileReader();
            reader.onload = (e) => {
                const rawText = e.target.result;
                const lines = rawText.split('\n').map(line => line.trim()).filter(line => line.length > 0);
                let currentCategory = 'default';
                texts = {};
                viewedTexts = {};

                lines.forEach(line => {
                    if (line.startsWith('[') && line.endsWith(']')) {
                        currentCategory = line.substring(1, line.length - 1).trim();
                        texts[currentCategory] = [];
                        viewedTexts[currentCategory] = [];
                    } else {
                        if (!texts[currentCategory]) {
                            texts[currentCategory] = [];
                        }
                        texts[currentCategory].push(line);
                    }
                });
                saveTextsAndViewed();
                localStorage.setItem('uploadedTextFileName', file.name);
                uploadButtonLabel.textContent = `Archivo cargado: ${file.name}`; // Asegura que el label se actualice
                alert('Archivo de textos cargado exitosamente. Ahora puedes usar los botones.');
            };
            reader.readAsText(file);
        } else {
            alert('Por favor, sube un archivo de texto plano (.txt).');
            localStorage.removeItem('appTexts');
            localStorage.removeItem('viewedTexts');
            localStorage.removeItem('uploadedTextFileName');
            uploadButtonLabel.textContent = `Subir Archivo de Textos (.txt)`; // Restablece el label
        }
    });

    // Eventos para los botones de acción (sin cambios)
    const handleButtonClick = (category, buttonName) => {
        if (!texts[category] || texts[category].length === 0) {
            displayText.textContent = `No hay textos para la categoría "${category}". Sube un archivo con esta categoría.`;
            resetMessage.textContent = '';
            return;
        }

        if (!viewedTexts[category] || viewedTexts[category].length === 0 || viewedTexts[category].length === texts[category].length) {
            viewedTexts[category] = Array.from({ length: texts[category].length }, (_, i) => i);
            shuffleArray(viewedTexts[category]);
            if (texts[category].length > 0) {
                resetMessage.textContent = `¡Felicidades! Has revisado ya todas las tarjetas de "${buttonName}". Ahora iniciamos de nuevo.`;
            }
        } else {
            resetMessage.textContent = '';
        }

        const nextIndex = viewedTexts[category].pop();
        if (nextIndex !== undefined) {
            textCard.classList.add('flip');
            setTimeout(() => {
                displayText.textContent = texts[category][nextIndex];
                textCard.classList.remove('flip');
            }, 300);
        } else {
            displayText.textContent = `Error: No se pudo obtener un texto para "${category}".`;
            resetMessage.textContent = '';
        }
        saveTextsAndViewed();
    };

    smallOpportunityBtn.addEventListener('click', () => handleButtonClick('Pequeña Oportunidad', smallOpportunityBtn.textContent));
    bigOpportunityBtn.addEventListener('click', () => handleButtonClick('Gran Oportunidad', bigOpportunityBtn.textContent));
    marketBtn.addEventListener('click', () => handleButtonClick('Mercado', marketBtn.textContent));
    whimBtn.addEventListener('click', () => handleButtonClick('Capricho', whimBtn.textContent));

    // MANEJADOR DE EVENTOS PARA EL BOTÓN "CONFIGURAR" (sin cambios significativos)
    configToggleButton.addEventListener('click', () => {
        const password = prompt('Por favor, ingresa la contraseña para acceder a la configuración:');
        if (password === CONFIG_PASSWORD) {
            if (personalizationControlsDiv.classList.contains('hidden')) {
                personalizationControlsDiv.classList.remove('hidden');
                logoUpload.classList.remove('hidden');
                
                const savedFileName = localStorage.getItem('uploadedTextFileName');
                if (savedFileName) {
                     uploadButtonLabel.textContent = `Archivo cargado: ${savedFileName}`;
                } else {
                    uploadButtonLabel.textContent = `Subir Archivo de Textos (.txt)`;
                }
                configToggleButton.textContent = 'Ocultar Configuración';
            } else {
                personalizationControlsDiv.classList.add('hidden');
                logoUpload.classList.add('hidden');
                configToggleButton.textContent = 'Configurar';
            }
            loadLogo(); 
        } else {
            alert('Contraseña incorrecta. Acceso denegado a la configuración.');
        }
    });

    // MANEJADOR DE EVENTOS PARA EL BOTÓN "SALIR DE LA APP"
    exitButton.addEventListener('click', () => {
        // Borra todos los datos del usuario del localStorage
        localStorage.removeItem('userName');       
        localStorage.removeItem('userEmail');      
        localStorage.removeItem('userWhatsapp');   
        localStorage.removeItem('userCountry');    
        localStorage.removeItem('userState');      
        localStorage.removeItem('userRealProfession'); 
        localStorage.removeItem('dailyProfession'); // Borra la profesión del día

        // Reinicia la interfaz
        professionSubtitle.textContent = ''; 
        displayText.textContent = 'Presiona un botón para ver un texto.';
        resetMessage.textContent = '';
        
        // Muestra el modal de registro nuevamente y limpia sus campos
        registrationForm.reset(); // Limpia los campos del formulario
        enterAppBtn.disabled = true; // Deshabilita el botón de entrada
        showRegistrationModal(); 
    });

    // Manejador de eventos para el formulario de registro
    registrationForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Evita que el formulario se envíe de la forma tradicional

        enterAppBtn.disabled = true; // Deshabilitar botón para evitar envíos múltiples
        enterAppBtn.textContent = 'Registrando...';

        const userData = {
            name: regName.value,
            email: regEmail.value,
            whatsapp: regWhatsapp.value,
            country: regCountry.value,
            state: regState.value,
            realProfession: regProfession.value,
            timestamp: new Date().toLocaleString() // Para registrar la fecha y hora
        };

        try {
            const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors', // Importante para Apps Script, ya que no devuelve CORS headers
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            // Con mode: 'no-cors', la respuesta será un "opaque response", no podemos leer su contenido.
            // Asumimos el éxito si no hay error de red.
            
            // Guardar datos del usuario en localStorage para uso inmediato en la app
            localStorage.setItem('userName', userData.name);
            localStorage.setItem('userEmail', userData.email);
            localStorage.setItem('userWhatsapp', userData.whatsapp);
            localStorage.setItem('userCountry', userData.country);
            localStorage.setItem('userState', userData.state);
            localStorage.setItem('userRealProfession', userData.realProfession);

            alert('¡Registro exitoso! Ya puedes entrar a la aplicación.');
            hideRegistrationModal(); // Oculta el modal
            askForDailyProfession(userData.name); // Pide la profesión del día
            displayText.textContent = 'Presiona un botón para ver un texto.'; // Asegura que el texto inicial esté listo
            
        } catch (error) {
            console.error('Error al enviar datos a Google Sheet:', error);
            alert('Hubo un error al registrar tus datos. Por favor, intenta de nuevo.');
        } finally {
            enterAppBtn.disabled = false;
            enterAppBtn.textContent = 'Entrar a la App';
        }
    });

    // Habilitar/Deshabilitar el botón de Entrar a la App basado en la validación de campos
    const validateRegistrationForm = () => {
        const allRequiredFilled = regName.value && regEmail.value && regWhatsapp.value && regCountry.value && regState.value && regProfession.value;
        enterAppBtn.disabled = !allRequiredFilled;
    };

    registrationForm.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', validateRegistrationForm);
    });

    // -----------------------------------------------------
    // 5. Funciones Auxiliares (sin cambios)
    // -----------------------------------------------------

    const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    };
    
    // -----------------------------------------------------
    // 6. Inicialización de la aplicación
    // -----------------------------------------------------
    loadPreferences();
    loadTextsAndViewed();
    loadLogo(); // Carga el logo si está guardado

    // Decide si mostrar el modal o pedir la profesión
    const userName = localStorage.getItem('userName');
    if (!userName) {
        showRegistrationModal(); // Muestra el modal si no hay nombre guardado
    } else {
        // Si ya hay un usuario registrado, preguntamos la profesión del día o la cargamos
        const dailyProfession = localStorage.getItem('dailyProfession');
        if (dailyProfession) {
            professionSubtitle.textContent = `${userName} hoy serás: ${dailyProfession}`;
        } else {
            askForDailyProfession(userName);
        }
    }
});