import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-create-modal',
  imports: [ReactiveFormsModule],
  templateUrl: './create-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateModalComponent {
  private _fb = inject(FormBuilder);
  activeModal = inject(NgbActiveModal);

  @Input() title = '';
  @Input() confirmText = 'Confirmar';
  @Input() confirmFn!: (data: any) => Promise<boolean>;

  isSubmitting = signal(false);

  ruleForm: FormGroup = this._fb.group({
    pattern: ['', Validators.required],
    dateFormat: ['AAAAMMDD', Validators.required],
    outTemplate: ['', Validators.required],
    priority: [1, [Validators.required, Validators.min(1)]],
    isActive: [true],
  });

  async onSubmit() {
    if (this.ruleForm.invalid) {
      this.ruleForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    try {
      const success = await this.confirmFn(this.ruleForm.value);
      if (success) {
        this.activeModal.close(true);
      }
    } catch {
      this.isSubmitting.set(false);
    }
  }
}
