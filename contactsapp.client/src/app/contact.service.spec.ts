import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ContactService } from './contact.service';
import { Contact } from './contact.model';

describe('ContactService', () => {
  let service: ContactService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ContactService]
    });
    service = TestBed.inject(ContactService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should retrieve all contacts via GET', () => {
    const mockContacts: Contact[] = [
      { id: 1, firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', phone: '1234567890', isEditing: false }
    ];

    service.getContacts();
    const req = httpMock.expectOne(service['apiUrl']);
    expect(req.request.method).toBe('GET');
    req.flush(mockContacts);

    service.contacts$.subscribe(contacts => {
      expect(contacts.length).toBe(1);
      expect(contacts).toEqual(mockContacts);
    });
  });

  it('should retrieve a single contact via GET', () => {
    const mockContact: Contact = { id: 1, firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', phone: '1234567890', isEditing: false };

    service.getContact(1).subscribe(contact => {
      expect(contact).toEqual(mockContact);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockContact);
  });

  it('should update a contact via PUT', () => {
    const mockContact: Contact = { id: 1, firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', phone: '1234567890', isEditing: false };

    service.updateContact(mockContact).subscribe(updatedContact => {
      expect(updatedContact).toEqual(mockContact);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(mockContact);
  });

  it('should add a contact and assign a unique ID', () => {
    const mockContacts: Contact[] = [
      { id: 1, firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', phone: '1234567890', isEditing: false }
    ];
    const newContact: Contact = { firstName: 'Jane', lastName: 'Doe', email: 'jane.doe@example.com', phone: '0987654321', isEditing: false };

    service.addContact(newContact).subscribe(addedContact => {
      expect(addedContact.id).toBe(2); // Ensure it assigns the next ID
      expect(addedContact).toEqual({ id: 2, ...newContact });
    });

    const req1 = httpMock.expectOne(service['apiUrl']);
    expect(req1.request.method).toBe('GET');
    req1.flush(mockContacts);

    const req2 = httpMock.expectOne(service['apiUrl']);
    expect(req2.request.method).toBe('POST');
    req2.flush({ id: 2, ...newContact });
  });

  it('should delete a contact via DELETE', () => {
    service.deleteContact(1).subscribe(response => {
      expect(response).toBeUndefined(); // Void response
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
