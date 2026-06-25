import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { CreateRuleDto, Rule } from '../pages/rules/interfaces/rule.interface';
import { catchError, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RulesService {
  private _http = inject(HttpClient);

  getAllRules(includeInactive: boolean): Observable<Rule[] | null> {
    return this._http
      .get<Rule[]>(`${environment.API_URL}rules`, {
        params: { includeInactive },
      })
      .pipe(catchError(() => of(null)));
  }

  createRule(data: CreateRuleDto): Observable<Rule | null> {
    return this._http
      .post<Rule>(`${environment.API_URL}rules`, data)
      .pipe(
        map((response) => response),
        catchError(() => of(null))
      );
  }

  deleteRule(id: string): Observable<boolean> {
    return this._http
      .delete(`${environment.API_URL}rules/${id}`)
      .pipe(
        map(() => true),
        catchError(() => of(false))
      );
  }
}
