import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TestService {
  constructor(private http: HttpClient) {}
  readonly BaseURI = 'https://localhost:44329/api';

  add(test) {
    return this.http.post(this.BaseURI + '/test', test);
  }

  getAll(user: any) {
    return this.http.get(this.BaseURI + '/test/all/' + user);
  }
  get(id) {
    return this.http.get(this.BaseURI + '/test/' + id);
  }
  update(id, test) {
    return this.http.post(this.BaseURI + '/test/' + id, test);
  }
  delete(id) {
    return this.http.delete(this.BaseURI + '/test/' + id);
  }
}
