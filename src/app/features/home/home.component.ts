import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
  
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="home">
        <h1>Spare Parts - Angular</h1>
        <p>This is a simple application to spike/demo various Angular features. </p>
        <p>*Not intended to be a real-world inventory system :-)</p>
    </div>
  `,
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
