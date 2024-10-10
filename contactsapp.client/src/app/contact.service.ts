import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Contact } from './contact.model';
import { switchMap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private apiUrl = 'https://localhost:7099/api/contacts';  // Update the URL if necessary
  private contactsSubject = new BehaviorSubject<Contact[]>([]);
  contacts$ = this.contactsSubject.asObservable();  // Observable for contacts list

  constructor(private http: HttpClient) { }

  getContacts(): void {
    this.http.get<Contact[]>(this.apiUrl).subscribe((contacts) => {
      this.contactsSubject.next(contacts);  // Update the contacts list
    });
  }

  getContact(id: number): Observable<Contact> {
    return this.http.get<Contact>(`${this.apiUrl}/${id}`);
  }

  updateContact(contact: Contact): Observable<Contact> {
    return this.http.put<Contact>(`${this.apiUrl}/${contact.id}`, contact);
  }

  addContact(contact: Contact): Observable<Contact> {
    // Assuming you're fetching contacts from a JSON file
    return this.http.get<Contact[]>(`${this.apiUrl}`).pipe(
      switchMap((contacts: Contact[]) => {
        // Find the max ID and assign a new one
        const maxId = contacts.length > 0 ? Math.max(...contacts.map(c => c.id!)) : 0;
        contact.id = maxId + 1; // Assign a new unique ID

        // Now save the new contact
        return this.http.post<Contact>(`${this.apiUrl}`, contact);
      })
    );
  }

  deleteContact(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
