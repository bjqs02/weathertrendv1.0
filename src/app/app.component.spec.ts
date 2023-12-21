import { TestBed, ComponentFixture } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HighchartsChartModule } from 'highcharts-angular';
import { AgGridModule } from 'ag-grid-angular';
import Swal from 'sweetalert2';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [FormsModule, AgGridModule, HighchartsChartModule],
    });

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should have the correct initial state', () => {
    expect(component.loading).toBeFalsy();
    // Add more expectations based on your initial state
  });


  // it('should handle error when no date is selected', () => {
  //   // Set the date to an empty value
  //   component.myDate = '2023-11-05';

  //   // Trigger change detection to simulate a user action
  //   fixture.detectChanges();

  //   // Mock the console.log method
  //   const consoleSpy = spyOn(console, 'log');

  //   // Trigger data fetching
  //   component.handleDate()
  //   component.getData();

  //   // Expect console.log to be called with a warning message
  //   expect(consoleSpy).toHaveBeenCalledWith('Please Pick a Date');
  // });

  it('should handle date correctly', () => {
    // Set a future date
    component.myDate = '2050-01-01';

    // Trigger date handling
    component.handleDate();

    // Mock the console.log method
    const consoleSpy = spyOn(console, 'log');

    // Expect console.log to be called with a warning message
    expect(consoleSpy).toHaveBeenCalledWith('No Forecast data');
  });

  afterEach(() => {
    fixture.destroy();
  });
});
