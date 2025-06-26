// API service for backend connection
const API_BASE_URL = 'http://localhost:8000';

export interface HealthResponse {
  service: string;
  status: string;
  mode: string;
  version: string;
}

export interface DetailedHealthResponse {
  status: string;
  mode: string;
  components: {
    ml_engine: string;
    fabric_generator: string;
    websocket: string;
  };
}

export const apiService = {
  // Basic health check
  async getHealth(): Promise<HealthResponse> {
    const response = await fetch(`${API_BASE_URL}/`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  // Detailed health check
  async getDetailedHealth(): Promise<DetailedHealthResponse> {
    const response = await fetch(`${API_BASE_URL}/health`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }
};
