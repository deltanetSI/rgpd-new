import { signal, computed } from '@angular/core';
import type { User } from './auth.service';

export const userSignal = signal<User | null>(null);
export const isAuthenticated = computed(() => !!userSignal()); 