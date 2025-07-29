import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CompanyResponseDto } from '../interfaces/company-response-dto';

@Injectable({
  providedIn: 'root' 
})
export class ActiveCompanyService {

    private readonly STORAGE_KEY = 'activeCompanyId';

  // BehaviorSubject para almacenar el ID de la empresa activa.
  private _activeCompanyId = new BehaviorSubject<string | null>(this.getStoredActiveCompanyId());

  // Observable público para que otros componentes se suscriban
  public activeCompanyId$: Observable<string | null> = this._activeCompanyId.asObservable();

  private getStoredActiveCompanyId(): string | null {
    return localStorage.getItem(this.STORAGE_KEY);
  }

  // Función para establecer la empresa activa
  setActiveCompany(company: CompanyResponseDto): void {
    localStorage.setItem(this.STORAGE_KEY, company.id);
    this._activeCompanyId.next(company.id);
    console.log('Empresa activa establecida:', company.name, 'ID:', company.id);
  }

  // Función para obtener el ID de la emrpesa actual del storage
  getCurrentActiveCompanyId(): string | null {
    return this._activeCompanyId.value;
  }

  
  // Elimina la empresa activa
  clearActiveCompany(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    this._activeCompanyId.next(null);
    console.log('Empresa activa borrada.');
  }
}