import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ContactsListComponent } from './contacts-list.component';
import { ContactService } from '../contact.service';
import { of, throwError } from 'rxjs';
import { Contact } from '../contact.model';
import { By } from '@angular/platform-browser';

describe('ContactsListComponent', () => {
  let component: ContactsListComponent;
  let fixture: ComponentFixture<ContactsListComponent>;
  let mockContactService: jasmine.SpyObj<ContactService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('ContactService', ['getContacts', 'updateContact', 'addContact', 'deleteContact']);

    await TestBed.configureTestingModule({
      declarations: [ContactsListComponent],
      providers: [
        { provide: ContactService, useValue: spy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ContactsListComponent);
    component = fixture.componentInstance;
    mockContactService = TestBed.inject(ContactService) as jasmine.SpyObj<ContactService>;

    mockContactService.contacts$ = of([
      { id: 1, firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', phone: '1234567890', isEditing: false }
    ]);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load contacts on init', () => {
    spyOn(component, 'ngOnInit').and.callThrough();
    fixture.detectChanges();

    expect(component.ngOnInit).toHaveBeenCalled();
    expect(mockContactService.getContacts).toHaveBeenCalled();
  });

  it('should set selectedContact to null and showAddForm to true on addNewContact', () => {
    component.addNewContact();
    expect(component.selectedContact).toBeNull();
    expect(component.showAddForm).toBeTrue();
  });

  it('should set selectedContact and showAddForm to true on editContact', () => {
    const mockContact: Contact = { id: 1, firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', phone: '1234567890', isEditing: false };
    component.editContact(mockContact);

    expect(component.selectedContact).toEqual(mockContact);
    expect(component.showAddForm).toBeTrue();
  });

  it('should handle adding a new contact', () => {
    const newContact: Contact = { firstName: 'Jane', lastName: 'Doe', email: 'jane.doe@example.com', phone: '0987654321', isEditing: false };
    mockContactService.addContact.and.returnValue(of(newContact));

    component.handleContactAdded(newContact);
    expect(mockContactService.addContact).toHaveBeenCalledWith(newContact);
    expect(mockContactService.getContacts).toHaveBeenCalled();
  });

  it('should handle updating an existing contact', () => {
    const existingContact: Contact = { id: 1, firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', phone: '1234567890', isEditing: false };
    mockContactService.updateContact.and.returnValue(of(existingContact));

    component.handleContactAdded(existingContact);
    expect(mockContactService.updateContact).toHaveBeenCalledWith(existingContact);
    expect(mockContactService.getContacts).toHaveBeenCalled();
  });

  it('should handle delete contact', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    mockContactService.deleteContact.and.returnValue(of(void 0));

    component.deleteContact(1);
    expect(mockContactService.deleteContact).toHaveBeenCalledWith(1);
    expect(mockContactService.getContacts).toHaveBeenCalled();
  });

  it('should not delete contact if confirm is canceled', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    component.deleteContact(1);
    expect(mockContactService.deleteContact).not.toHaveBeenCalled();
  });

  it('should display feedback message and clear it after 3 seconds', fakeAsync(() => {
    component.displayFeedbackMessage('Contact added successfully!');
    expect(component.feedbackMessage).toBe('Contact added successfully!');
    tick(3000);
    expect(component.feedbackMessage).toBeNull();
  }));

  it('should clear the feedback message', () => {
    component.feedbackMessage = 'Test message';
    component.clearFeedbackMessage();
    expect(component.feedbackMessage).toBeNull();
  });

  it('should handle failed contact addition', () => {
    const newContact: Contact = { firstName: 'Jane', lastName: 'Doe', email: 'jane.doe@example.com', phone: '0987654321', isEditing: false };
    mockContactService.addContact.and.returnValue(throwError('Failed to add contact'));

    component.handleContactAdded(newContact);
    expect(mockContactService.addContact).toHaveBeenCalledWith(newContact);
    expect(component.feedbackMessage).toBe('Failed to add contact.');
  });

  it('should handle failed contact update', () => {
    const existingContact: Contact = { id: 1, firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', phone: '1234567890', isEditing: false };
    mockContactService.updateContact.and.returnValue(throwError('Failed to update contact'));

    component.handleContactAdded(existingContact);
    expect(mockContactService.updateContact).toHaveBeenCalledWith(existingContact);
    expect(component.feedbackMessage).toBe('Failed to update contact.');
  });

  it('should handle failed contact deletion', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    mockContactService.deleteContact.and.returnValue(throwError('Failed to delete contact'));

    component.deleteContact(1);
    expect(mockContactService.deleteContact).toHaveBeenCalledWith(1);
    expect(component.feedbackMessage).toBe('Failed to delete contact.');
  });
});
