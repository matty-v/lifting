import { SheetsDbError } from './SheetsDbError';
import type { SheetInfo } from '@/types';

interface SheetsDbClientOptions {
  baseUrl: string;
  spreadsheetId: string;
}

interface RequestOptions extends RequestInit {
  headers?: Record<string, string>;
}

export class SheetsDbClient {
  private baseUrl: string;
  private spreadsheetId: string;

  constructor(options: SheetsDbClientOptions) {
    this.baseUrl = options.baseUrl.replace(/\/$/, '');
    this.spreadsheetId = options.spreadsheetId;
  }

  private async request<T>(path: string, options: RequestOptions = {}): Promise<T | undefined> {
    const url = `${this.baseUrl}${path}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-Spreadsheet-Id': this.spreadsheetId,
      ...options.headers,
    };

    const response = await fetch(url, { ...options, headers });

    if (!response.ok) {
      let errorData: { error?: string } | string;
      try {
        errorData = await response.json();
      } catch {
        errorData = await response.text();
      }
      const message = typeof errorData === 'object' && errorData?.error
        ? errorData.error
        : `Request failed with status ${response.status}`;
      throw new SheetsDbError(message, response.status, errorData);
    }

    if (response.status === 204) return undefined;
    return response.json();
  }

  async health(): Promise<{ status: string }> {
    const response = await fetch(`${this.baseUrl}/health`);
    return response.json();
  }

  async listSheets(): Promise<SheetInfo[]> {
    const result = await this.request<{ sheets: SheetInfo[] }>('/sheets');
    return result?.sheets || [];
  }

  async getRows<T>(sheetName: string): Promise<T[]> {
    const result = await this.request<{ rows: T[] }>(`/sheets/${encodeURIComponent(sheetName)}/rows`);
    return result?.rows || [];
  }

  async createRow<T>(sheetName: string, data: T): Promise<T | undefined> {
    return this.request<T>(`/sheets/${encodeURIComponent(sheetName)}/rows`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateRow<T>(sheetName: string, rowIndex: number, data: T): Promise<T | undefined> {
    return this.request<T>(`/sheets/${encodeURIComponent(sheetName)}/rows/${rowIndex}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteRow(sheetName: string, rowIndex: number): Promise<void> {
    await this.request(`/sheets/${encodeURIComponent(sheetName)}/rows/${rowIndex}`, {
      method: 'DELETE',
    });
  }

  async createSheet(sheetName: string): Promise<void> {
    await this.request('/sheets', {
      method: 'POST',
      body: JSON.stringify({ name: sheetName }),
    });
  }
}
