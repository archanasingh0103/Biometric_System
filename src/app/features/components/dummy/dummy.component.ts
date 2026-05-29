import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommmonService } from '../../shared/services/common-service/common.service';
@Component({
  selector: 'app-dummy',
  imports: [CommonModule, FormsModule],
  templateUrl: './dummy.component.html',
  styleUrl: './dummy.component.css',
})
export class DummyComponent  {
 
}
