import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { ContactFormComponent } from './contact-form.component';
import { Contact } from '../contact.model';
import { SimpleChange } from '@angular/core';

describe('ContactFormComponent', () => {
  let component: ContactFormComponent;
  let fixture: ComponentFixture<ContactFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContactFormComponent],
      imports: [ReactiveFormsModule],
      providers: [FormBuilder]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Trigger initial data binding
  });

  it('should create the form with empty controls', () => {
    expect(component.contactForm).toBeTruthy();
    expect(component.contactForm.controls['firstName']?.value).toBe('');
    expect(component.contactForm.controls['lastName']?.value).toBe('');
    expect(component.contactForm.controls['email']?.value).toBe('');
    expect(component.contactForm.controls['phone']?.value).toBe('');
  });

  it('should have "Add Contact" as the default button label', () => {
    expect(component.submitButtonLabel).toBe('Add Contact');
  });

  it('should update form values when a contact is passed (edit mode)', () => {
    const contact: Contact = { id: 1, firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', phone: '1234567890', isEditing: false };
    const changes = { contact: new SimpleChange(null, contact, true) };
    component.ngOnChanges(changes);
    fixture.detectChanges();

    expect(component.contactForm.controls['firstName'].value).toBe('John');
    expect(component.contactForm.controls['lastName'].value).toBe('Doe');
    expect(component.contactForm.controls['email'].value).toBe('john.doe@example.com');
    expect(component.contactForm.controls['phone'].value).toBe('1234567890');
    expect(component.submitButtonLabel).toBe('Update Contact');
  });

  it('should reset the form if no contact is provided (add mode)', () => {
    component.setFormValues(null); // Simulate no contact provided (add mode)
    fixture.detectChanges();

    expect(component.contactForm.controls['firstName']?.value).toBe('');
    expect(component.contactForm.controls['lastName']?.value).toBe('');
    expect(component.contactForm.controls['email']?.value).toBe('');
    expect(component.contactForm.controls['phone']?.value).toBe('');
    expect(component.submitButtonLabel).toBe('Add Contact');
  });

  it('should emit the contactAdded event on form submit', () => {
    spyOn(component.contactAdded, 'emit');

    component.contactForm.controls['firstName'].setValue('Jane');
    component.contactForm.controls['lastName'].setValue('Doe');
    component.contactForm.controls['email'].setValue('jane.doe@example.com');
    component.contactForm.controls['phone'].setValue('0987654321');
    component.contactForm.controls['isEditing'].setValue(false);

    component.submitForm();
    expect(component.contactAdded.emit).toHaveBeenCalledWith({
      id: 1,
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane.doe@example.com',
      phone: '0987654321',
      isEditing: false
    });
  });

  it('should include contact id in the emitted form value if editing', () => {
    const contact: Contact = { id: 2, firstName: 'Jane', lastName: 'Doe', email: 'jane.doe@example.com', phone: '0987654321', isEditing: false };
    component.contact = contact;
    component.setFormValues(contact);
    spyOn(component.contactAdded, 'emit');

    component.submitForm();

    expect(component.contactAdded.emit).toHaveBeenCalledWith({
      id: 2,
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane.doe@example.com',
      phone: '0987654321',
      isEditing: false
    });
  });

  it('should not emit contactAdded event if the form is invalid', () => {
    spyOn(component.contactAdded, 'emit');

    // Leave the form invalid by not setting required fields
    component.submitForm();

    expect(component.contactAdded.emit).not.toHaveBeenCalled();
  });
});
