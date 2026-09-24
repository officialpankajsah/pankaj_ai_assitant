import { MemoryItem } from '../types';

const MEMORY_STORAGE_KEY = 'pankaj_ji_local_memory_v1';
const MEMORY_ENABLED_KEY = 'pankaj_ji_memory_enabled';

const INITIAL_MEMORIES: MemoryItem[] = [
  {
    id: 'mem-1',
    type: 'USER_PREFERENCE',
    key: 'Preferred Language Style',
    value: 'Natural Hinglish with respectful "Ji"',
    timestamp: Date.now() - 3600000 * 24
  },
  {
    id: 'mem-2',
    type: 'ROUTINE',
    key: 'Morning Wakeup Routine',
    value: 'Weekdays 7:00 AM Alarm + Weather summary',
    timestamp: Date.now() - 3600000 * 12
  },
  {
    id: 'mem-3',
    type: 'USER_SETTING',
    key: 'Home City',
    value: 'Varanasi / Banaras, Uttar Pradesh',
    timestamp: Date.now() - 3600000 * 48
  },
  {
    id: 'mem-4',
    type: 'COMMAND_PATTERN',
    key: 'Frequently Contacted',
    value: 'Rahul Sharma (Colleague), Papa, Mummy',
    timestamp: Date.now() - 3600000 * 6
  }
];

export class MemoryService {
  private isMemoryEnabled = true;
  private memories: MemoryItem[] = [];

  constructor() {
    if (typeof window !== 'undefined') {
      const storedEnabled = localStorage.getItem(MEMORY_ENABLED_KEY);
      this.isMemoryEnabled = storedEnabled !== null ? storedEnabled === 'true' : true;

      const storedMemories = localStorage.getItem(MEMORY_STORAGE_KEY);
      if (storedMemories) {
        try {
          this.memories = JSON.parse(storedMemories);
        } catch (e) {
          this.memories = INITIAL_MEMORIES;
        }
      } else {
        this.memories = INITIAL_MEMORIES;
        this.save();
      }
    }
  }

  public isEnabled(): boolean {
    return this.isMemoryEnabled;
  }

  public setEnabled(enabled: boolean) {
    this.isMemoryEnabled = enabled;
    if (typeof window !== 'undefined') {
      localStorage.setItem(MEMORY_ENABLED_KEY, enabled.toString());
    }
  }

  public getAll(): MemoryItem[] {
    return [...this.memories];
  }

  public add(item: Omit<MemoryItem, 'id' | 'timestamp'>): MemoryItem {
    const newItem: MemoryItem = {
      ...item,
      id: 'mem-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      timestamp: Date.now()
    };
    if (this.isMemoryEnabled) {
      this.memories.unshift(newItem);
      this.save();
    }
    return newItem;
  }

  public update(id: string, updated: Partial<MemoryItem>) {
    this.memories = this.memories.map(m => (m.id === id ? { ...m, ...updated } : m));
    this.save();
  }

  public delete(id: string) {
    this.memories = this.memories.filter(m => m.id !== id);
    this.save();
  }

  public clearAll() {
    this.memories = [];
    this.save();
  }

  private save() {
    if (typeof window !== 'undefined') {
      localStorage.setItem(MEMORY_STORAGE_KEY, JSON.stringify(this.memories));
    }
  }
}

export const memoryService = new MemoryService();
