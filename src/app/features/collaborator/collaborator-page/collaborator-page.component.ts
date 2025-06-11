import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { TableComponent } from '../../../common/components/table/table.component';
import { Column } from '../../../common/shared/models/column.model';
import { UserTableDTO } from '../model/user.model';
import { UserHttpService } from '../services/user/user-http.service';
import { UserSanitizeService } from '../services/user/user-sanitize.service';
import { UserFacadeService } from '../services/user/user-facade.service';
import { UserFormValidators } from '../validators/user-form.validators';
import { ActionDeleteItem } from '../../../general/type/custom-type';

const MIN_LENGTH = 2;
const ROLE_LENGTH = 0;
const ROLE_FIELD_INDEX = -1;

@Component({
  selector: 'app-collaborator-page',
  standalone: true,
  imports: [CommonModule, TableComponent, ReactiveFormsModule],
  templateUrl: './collaborator-page.component.html',
  styleUrl: './collaborator-page.component.scss',
})
export class CollaboratorPageComponent {
  private readonly _formBuilder: FormBuilder = inject(FormBuilder);
  private readonly _cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  private readonly _userHttpService: UserHttpService = inject(UserHttpService);
  private readonly _sanitizeService: UserSanitizeService = inject(UserSanitizeService);

  readonly usersFacadeService: UserFacadeService = inject(UserFacadeService);

  signUpForm!: FormGroup;

  columns: Column[] = [
    { field: 'lastname', header: 'Nom', type: 'object' as const },
    { field: 'firstname', header: 'Prénom', type: 'object' as const },
    { field: 'phone', header: 'Téléphone', type: 'object' as const },
    { field: 'roles', header: 'Fonction', type: 'array' as const },
  ];

  mainFieldsConfig: string[] = ['id', 'lastname', 'firstname', 'phone', 'email', 'profession', 'degree', 'degreeExpirationDate'];

  form: {
    field: string;
    label: string;
    type: string;
    required: boolean;
    options?: { label: string; value: ActionDeleteItem }[];
  }[] = [
    { field: 'lastname', label: 'Nom', type: 'text', required: true },
    { field: 'firstname', label: 'Prénom', type: 'text', required: true },
    { field: 'phone', label: 'Téléphone', type: 'tel', required: true },
    {
      field: 'roles',
      label: 'Rôles',
      type: 'multiselect',
      required: true,
      options: [{
        value: { id: 'ROLE_ADMIN' },
        label: 'Administrateur'
      }, {
        value: { id: 'ROLE_REGULATEUR' },
        label: 'Régulateur'
      }, {
        value: { id: 'ROLE_AMBULANCIER' },
        label: 'Ambulancier'
      }]
    },
    { field: 'email', label: 'Email', type: 'email', required: false },
    { field: 'degree', label: 'Diplôme', type: 'text', required: false },
    { field: 'degreeExpirationDate', label: 'Renouvellement Diplôme', type: 'date', required: false },
  ];

  globalFilterFields: string[] = ['firstname', 'lastname', 'phone', 'function'];

  fieldToShow: string = 'firstname';
  fieldToShowTwo: string = 'lastname';

  data$: Observable<UserTableDTO[]> = this._sanitizeService.sanitizePhone(this.usersFacadeService.getAll$());
  complexColumns: {
    field: string;
    header: string;
    type: "array" | "object";
    displayField?: string;
    formatter?: (value: ActionDeleteItem) => string
  }[];

  constructor() {
    this.complexColumns = [
      {
        field: 'roles',
        header: 'Fonction',
        type: 'array',
        displayField: 'label',
        formatter: (value: ActionDeleteItem) => value.label,
      },
      {
        field: 'profession',
        header: 'Profession',
        type: 'object',
        displayField: 'label',
      },
    ];
    this.initForm();
  }

  initForm(): void {
    this.signUpForm = this._formBuilder.group(
      {
        firstname: new FormControl('', [Validators.required, UserFormValidators.minLengthValidator(MIN_LENGTH)]),
        lastname: new FormControl('', [Validators.required, UserFormValidators.minLengthValidator(MIN_LENGTH)]),
        phone: new FormControl('', [UserFormValidators.phoneNumber()]),
        email: new FormControl('', {
          validators: [Validators.required, UserFormValidators.emailFormat()],
          asyncValidators: [UserFormValidators.emailUniquenessValidator(this._userHttpService)],
          updateOn: 'blur',
        }),
        profession: new FormControl([]),
        roles: new FormControl([]),
        degree: new FormControl(''),
        degreeExpirationDate: new FormControl(''),
      },
      {
        validators: [UserFormValidators.roleBasedDegreeFields()],
      }
    );
  }
}
