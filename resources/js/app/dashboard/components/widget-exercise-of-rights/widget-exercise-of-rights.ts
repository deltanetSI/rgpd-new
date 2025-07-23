import { Component,  } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';
import { DividerModule } from 'primeng/divider';
import { TooltipModule } from 'primeng/tooltip';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { SelectModule } from 'primeng/select';
import  { FormClientExerciseOfRights } from '../../../exercise-of-rights/components/form-client-exercise-of-rights/form-client-exercise-of-rights';


@Component({
  selector: 'app-exercise-of-rights',
  standalone: true,
  imports: [
    CardModule,
    ButtonModule,
    FileUploadModule,
    DividerModule,
    TooltipModule,
    MessageModule,
    ToastModule,
    FormClientExerciseOfRights,
    SelectModule,
  ],
  templateUrl: './widget-exercise-of-rights.html',
  styleUrl: './widget-exercise-of-rights.css',
  host: {
    'class': '!w-full block'
  }
})
export class WidgetExerciseOfRights {
  
    createClientDialog = false;

    onShowCreateClientDialog() {
      this.createClientDialog = true;
    }

    onHideCreateClientDialog() {
      this.createClientDialog = false;
    }

}
