const API_BASE_URL = 'http://localhost:8000';

// ==================== POSTRES ====================
export const postresAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/postres/`);
    if (!response.ok) throw new Error('Error al obtener postres');
    return response.json();
  },

  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/postres/${id}`);
    if (!response.ok) throw new Error(`Error al obtener postre ${id}`);
    return response.json();
  },

  create: async (postreData) => {
    const response = await fetch(`${API_BASE_URL}/postres/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postreData),
    });
    if (!response.ok) throw new Error('Error al crear postre');
    return response.json();
  },

  update: async (id, postreData) => {
    const response = await fetch(`${API_BASE_URL}/postres/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postreData),
    });
    if (!response.ok) throw new Error(`Error al actualizar postre ${id}`);
    return response.json();
  },

  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/postres/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error(`Error al eliminar postre ${id}`);
  },
};

// ==================== PAN ====================
export const panAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/pan/`);
    if (!response.ok) throw new Error('Error al obtener panes');
    return response.json();
  },

  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/pan/${id}`);
    if (!response.ok) throw new Error(`Error al obtener pan ${id}`);
    return response.json();
  },

  create: async (panData) => {
    const response = await fetch(`${API_BASE_URL}/pan/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(panData),
    });
    if (!response.ok) throw new Error('Error al crear pan');
    return response.json();
  },

  update: async (id, panData) => {
    const response = await fetch(`${API_BASE_URL}/pan/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(panData),
    });
    if (!response.ok) throw new Error(`Error al actualizar pan ${id}`);
    return response.json();
  },

  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/pan/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error(`Error al eliminar pan ${id}`);
  },
};

// ==================== BEBIDAS ====================
export const bebidasAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/bebidas/`);
    if (!response.ok) throw new Error('Error al obtener bebidas');
    return response.json();
  },

  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/bebidas/${id}`);
    if (!response.ok) throw new Error(`Error al obtener bebida ${id}`);
    return response.json();
  },

  create: async (bebidaData) => {
    const response = await fetch(`${API_BASE_URL}/bebidas/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bebidaData),
    });
    if (!response.ok) throw new Error('Error al crear bebida');
    return response.json();
  },

  update: async (id, bebidaData) => {
    const response = await fetch(`${API_BASE_URL}/bebidas/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bebidaData),
    });
    if (!response.ok) throw new Error(`Error al actualizar bebida ${id}`);
    return response.json();
  },

  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/bebidas/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error(`Error al eliminar bebida ${id}`);
  },
};

// ==================== EXTRAS ====================
export const extrasAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/extras/`);
    if (!response.ok) throw new Error('Error al obtener extras');
    return response.json();
  },

  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/extras/${id}`);
    if (!response.ok) throw new Error(`Error al obtener extra ${id}`);
    return response.json();
  },

  create: async (extraData) => {
    const response = await fetch(`${API_BASE_URL}/extras/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(extraData),
    });
    if (!response.ok) throw new Error('Error al crear extra');
    return response.json();
  },

  update: async (id, extraData) => {
    const response = await fetch(`${API_BASE_URL}/extras/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(extraData),
    });
    if (!response.ok) throw new Error(`Error al actualizar extra ${id}`);
    return response.json();
  },

  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/extras/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error(`Error al eliminar extra ${id}`);
  },
};

// ==================== VENTAS ====================
export const ventasAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/ventas/`);
    if (!response.ok) throw new Error('Error al obtener ventas');
    return response.json();
  },

  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/ventas/${id}`);
    if (!response.ok) throw new Error(`Error al obtener venta ${id}`);
    return response.json();
  },

  create: async (ventaData) => {
    const response = await fetch(`${API_BASE_URL}/ventas/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ventaData),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Error al crear venta');
    }
    return response.json();
  },

  createSQL: async (ventaData) => {
    const response = await fetch(`${API_BASE_URL}/ventas/crear`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ventaData),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Error al crear venta');
    }
    return response.json();
  },
};
