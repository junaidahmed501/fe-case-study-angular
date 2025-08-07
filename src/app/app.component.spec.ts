import {ComponentFixture, TestBed} from '@angular/core/testing';
import {AppComponent} from './app.component';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({}).compileComponents();
    // TestBed.overrideTemplate(AppComponent, '');
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the 'SFE Tech Task' title`, () => {
    expect(component.title).toEqual('SFE Tech Task');
  });

  it('should render title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('SFE Tech Task');
  });
});
