import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { PanelModule } from 'primeng/panel';
import { DividerModule } from 'primeng/divider';
import { MessageModule } from 'primeng/message';
import { TabsModule } from 'primeng/tabs'; 
import { FloatLabelModule } from 'primeng/floatlabel';

@Component({
  selector: 'app-user-settings',
  imports: [
    CommonModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    FormsModule,
    CardModule,
    PanelModule,
    DividerModule,
    MessageModule,
    TabsModule,
    FloatLabelModule,
  ],
  templateUrl: './user-settings.html',
  styleUrl: './user-settings.css'
})
export class UserSettings {

}
