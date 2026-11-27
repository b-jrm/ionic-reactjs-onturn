export const ENV = {
  name: import.meta.env.VITE_APP_ENV,
  apiUrl: import.meta.env.VITE_API_URL,
  debug: import.meta.env.VITE_DEBUG === 'true',

  isDevelopment:
    import.meta.env.VITE_APP_ENV === 'development',

  isProduction:
    import.meta.env.VITE_APP_ENV === 'production'
};

// Registro de vistas visitadas
export const APP = {

  data: {} as Record<string, any>,

  setDebugData(data: Record<string, any>): void {

    Object.assign(this.data, data);

  }

};