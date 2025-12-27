import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { SheetsDbClient } from './SheetsDbClient';
import { SheetsDbError } from './SheetsDbError';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('SheetsDbClient', () => {
  let client: SheetsDbClient;

  beforeEach(() => {
    mockFetch.mockReset();
    client = new SheetsDbClient({
      baseUrl: 'https://api.example.com',
      spreadsheetId: 'test-spreadsheet-id',
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('constructor', () => {
    it('removes trailing slash from baseUrl', () => {
      const clientWithSlash = new SheetsDbClient({
        baseUrl: 'https://api.example.com/',
        spreadsheetId: 'test-id',
      });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ status: 'ok' }),
      });

      clientWithSlash.health();
      expect(mockFetch).toHaveBeenCalledWith('https://api.example.com/health');
    });
  });

  describe('health', () => {
    it('calls health endpoint', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ status: 'ok' }),
      });

      const result = await client.health();
      expect(mockFetch).toHaveBeenCalledWith('https://api.example.com/health');
      expect(result).toEqual({ status: 'ok' });
    });
  });

  describe('listSheets', () => {
    it('returns sheets array', async () => {
      const sheets = [
        { title: 'Sheet1', index: 0 },
        { title: 'Sheet2', index: 1 },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ sheets }),
      });

      const result = await client.listSheets();
      expect(result).toEqual(sheets);
    });

    it('returns empty array when no sheets', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({}),
      });

      const result = await client.listSheets();
      expect(result).toEqual([]);
    });

    it('includes spreadsheet ID header', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ sheets: [] }),
      });

      await client.listSheets();
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.com/sheets',
        expect.objectContaining({
          headers: expect.objectContaining({
            'X-Spreadsheet-Id': 'test-spreadsheet-id',
          }),
        })
      );
    });
  });

  describe('getRows', () => {
    it('fetches rows from specified sheet', async () => {
      const rows = [{ id: '1', name: 'Test' }];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ rows }),
      });

      const result = await client.getRows('Exercises');
      expect(result).toEqual(rows);
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.com/sheets/Exercises/rows',
        expect.any(Object)
      );
    });

    it('encodes sheet name in URL', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ rows: [] }),
      });

      await client.getRows('Sheet With Spaces');
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.com/sheets/Sheet%20With%20Spaces/rows',
        expect.any(Object)
      );
    });

    it('returns empty array when no rows', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({}),
      });

      const result = await client.getRows('Empty');
      expect(result).toEqual([]);
    });
  });

  describe('createRow', () => {
    it('posts new row data', async () => {
      const newRow = { name: 'New Exercise' };
      const createdRow = { id: '1', ...newRow };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(createdRow),
      });

      const result = await client.createRow('Exercises', newRow);
      expect(result).toEqual(createdRow);
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.com/sheets/Exercises/rows',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(newRow),
        })
      );
    });
  });

  describe('updateRow', () => {
    it('updates existing row', async () => {
      const updatedData = { name: 'Updated Exercise' };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(updatedData),
      });

      const result = await client.updateRow('Exercises', 5, updatedData);
      expect(result).toEqual(updatedData);
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.com/sheets/Exercises/rows/5',
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify(updatedData),
        })
      );
    });
  });

  describe('deleteRow', () => {
    it('deletes row at index', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 204,
      });

      await client.deleteRow('Exercises', 3);
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.com/sheets/Exercises/rows/3',
        expect.objectContaining({
          method: 'DELETE',
        })
      );
    });
  });

  describe('createSheet', () => {
    it('creates new sheet', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 204,
      });

      await client.createSheet('New Sheet');
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.com/sheets',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ name: 'New Sheet' }),
        })
      );
    });
  });

  describe('error handling', () => {
    it('throws SheetsDbError on failed request with JSON error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: () => Promise.resolve({ error: 'Invalid request' }),
      });

      const promise = client.listSheets();
      await expect(promise).rejects.toThrow(SheetsDbError);

      // Set up mock again for the second assertion
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: () => Promise.resolve({ error: 'Invalid request' }),
      });

      await expect(client.listSheets()).rejects.toMatchObject({
        message: 'Invalid request',
        status: 400,
      });
    });

    it('throws SheetsDbError with status message when no error field', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: () => Promise.resolve({}),
      });

      await expect(client.listSheets()).rejects.toThrow('Request failed with status 500');
    });

    it('handles non-JSON error response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 503,
        json: () => Promise.reject(new Error('Invalid JSON')),
        text: () => Promise.resolve('Service Unavailable'),
      });

      await expect(client.listSheets()).rejects.toThrow(SheetsDbError);
    });
  });
});

describe('SheetsDbError', () => {
  it('creates error with correct properties', () => {
    const error = new SheetsDbError('Test error', 404, { detail: 'Not found' });

    expect(error.message).toBe('Test error');
    expect(error.name).toBe('SheetsDbError');
    expect(error.status).toBe(404);
    expect(error.response).toEqual({ detail: 'Not found' });
  });

  it('extends Error class', () => {
    const error = new SheetsDbError('Test', 500, null);
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(SheetsDbError);
  });
});
