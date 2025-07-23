import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../core/environments/environment'; 
import { ExerciseOfRightsResponseDto } from '../interfaces/exercise-of-rights-response-dto';
import { ExerciseOfRightsCreateDto } from '../interfaces/exercise-of-rights-create-dto';

@Injectable({
  providedIn: 'root'
})
export class ExerciseOfRightsService {

  private http = inject(HttpClient);


  
  // Crear una nueva solicitud de derechos
  createExerciseOfRights(dto: ExerciseOfRightsCreateDto): Observable<ExerciseOfRightsResponseDto> {
    return this.http.post<ExerciseOfRightsResponseDto>(`${environment.apiUrl}/exercise-of-rights`, dto);
  }

}