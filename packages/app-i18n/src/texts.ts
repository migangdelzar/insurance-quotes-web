export type TextEntry = { en: string; es: string; testId: string };

export const texts = {
  common: {
    appName: {
      en: 'Insurance Quotes',
      es: 'Cotizaciones de Seguro',
      testId: 'app-title',
    },
    next: { en: 'Next', es: 'Siguiente', testId: 'btn-next' },
    back: { en: 'Back', es: 'Atrás', testId: 'btn-back' },
    retry: { en: 'Retry', es: 'Reintentar', testId: 'btn-retry' },
    loading: { en: 'Loading…', es: 'Cargando…', testId: 'loading-indicator' },
    networkError: {
      en: "Can't reach the server. Check your connection and try again.",
      es: 'No se puede conectar con el servidor. Revisa tu conexión e inténtalo de nuevo.',
      testId: 'network-error',
    },
    sessionExpired: {
      en: 'Your session expired. Please sign in again.',
      es: 'Tu sesión expiró. Inicia sesión de nuevo.',
      testId: 'session-expired',
    },
    reference: {
      en: ' (ref: {{traceId}})',
      es: ' (ref: {{traceId}})',
      testId: 'error-reference',
    },
    apiError: {
      en: 'The request could not be completed.',
      es: 'No se pudo completar la solicitud.',
      testId: 'api-error',
    },
    currencyPrefix: { en: '$', es: '$', testId: 'currency-prefix' },
    notAvailable: { en: '—', es: '—', testId: 'not-available' },
  },
  auth: {
    login: {
      title: { en: 'Sign in', es: 'Iniciar sesión', testId: 'login-title' },
      username: { en: 'Username', es: 'Usuario', testId: 'login-username' },
      password: { en: 'Password', es: 'Contraseña', testId: 'login-password' },
      submit: { en: 'Sign in', es: 'Entrar', testId: 'login-submit' },
      passwordless: {
        en: 'Sign in with a passkey',
        es: 'Entrar con passkey',
        testId: 'login-passkey',
      },
      invalidCredentials: {
        en: 'Invalid username or password',
        es: 'Usuario o contraseña inválidos',
        testId: 'login-error',
      },
    },
    mfa: {
      title: {
        en: 'Confirm with your passkey',
        es: 'Confirma con tu passkey',
        testId: 'mfa-title',
      },
      prompt: {
        en: 'Use your passkey to finish signing in.',
        es: 'Usa tu passkey para terminar de iniciar sesión.',
        testId: 'mfa-prompt',
      },
    },
    enroll: {
      title: {
        en: 'Protect your account',
        es: 'Protege tu cuenta',
        testId: 'enroll-title',
      },
      action: {
        en: 'Register a passkey',
        es: 'Registrar un passkey',
        testId: 'enroll-passkey',
      },
      skip: { en: 'Not now', es: 'Ahora no', testId: 'enroll-skip' },
    },
  },
  wizard: {
    progress: {
      en: 'Quote progress',
      es: 'Progreso de la cotización',
      testId: 'wizard-progress',
    },
    personal: {
      title: {
        en: 'Personal information',
        es: 'Información personal',
        testId: 'wizard-personal-title',
      },
      name: {
        en: 'Full name',
        es: 'Nombre completo',
        testId: 'wizard-personal-name',
      },
      email: {
        en: 'Email',
        es: 'Correo electrónico',
        testId: 'wizard-personal-email',
      },
      age: { en: 'Age', es: 'Edad', testId: 'wizard-personal-age' },
      zipCode: {
        en: 'Zip code',
        es: 'Código postal',
        testId: 'wizard-personal-zip',
      },
      nameRequired: {
        en: 'Name is required',
        es: 'El nombre es obligatorio',
        testId: 'error-name-required',
      },
      emailInvalid: {
        en: 'Enter a valid email',
        es: 'Ingresa un correo válido',
        testId: 'error-email-invalid',
      },
      ageRange: {
        en: 'Age must be between 18 and 120',
        es: 'La edad debe estar entre 18 y 120',
        testId: 'error-age-range',
      },
      zipFormat: {
        en: 'Zip code must be 5 digits',
        es: 'El código postal debe tener 5 dígitos',
        testId: 'error-zip-format',
      },
    },
    coverage: {
      title: {
        en: 'Coverage selection',
        es: 'Selección de cobertura',
        testId: 'wizard-coverage-title',
      },
      basic: { en: 'Basic', es: 'Básica', testId: 'coverage-basic' },
      standard: { en: 'Standard', es: 'Estándar', testId: 'coverage-standard' },
      premium: { en: 'Premium', es: 'Premium', testId: 'coverage-premium' },
      premiumLabel: {
        en: 'Estimated monthly premium',
        es: 'Prima mensual estimada',
        testId: 'premium-display',
      },
      health: {
        title: {
          en: 'Health questions',
          es: 'Preguntas de salud',
          testId: 'health-title',
        },
        preexisting: {
          en: 'Pre-existing conditions?',
          es: '¿Condiciones preexistentes?',
          testId: 'health-preexisting',
        },
        conditions: {
          en: 'Which conditions?',
          es: '¿Cuáles condiciones?',
          testId: 'health-conditions',
        },
        diabetes: {
          en: 'Diabetes',
          es: 'Diabetes',
          testId: 'condition-diabetes',
        },
        heartDisease: {
          en: 'Heart disease',
          es: 'Enfermedad cardíaca',
          testId: 'condition-heart-disease',
        },
        hypertension: {
          en: 'Hypertension',
          es: 'Hipertensión',
          testId: 'condition-hypertension',
        },
        cancerHistory: {
          en: 'Cancer history',
          es: 'Historial de cáncer',
          testId: 'condition-cancer-history',
        },
        other: { en: 'Other', es: 'Otra', testId: 'condition-other' },
        prescription: {
          en: 'Prescription medication?',
          es: '¿Medicamento con receta?',
          testId: 'health-prescription',
        },
        tobacco: {
          en: 'Tobacco use?',
          es: '¿Consumo de tabaco?',
          testId: 'health-tobacco',
        },
        spouse: {
          en: 'Spouse coverage?',
          es: '¿Cobertura para cónyuge?',
          testId: 'health-spouse',
        },
        yes: { en: 'Yes', es: 'Sí', testId: 'answer-yes' },
        no: { en: 'No', es: 'No', testId: 'answer-no' },
      },
    },
    summary: {
      title: {
        en: 'Review and submit',
        es: 'Revisar y enviar',
        testId: 'wizard-summary-title',
      },
      submit: {
        en: 'Submit quote',
        es: 'Enviar cotización',
        testId: 'summary-submit',
      },
      success: {
        en: 'Your quote was submitted successfully.',
        es: 'Tu cotización se envió con éxito.',
        testId: 'submission-success',
      },
      failure: {
        en: 'Submission failed. Your quote was saved and you can retry.',
        es: 'El envío falló. Tu cotización quedó guardada y puedes reintentar.',
        testId: 'submission-failure',
      },
      checking: {
        en: 'Confirming submission status…',
        es: 'Confirmando el estado del envío…',
        testId: 'submission-checking',
      },
    },
  },
  quotesList: {
    title: {
      en: 'My quotes',
      es: 'Mis cotizaciones',
      testId: 'quotes-list-title',
    },
    empty: {
      en: 'No quotes yet. Start your first one!',
      es: 'Aún no hay cotizaciones. ¡Comienza la primera!',
      testId: 'quotes-empty-state',
    },
    startQuote: {
      en: 'Start a quote',
      es: 'Iniciar cotización',
      testId: 'btn-start-quote',
    },
  },
  errors: {
    QUOTE_NOT_FOUND: {
      en: 'Quote not found',
      es: 'Cotización no encontrada',
      testId: 'err-quote-not-found',
    },
    QUOTE_INVALID_STATE_TRANSITION: {
      en: 'This quote no longer allows that action',
      es: 'Esta cotización ya no permite esa acción',
      testId: 'err-invalid-state',
    },
    QUOTE_HEALTH_DATA_NOT_ALLOWED: {
      en: 'Health information applies only to applicants over 65',
      es: 'La información de salud aplica solo a mayores de 65',
      testId: 'err-health-not-allowed',
    },
    QUOTE_INCOMPLETE: {
      en: 'The quote is missing required information',
      es: 'A la cotización le falta información',
      testId: 'err-incomplete',
    },
    INSURER_UNAVAILABLE: {
      en: 'The insurer could not process the submission',
      es: 'La aseguradora no pudo procesar el envío',
      testId: 'err-insurer',
    },
    EXPIRED: {
      en: 'This quote expired. Please start a new one.',
      es: 'Esta cotización expiró. Inicia una nueva.',
      testId: 'err-expired',
    },
  },
} as const;
