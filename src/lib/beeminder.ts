import type { BeeminderConfig, BeeminderDatapoint } from './types';

const API_BASE = 'https://www.beeminder.com/api/v1';

export class BeeminderService {
  private config: BeeminderConfig;

  constructor(config: BeeminderConfig) {
    this.config = config;
  }

  async createDatapoint(goalSlug: string, datapoint: BeeminderDatapoint): Promise<Response> {
    const url = `${API_BASE}/users/${this.config.username}/goals/${goalSlug}/datapoints.json`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...datapoint,
        auth_token: this.config.authToken,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.errors || 'Failed to create datapoint');
    }

    return response.json();
  }
}
